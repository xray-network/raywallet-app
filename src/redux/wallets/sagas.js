import { all, takeEvery, put, take, call, select } from 'redux-saga/effects'
import store from 'store'
import { AES, enc as EncodeTo } from 'crypto-js'
import { message } from 'antd'
// import * as CardanoUtils from 'utils/ray-cardano-utils'
import * as Cardano from 'utils/ray-cardano-crypto'
import * as Explorer from 'services/api/cardano'
import * as Github from 'services/api/github'
import * as Coingecko from 'services/api/coingecko'
import actions from './actions'

export function* CHANGE_SETTING({ payload: { setting, value } }) {
  yield put({
    type: 'wallets/SET_STATE',
    payload: {
      [setting]: value,
    },
  })
}

export function* ADD_WALLET({ payload: { mnemonic } }) {
  const { walletList } = yield select((state) => state.wallets)
  const firstWord = mnemonic.split(' ')[0]

  const accountInfo = yield call(Cardano.CardanoGetAccountInfo, mnemonic)

  const walletExist = walletList.some((item) => item.accountId === accountInfo.rewardAddressBech32)
  if (walletExist) {
    message.warning('Wallet already added')
    return
  }

  const newWallet = {
    order: walletList.length,
    accountId: accountInfo.rewardAddressBech32,
    publicKey: accountInfo.publicKeyBech32,
    privateKey: accountInfo.privateKeyBech32,
    password: '',
    name: `${firstWord.charAt(0).toUpperCase() + firstWord.slice(1)} Wallet`,
    encrypted: false,
  }

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletList',
      value: [...walletList, newWallet],
    },
  })

  yield put({
    type: 'wallets/CHANGE_WALLET',
    payload: {
      accountId: newWallet.accountId,
    },
  })
}

export function* CHANGE_WALLET({ payload: { accountId } }) {
  const { walletList } = yield select((state) => state.wallets)
  const selectedWallet = walletList.filter((item) => item.accountId === accountId)[0]

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletParams',
      value: selectedWallet,
    },
  })

  yield put({
    type: 'wallets/FETCH_WALLET_DATA',
  })
}

export function* ENCRYPT_WALLET({ payload: { password } }) {
  const { walletList, walletParams } = yield select((state) => state.wallets)

  const encryptedWalletList = walletList.filter((item) => item.encrypted)
  const encryptedWallet = {
    ...walletParams,
    privateKey: AES.encrypt(walletParams.privateKey, password).toString(),
    password: AES.encrypt(password, password).toString(),
    encrypted: true,
  }

  // replace wallet with encrypted
  const updatedWallet = walletList.filter((item) => item.accountId === walletParams.accountId)
  const updatedWalletIndex = walletList.indexOf(updatedWallet[0])
  walletList[updatedWalletIndex] = encryptedWallet

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletList',
      value: walletList,
    },
  })

  // save encrypted wallets to localstorage
  store.set('RAY.walletList', [...encryptedWalletList, encryptedWallet])

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletParams',
      value: encryptedWallet,
    },
  })

  message.success('Wallet was saved')
}

export function* DECRYPT_WALLET({ payload: { password } }) {
  const { walletList, walletParams } = yield select((state) => state.wallets)

  try {
    const pass = AES.decrypt(walletParams.password, password).toString(EncodeTo.Utf8)
    if (pass !== password) {
      message.error('Wrong password')
    }
  } catch {
    message.error('Wrong password')
    return
  }

  if (AES.decrypt(walletParams.password, password).toString(EncodeTo.Utf8) !== password) {
    return
  }

  const decryptedWallet = {
    ...walletParams,
    privateKey: AES.decrypt(walletParams.privateKey, password).toString(EncodeTo.Utf8),
    password: '',
    encrypted: false,
  }

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletParams',
      value: decryptedWallet,
    },
  })

  // update wallets list
  const updatedWallet = walletList.filter((item) => item.accountId === walletParams.accountId)
  const updatedWalletIndex = walletList.indexOf(updatedWallet[0])
  walletList[updatedWalletIndex] = decryptedWallet

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletList',
      value: walletList,
    },
  })

  // remove from localstorage array
  const storedWalletList = store.get('RAY.walletList') || []
  const storedWallet = storedWalletList.filter((item) => item.accountId === walletParams.accountId)
  const storedWalletIndex = storedWalletList.indexOf(storedWallet[0])
  storedWalletList.splice(storedWalletIndex, 1)
  store.set('RAY.walletList', storedWalletList)

  message.success('Wallet was disconnected')
}

export function* GET_PUBLIC_ADRESSES() {
  const { publicKey } = yield select((state) => state.wallets.walletParams)
  const walletAddresses = yield call(Cardano.CardanoGetAccountAdresses, publicKey)
  if (walletAddresses) {
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'walletAddresses',
        value: walletAddresses,
      },
    })
  }
}

export function* GET_NETWORK_STATE() {
  const networkInfo = yield call(Explorer.GetNetworkInfo)
  if (networkInfo) {
    const { cardano } = networkInfo.data
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'networkInfo',
        value: cardano,
      },
    })
  }
}

export function* GET_VERIFIED_TOKENS_LIST() {
  const verifiedTokensList = yield call(
    Github.GetRawUrl,
    '/ray-network/cardano-verified-tokens-list/main/list.json',
  )
  if (verifiedTokensList) {
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'verifiedTokensList',
        value: verifiedTokensList,
      },
    })
  }
}

export function* GET_EXCHANGE_RATES() {
  const exchangeRates = yield call(
    Coingecko.GetRawUrl,
    '/simple/price?ids=bitcoin,cardano&vs_currencies=USD,EUR',
  )
  if (exchangeRates) {
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'exchangeRates',
        value: exchangeRates,
      },
    })
  }
}

export function* GET_UTXO_STATE() {
  const { publicKey, accountId } = yield select((state) => state.wallets.walletParams)

  const getAssetsSummary = (processAddresses) => {
    const assetsSummary = {
      value: 0,
      tokens: {},
    }

    processAddresses.forEach((addr) => {
      assetsSummary.value += parseInt(addr.value, 10)
      const { tokens } = addr
      if (tokens.length) {
        tokens.forEach((token) => {
          const { assetId, quantity, assetName } = token
          if (!assetsSummary.tokens[assetId]) {
            assetsSummary.tokens[assetId] = {}
          }
          assetsSummary.tokens[assetId].assetId = assetId
          assetsSummary.tokens[assetId].ticker = assetName
          assetsSummary.tokens[assetId].quantity = assetsSummary.tokens[assetId].quantity
            ? parseInt(assetsSummary.tokens[assetId].quantity, 10) + parseInt(quantity, 10)
            : parseInt(quantity, 10)
        })
      }
    })

    return {
      value: assetsSummary.value,
      tokens: Object.keys(assetsSummary.tokens).map((key) => assetsSummary.tokens[key]),
    }
  }

  function* checkAddresses(type, shift, pageSize) {
    const tmpAddresses = yield call(
      Cardano.CardanoGetAccountAdresses,
      publicKey,
      type,
      shift,
      pageSize,
    )
    const tmpAddresssesUTXO = yield call(Explorer.GetAdressesUTXO, tmpAddresses)
    return [tmpAddresssesUTXO, tmpAddresses]
  }

  const UTXOArray = []
  const adressesArray = []
  const pageSize = 20
  const type = 'all'
  const maxShiftIndex = 10
  let shiftIndex = 0
  function* getAddressesWithShift(shift) {
    const [adresssesWithUTXOs, checkedAdresses] = yield call(checkAddresses, type, shift, pageSize)
    adressesArray.push(...checkedAdresses)
    if (adresssesWithUTXOs.data && shiftIndex < maxShiftIndex) {
      if (adresssesWithUTXOs.data.utxos.length) {
        shiftIndex += 1
        UTXOArray.push(...adresssesWithUTXOs.data.utxos)
        yield call(getAddressesWithShift, shiftIndex)
      }
    }
  }
  yield call(getAddressesWithShift, shiftIndex)

  const assetsSummary = getAssetsSummary(UTXOArray)
  const {
    data: { transactions },
  } = yield call(Explorer.GetTransactions, adressesArray)
  const transactionsHashes = transactions.map((tx) => tx.hash)
  const transactionsInputsOutputs = yield call(Explorer.GetTransactionsIO, transactionsHashes)
  const rawTransactions = transactionsInputsOutputs.data.transactions

  const transformedTransactions = rawTransactions.map((tx) => {
    let inputAmount = 0
    let outputAmount = 0
    const tokens = {}

    tx.inputs.forEach((input) => {
      if (adressesArray.includes(input.address)) {
        inputAmount += parseInt(input.value, 10)
        input.tokens.forEach((token) => {
          if (!tokens[token.assetId]) {
            tokens[token.assetId] = {
              quantity: 0,
            }
          }
          tokens[token.assetId].assetId = token.assetId
          tokens[token.assetId].ticker = token.assetName
          tokens[token.assetId].quantity =
            parseInt(tokens[token.assetId].quantity, 10) - parseInt(token.quantity, 10)
        })
      }
    })
    tx.outputs.forEach((output) => {
      if (adressesArray.includes(output.address)) {
        outputAmount += parseInt(output.value, 10)
        output.tokens.forEach((token) => {
          if (!tokens[token.assetId]) {
            tokens[token.assetId] = {
              quantity: 0,
            }
          }
          tokens[token.assetId].assetId = token.assetId
          tokens[token.assetId].ticker = token.assetName
          tokens[token.assetId].quantity =
            parseInt(tokens[token.assetId].quantity, 10) + parseInt(token.quantity, 10)
        })
      }
    })

    return {
      ...tx,
      type: inputAmount ? 'send' : 'receive',
      value: outputAmount - inputAmount,
      tokens: Object.keys(tokens).map((key) => tokens[key]),
    }
  })

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletAssetsSummary',
      value: assetsSummary,
    },
  })

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletTransactions',
      value: transformedTransactions,
    },
  })

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletUTXOs',
      value: UTXOArray,
    },
  })

  // save assets state
  const walletStore = yield select((state) => state.wallets.walletStore)
  const walletStoreUpdated = {
    ...walletStore,
    [accountId]: assetsSummary,
  }
  store.set('RAY.walletStore', walletStoreUpdated)
  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletStore',
      value: walletStoreUpdated,
    },
  })
}

export function* FETCH_WALLET_DATA() {
  const { publicKey } = yield select((state) => state.wallets.walletParams)
  if (!publicKey) {
    return
  }

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletLoading',
      value: true,
    },
  })

  yield call(GET_PUBLIC_ADRESSES)
  yield call(GET_NETWORK_STATE)
  yield call(GET_EXCHANGE_RATES)
  yield call(GET_VERIFIED_TOKENS_LIST)

  // wait network state
  yield take(GET_NETWORK_STATE)
  const { tip } = yield select((state) => state.wallets.networkInfo)
  if (tip) {
    yield call(GET_UTXO_STATE)
    // yield call(GET_STAKE_STATE)
  }

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletLoading',
      value: false,
    },
  })
}

export function* SETUP() {
  const { walletList } = yield select((state) => state.wallets)
  if (walletList.length) {
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'walletParams',
        value: walletList[0],
      },
    })
  }
  yield put({
    type: 'wallets/FETCH_WALLET_DATA',
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CHANGE_SETTING, CHANGE_SETTING),
    takeEvery(actions.FETCH_WALLET_DATA, FETCH_WALLET_DATA),
    takeEvery(actions.CHANGE_WALLET, CHANGE_WALLET),
    takeEvery(actions.ADD_WALLET, ADD_WALLET),
    takeEvery(actions.GET_PUBLIC_ADRESSES, GET_PUBLIC_ADRESSES),
    takeEvery(actions.GET_NETWORK_STATE, GET_NETWORK_STATE),
    takeEvery(actions.GET_VERIFIED_TOKENS_LIST, GET_VERIFIED_TOKENS_LIST),
    takeEvery(actions.GET_EXCHANGE_RATES, GET_EXCHANGE_RATES),
    takeEvery(actions.GET_UTXO_STATE, GET_UTXO_STATE),
    takeEvery(actions.ENCRYPT_WALLET, ENCRYPT_WALLET),
    takeEvery(actions.DECRYPT_WALLET, DECRYPT_WALLET),
    SETUP(), // run once on app load to init listeners
  ])
}
