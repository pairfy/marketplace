use aiken/collection/list
use cardano/transaction.{OutputReference, Transaction, NoDatum, Input, InlineDatum, Output}
use cardano/assets.{PolicyId}
use cardano/assets
use aiken/collection/dict
use aiken/crypto.{VerificationKeyHash}
use cardano/address.{Address, Script}
use aiken/interval

type POSIXTime =
  Int

pub type ThreadTokenInput {
  Mint
  Burn
}

validator threadtoken(token_name: ByteArray, utxo_ref: OutputReference, _timestamp: POSIXTime) {
   mint(redeemer: ThreadTokenInput, policy_id: PolicyId, self: Transaction) -> Bool {
    let Transaction { inputs, mint, .. } = self

    expect [Pair(asset_name, amount)] =
      mint
        |> assets.tokens(policy_id)
        |> dict.to_pairs()

    when redeemer is {
      Mint -> {
        expect Some(_input) = list.find(inputs, fn(input) { input.output_reference == utxo_ref })
       
        let must_be_amount = amount == 1

        let must_be_name = asset_name == token_name

        and {
            must_be_amount?,
            must_be_name?
        }
      }

      Burn -> amount == -1 && asset_name == token_name
    }
  }
}

pub type StateMachineDatum {
  state: Int
}

pub type StateMachineInput {
  Return
  Locking
}

validator statemachine(threadtoken: PolicyId, seller: VerificationKeyHash, buyer: VerificationKeyHash, price: Int, collateral: Int, pending_until: POSIXTime) {
  spend(
    datum_opt: Option<StateMachineDatum>,
    redeemer: StateMachineInput,
    own_ref: OutputReference,
    self: Transaction,
  ) -> Bool {
        expect Some(datum) = datum_opt
        
        when (datum, redeemer) is {
          (StateMachineDatum { state }, Return) -> {

            let must_be_time = when self.validity_range.lower_bound.bound_type is {
              interval.Finite(tx_earliest_time) -> pending_until <= tx_earliest_time
              _ -> False
              }

            let must_be_state = state == 0  

            let must_be_signed = list.has(self.extra_signatories, buyer)

            //One of the transaction inputs belongs to the statemachine.
            expect Some(sm_input) = list.find(self.inputs, fn(input) { input.output_reference == own_ref })  
            //One of the transaction outputs contains the threadtoken addressed to the statemachine itself - 1.

            expect Some(sm_output) = list.find(self.outputs, fn(output) { output.address == sm_input.output.address })
            //One of the transaction outputs contains the threadtoken addressed to the statemachine itself - 2.

            let must_be_policy = list.has(assets.policies(sm_output.value), threadtoken)
            
            //verification of the new datum - 1.
            let new_data: Data = StateMachineDatum {
              state : -1,
            }
            //verification of the new datum - 2.
            let must_be_datum = InlineDatum(new_data) == sm_output.datum

            and {
              must_be_time?,
              must_be_state?,
              must_be_signed?,
              must_be_policy?,
              must_be_datum?
            }
          }
          (StateMachineDatum{ state }, Locking) -> {
            
            let must_be_signed = list.has(self.extra_signatories, seller)

            let must_be_state = state == 0
            
            let must_be_collateral = collateral == price //WARNING

            and{
              must_be_signed?,
              must_be_state?,
              must_be_collateral?
            }
          }
        }
  }
}




test statemachine_return() {
  let own_ref =
    OutputReference {
      transaction_id: #"ee220ba9258ef159bb44f0d3522b840a80475eac2df7176f2c513d59a2ead71f",
      output_index: 0,
    }
  let threadtoken = #"99999999999999999999999999999999999999999999999999999999"
  let token_name = #"02"
  let own_script_hash = #"88888888888888888888888888888888888888888888888888888888" // self statemachine hash
  let seller_pubkeyhash = #"00000000000000000000000000000000000000000000000000000000"
  let buyer_pubkeyhash = #"77777777777777777777777777777777777777777777777777777777"  
  let pending_until = 3
  let price = 50000000
  let collateral = 25000000
  /////////////INPUT/////////////
  let input_utxo =
    Input {
      output_reference: own_ref,
      output: Output {
        address: Address {
          payment_credential: Script(own_script_hash),
          stake_credential: None,
        },
        value: assets.add(
          assets.from_lovelace(25_000_000),
          threadtoken,
          token_name,
          1,
        ),
        datum: NoDatum,
        reference_script: None,
      },
    }
  /////////////INPUT/////////////  
  let new_data: Data = StateMachineDatum {
      state : -1
  }  

  let new_datum = InlineDatum(new_data)

  let output =
    Output {
      address: Address {
        payment_credential: Script(own_script_hash),
        stake_credential: None,
      },
      value: assets.add(
        assets.from_lovelace(25_000_000),
        threadtoken,
        token_name,
        1,
      ),
      datum: new_datum,
      reference_script: None,
    }

  let redeemer = Return       //StateMachineInput


  let old_datum = StateMachineDatum {
    state: 0,
  }


  let transaction =
    Transaction {
      inputs: [input_utxo],
      reference_inputs: [],
      outputs: [output],
      fee: transaction.placeholder.fee,
      mint: transaction.placeholder.mint,
      certificates: [],
      withdrawals: [],
      validity_range: interval.after(pending_until),
      extra_signatories: [buyer_pubkeyhash],
      redeemers: [],
      datums: transaction.placeholder.datums,
      id: transaction.placeholder.id,
      votes: transaction.placeholder.votes,
      proposal_procedures: transaction.placeholder.proposal_procedures,
      current_treasury_amount: transaction.placeholder.current_treasury_amount,
      treasury_donation: transaction.placeholder.treasury_donation
    }

  statemachine.spend(threadtoken, seller_pubkeyhash, buyer_pubkeyhash, price, collateral, pending_until, Some(old_datum), redeemer, own_ref, transaction)
}