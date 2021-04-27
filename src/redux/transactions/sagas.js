import { all, takeEvery, put, select, call, take } from 'redux-saga/effects'
import * as Cardano from 'utils/ray-cardano-crypto'
import * as Explorer from 'services/api/cardano'
import actions from './actions'
import { FETCH_NETWORK_STATE } from '../wallets/sagas'

export function* CHANGE_SETTING({ payload: { setting, value } }) {
  yield put({
    type: 'transactions/SET_STATE',
    payload: {
      [setting]: value,
    },
  })
}

export function* BUILD_TX({ payload }) {
  yield put({
    type: 'transactions/CHANGE_SETTING',
    payload: {
      setting: 'transactionLoading',
      value: true,
    },
  })
  yield call(FETCH_NETWORK_STATE)
  yield take(FETCH_NETWORK_STATE)

  const { value, toAddress, type } = payload
  const [changeAddress] = yield select((state) => state.wallets.walletAddresses)
  const networkInfo = yield select((state) => state.wallets.networkInfo)
  const walletUTXOs = yield select((state) => state.wallets.walletUTXOs)
  const currentSlot = networkInfo.tip?.slotNo
  const metadata = undefined

  const transaction = yield call(
    Cardano.CardanoBuildTx,
    value * 1000000,
    toAddress,
    changeAddress,
    currentSlot,
    walletUTXOs,
    metadata,
  )

  if (transaction) {
    yield put({
      type: 'transactions/CHANGE_SETTING',
      payload: {
        setting: 'transaction',
        value: transaction,
      },
    })
  }

  if (type) {
    yield put({
      type: 'transactions/CHANGE_SETTING',
      payload: {
        setting: 'type',
        value: type,
      },
    })
  }

  yield put({
    type: 'transactions/CHANGE_SETTING',
    payload: {
      setting: 'transactionLoading',
      value: false,
    },
  })
}

export function* SEND_TX({ payload }) {
  const { transaction, privateKey } = payload
  const signedTx = yield call(Cardano.CardanoSignTx, transaction, privateKey)
  const sendTx = yield call(Explorer.SendTransaction, signedTx)
  console.log(sendTx)
}

export default function* rootSaga() {
  yield all([takeEvery(actions.CHANGE_SETTING, CHANGE_SETTING)])
  yield all([takeEvery(actions.BUILD_TX, BUILD_TX)])
  yield all([takeEvery(actions.SEND_TX, SEND_TX)])
}
