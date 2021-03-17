import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import store from 'store'
import * as api from 'services/api'
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

  const newWallet = {
    order: walletList.length,
    accountId: Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7),
    mnemonic,
    password: '',
    name: `${firstWord.charAt(0).toUpperCase() + firstWord.slice(1)} Wallet`,
    encrypted: false,
  }

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

export function* FETCH_WALLET_DATA() {
  const { accountId } = yield select((state) => state.wallets.walletParams)
  if (!accountId) {
    return
  }

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletLoading',
      value: true,
    },
  })
  const response = yield call(api.getWalletData, accountId)
  if (response) {
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'walletData',
        value: {
          assets: response.assets,
          transactions: response.transactions,
          addresses: response.addresses,
        },
      },
    })

    const tickers = response.assets.map((asset) => asset.ticker)
    const { walletStore } = yield select((state) => state.wallets)
    store.set('RAY.walletStore', {
      ...store.get('RAY.walletStore'),
      [accountId]: {
        tickers,
      },
    })
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'walletStore',
        value: {
          ...walletStore,
          [accountId]: {
            tickers,
          },
        },
      },
    })
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
    SETUP(), // run once on app load to init listeners
  ])
}
