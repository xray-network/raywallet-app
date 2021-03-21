import { all, takeEvery, put, take, call, select } from 'redux-saga/effects'
import store from 'store'
import * as Cardano from 'services/ray-cardano-crypto'
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

  const newWallet = {
    order: walletList.length,
    accountId: accountInfo.rewardAddressBech32,
    publicKey: accountInfo.publicKeyBech32,
    privateKey: accountInfo.privateKeyBech32,
    password: '',
    name: `${firstWord.charAt(0).toUpperCase() + firstWord.slice(1)} Wallet`,
    encrypted: false,
  }

  store.set('RAY.walletList', [...walletList, newWallet])

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
  const getAssetsSummary = (processAdrresses) => {
    const assetsSummary = {}
    processAdrresses.forEach((addr) => {
      const { assetBalances } = addr.summary
      assetBalances.forEach((asset) => {
        const { assetId, quantity, assetName } = asset
        // console.log(addr.address, quantity)
        if (!assetsSummary[assetId]) {
          assetsSummary[assetId] = {}
        }
        assetsSummary[assetId].ticker = assetName
        assetsSummary[assetId].quantity = assetsSummary[assetId].quantity
          ? parseInt(assetsSummary[assetId].quantity, 10) + parseInt(quantity, 10)
          : parseInt(quantity, 10)
      })
    })

    // normalize
    const assetsSummaryArray = Object.keys(assetsSummary).map((key) => {
      return {
        assetId: key,
        ticker: assetsSummary[key].ticker,
        amount: assetsSummary[key].quantity,
      }
    })

    return [assetsSummaryArray, assetsSummary]
  }

  // const addressesFound = []
  // const maxShift = 20
  const pageSize = 20
  const { publicKey, accountId } = yield select((state) => state.wallets.walletParams)
  const {
    tip: { number: queryAtBlock },
  } = yield select((state) => state.wallets.networkInfo)

  // generate and fetch internal / external adressess data
  const fetchAddresses = (shift = 0) =>
    [0, 1].map((type) => {
      return call(function* getAddr() {
        const queryAddressesPack = yield call(
          Cardano.CardanoGetAccountAdresses,
          publicKey,
          type,
          shift,
          pageSize,
        )
        const receivedAddressAmountPack = yield call(
          Explorer.GetAdressesData,
          queryAddressesPack,
          queryAtBlock,
        )
        return receivedAddressAmountPack || []
      })
    })

  const fetchedAddressByType = yield all(fetchAddresses())
  const mergedAdresses = []
  fetchedAddressByType.forEach((item) => {
    const { paymentAddresses } = item.data
    mergedAdresses.push(...paymentAddresses)
  })

  const [walletAssetsSummaryArray, walletAssetsSummary] = getAssetsSummary(mergedAdresses)
  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletAssetsSummary',
      value: walletAssetsSummaryArray,
    },
  })

  // yield put({
  //   type: 'wallets/CHANGE_SETTING',
  //   payload: {
  //     setting: 'walletTransactions',
  //     value: null || [],
  //   },
  // })

  // save assets state
  const walletStore = yield select((state) => state.wallets.walletStore)
  const walletStoreUpdated = {
    ...walletStore,
    [accountId]: walletAssetsSummary,
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

  // wait netowrk state
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
    SETUP(), // run once on app load to init listeners
  ])
}
