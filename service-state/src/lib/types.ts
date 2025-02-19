import { Data } from "@lucid-evolution/lucid";

export interface UtxoResponse {
  code: number;
  utxo: any;
}

export const StateMachineDatum = Data.Object({
  state: Data.Integer(),
  delivery: Data.Nullable(Data.Integer()),
});

type DatumType = Data.Static<typeof StateMachineDatum>;

const DatumType = StateMachineDatum as unknown as DatumType;

export interface TransactionSchema {
  hash: string; // Transaction hash
  block: string; // Block hash
  block_height: number; // Block number
  block_time: number; // Block creation time in UNIX time
  slot: number; // Slot number
  index: number; // Transaction index within the block
  output_amount: Array<{
    unit: string; // The unit of the value
    quantity: string; // The quantity of the unit
  }>; // The sum of all the UTXO per asset
  fees: string; // Fees of the transaction in Lovelaces
  deposit: string; // Deposit within the transaction in Lovelaces
  size: number; // Size of the transaction in Bytes
  invalid_before: string | null; // Left (included) endpoint of the timelock validity intervals
  invalid_hereafter: string | null; // Right (excluded) endpoint of the timelock validity intervals
  utxo_count: number; // Count of UTXOs within the transaction
  withdrawal_count: number; // Count of the withdrawals within the transaction
  mir_cert_count: number; // Count of the MIR certificates within the transaction
  delegation_count: number; // Count of the delegations within the transaction
  stake_cert_count: number; // Count of the stake keys (de)registration within the transaction
  pool_update_count: number; // Count of the stake pool registration and update certificates within the transaction
  pool_retire_count: number; // Count of the stake pool retirement certificates within the transaction
  asset_mint_or_burn_count: number; // Count of asset mints and burns within the transaction
  redeemer_count: number; // Count of redeemers within the transaction
  valid_contract: boolean; // True if contract script passed validation
}

interface MetadataItem {
  label: string; // Metadata label
  json_metadata: string | { [key: string]: any }; // Content of the metadata
}

export type MetadataArray = MetadataItem[];

export type GetTxInfoResponse = TransactionSchema & { metadata: MetadataArray };

