import * as CardanoWasm from '@emurgo/cardano-serialization-lib-browser'
import { Wallet } from '@cardano-foundation/cardano-connect-with-wallet-core'
import { Lucid } from 'lucid-cardano'
import { Buffer } from 'buffer'

let enabledWalletAPI = null

const lucidClient = await Lucid.new()

const walletEnabledEvent = new CustomEvent('walletEnabledEvent', {
  detail: {
    payload: 'wallet enabled',
  },
})

const getWallet = async () => {
  if (!enabledWalletAPI) {
    await reconnect()
  }

  return enabledWalletAPI
}

/**Connect and enable wallet. */
const connect = async (walletName) => {
  await Wallet.connect(walletName, 'testnet', async () => {
    enabledWalletAPI = await window.cardano[walletName].enable()

    localStorage.setItem('enabled-wallet', walletName)

    console.log('ENABLED ' + walletName)
  })
}

/**Connect the last enabled wallet. */
const reconnect = async () => {
  const walletName = localStorage.getItem('enabled-wallet')

  if (walletName !== null) {
    await connect(walletName)
    console.log('RECONNECTED ' + walletName)
  } else {
    return false
  }
}

const getAddress = async () => {
  if (!enabledWalletAPI) {
    await reconnect()
  }

  const address = await enabledWalletAPI.getUsedAddresses()

  return address[0]
}

const getBalance = async () => {
  if (!enabledWalletAPI) {
    await reconnect()

    return 0
  }

  const balance = await enabledWalletAPI.getBalance()

  const value = CardanoWasm.Value.from_bytes(Buffer.from(balance, 'hex'))

  const lovelace = BigInt(value.coin().to_str())

  const adaBalance = lovelace / 1_000_000n

  return adaBalance.toString()
}

const getMessage = () => {
  const message = 'SIGN TO AUTHENTICATE YOUR PUBLIC SIGNATURE'

  return Buffer.from(message, 'utf8').toString('hex')
}

const signMessage = async () => {
  if (!enabledWalletAPI) {
    await reconnect()
  }

  const address = await getAddress()

  const signature = await enabledWalletAPI.signData(address, getMessage())

  return [signature, address]
}

/** Starts the service that allows listening to global events when a wallet is connected. */
const startWalletService = async () => {
  Wallet.startInjectWalletListener()

  Wallet.addEventListener('enabledWallet', async (walletName) => {
    const isEnabled = await window.cardano[walletName].isEnabled()

    if (isEnabled) {
      localStorage.setItem('enabled-wallet', walletName)

      lucidClient.selectWallet(getWallet())

      window.dispatchEvent(walletEnabledEvent)

      console.info('ENABLED_WALLET', walletName)
    }
  })

  await reconnect()
}

const stopWalletService = () => {
  Wallet.disconnect()

  Wallet.removeEventListener('enabled', (e) => {
    console.log('enabled', e)
  })
  Wallet.removeEventListener('connecting', (e) => {
    console.log('connecting', e)
  })

  Wallet.removeEventListener('connected', (e) => {
    console.log('connected', e)
  })

  Wallet.removeEventListener('enabledWallet', (e) => {
    console.log('enabled', e)
  })

  Wallet.removeEventListener('accountBalance', (e) => {
    console.log('balance', e)
  })

  Wallet.stopInjectWalletListener()
}

const walletClient = () => {
  return {
    startWalletService,
    stopWalletService,
    connect,
    reconnect,
    getWallet,
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const balanceTx = async (unbalancedTx) => {
  const utx = CardanoWasm.Transaction.from_hex(unbalancedTx)

  console.log(utx)

  const tx = CardanoWasm.Transaction.new(utx.body(), utx.witness_set())

  let txVkeyWitnesses = await enabledWalletAPI.signTx(
    Buffer.from(tx.to_bytes(), 'utf8').toString('hex'),
    true,
  )

  txVkeyWitnesses = CardanoWasm.TransactionWitnessSet.from_bytes(
    Buffer.from(txVkeyWitnesses, 'hex'),
  )

  const newTransactionWitnessSet = utx.witness_set()

  newTransactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys())

  const signedTx = CardanoWasm.Transaction.new(tx.body(), newTransactionWitnessSet)

  console.log('NEWBODY', signedTx.to_json())

  return enabledWalletAPI.submitTx(Buffer.from(signedTx.to_bytes(), 'utf8').toString('hex'))
}

export {
  getBalance,
  walletClient,
  CardanoWasm,
  balanceTx,
  lucidClient,
  signMessage,
  getAddress,
  getMessage,
}
