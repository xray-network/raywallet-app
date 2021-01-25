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

export function* FETCH_WALLET_DATA({ payload: { walletId } }) {
  const { wallet } = yield select((state) => state.wallets)
  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'wallet',
      value: {
        ...wallet,
        loading: true,
      },
    },
  })
  const response = yield call(api.getWalletData, walletId)
  if (response) {
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'wallet',
        value: {
          ...wallet,
          loading: false,
          data: {
            ...response,
          },
        },
      },
    })
  }
  if (!response) {
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'wallet',
        value: {
          ...wallet,
          loading: false,
        },
      },
    })
  }
}

export function* SETUP() {
  const { walletsList, wallet } = yield select((state) => state.wallets)
  if (walletsList[0]) {
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'wallet',
        value: {
          ...wallet,
          selected: walletsList[0].id,
        },
      },
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CHANGE_SETTING, CHANGE_SETTING),
    takeEvery(actions.FETCH_WALLET_DATA, FETCH_WALLET_DATA),
    SETUP(), // run once on app load to init listeners
  ])
}
