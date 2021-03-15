import { all, takeEvery, put, call, select } from 'redux-saga/effects'
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
}

export function* FETCH_WALLET_DATA({ payload: { accountId } }) {
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
  if (walletList[0]) {
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'walletParams',
        value: walletList[0],
      },
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CHANGE_SETTING, CHANGE_SETTING),
    takeEvery(actions.FETCH_WALLET_DATA, FETCH_WALLET_DATA),
    takeEvery(actions.CHANGE_WALLET, CHANGE_WALLET),
    SETUP(), // run once on app load to init listeners
  ])
}
