import { all, takeEvery, put, select, call, take } from 'redux-saga/effects'
import * as Cardano from 'utils/ray-cardano-crypto'
import * as Explorer from 'services/api/cardano'
import BigNumber from 'bignumber.js'
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
  const { value, toAddress, type } = payload

  if (type) {
    yield put({
      type: 'transactions/SET_STATE',
      payload: {
        transactionLoading: true,
      },
    })
    yield call(FETCH_NETWORK_STATE)
    yield take(FETCH_NETWORK_STATE)
  }

  const [changeAddress] = yield select((state) => state.wallets.walletAddresses)
  const networkInfo = yield select((state) => state.wallets.networkInfo)
  const walletUTXOs = yield select((state) => state.wallets.walletUTXOs)
  const currentSlot = networkInfo.tip?.slotNo
  const metadata = undefined
  const computedValue = new BigNumber(value).multipliedBy(1000000).toFixed()

  const response = yield call(
    Cardano.CardanoBuildTx,
    computedValue,
    toAddress,
    changeAddress,
    currentSlot,
    walletUTXOs,
    metadata,
  )

  yield put({
    type: 'transactions/SET_STATE',
    payload: {
      transaction: response,
    },
  })

  if (type) {
    yield put({
      type: 'transactions/SET_STATE',
      payload: {
        transactionType: type,
      },
    })
  }

  yield put({
    type: 'transactions/SET_STATE',
    payload: {
      transactionLoading: false,
    },
  })
}

export function* SEND_TX({ payload }) {
  yield put({
    type: 'transactions/SET_STATE',
    payload: {
      transactionWaiting: true,
    },
  })

  const { transaction, privateKey } = payload
  const signedTx = yield call(Cardano.CardanoSignTx, transaction, privateKey)
  const sendTx = yield call(Explorer.SendTransaction, signedTx)
  if (sendTx) {
    const transactionHash = sendTx.data?.submitTransaction?.hash
    yield put({
      type: 'transactions/SET_STATE',
      payload: {
        transactionWaitingHash: transactionHash,
      },
    })
  }

  yield put({
    type: 'transactions/SET_STATE',
    payload: {
      transactionWaiting: false,
    },
  })
}

export function* CHECK_TX({ payload }) {
  const { hash } = payload
  const success = yield call(Explorer.GetTransactionsIO, [hash])
  if (success.data?.transactions?.length) {
    yield put({
      type: 'transactions/SET_STATE',
      payload: {
        transactionSuccess: true,
      },
    })
  }
}

export function* CLEAR_TX() {
  yield put({
    type: 'transactions/SET_STATE',
    payload: {
      transactionLoading: false,
      transactionType: '',
      transaction: {},
      transactionWaitingHash: '',
      transactionSuccess: false,
    },
  })
}

export default function* rootSaga() {
  yield all([takeEvery(actions.CHANGE_SETTING, CHANGE_SETTING)])
  yield all([takeEvery(actions.BUILD_TX, BUILD_TX)])
  yield all([takeEvery(actions.SEND_TX, SEND_TX)])
  yield all([takeEvery(actions.CLEAR_TX, CLEAR_TX)])
  yield all([takeEvery(actions.CHECK_TX, CHECK_TX)])
}
