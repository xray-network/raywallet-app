import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import store from 'store'
// import * as explorer from 'services/api/cardano'
import * as Cardano from 'utils/cardano-js-api'
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

  store.set('RAY.walletList', [
    ...walletList,
    newWallet,
  ])

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletList',
      value: [
        ...walletList,
        newWallet,
      ],
    },
  })

  yield put({
    type: 'wallets/CHANGE_WALLET',
    payload: {
      accountId: newWallet.accountId,
    }
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
  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletLoading',
      value: true,
    },
  })

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

export function* FETCH_WALLET_DATA() {
  const { publicKey } = yield select((state) => state.wallets.walletParams)
  if (!publicKey) {
    return
  }

  yield put({ type: 'wallets/GET_PUBLIC_ADRESSES' })
  // yield put({ type: 'wallets/GET_NETWORK_STATE' })
  // yield put({ type: 'wallets/GET_RAY_TOKENS_LIST' })
  // yield put({ type: 'wallets/GET_EXCHANGE_RATES' })
  // yield put({ type: 'wallets/GET_UTXO_STATE' })
  // yield put({ type: 'wallets/GET_STAKE_STATE' })

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
    SETUP(), // run once on app load to init listeners
  ])
}
