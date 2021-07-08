import { eventChannel } from 'redux-saga'
import { all, takeEvery, put, select, call, take } from 'redux-saga/effects'
import Cardano from 'services/cardano'
// import BigNumber from 'bignumber.js'
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
  const {
    outputs = [],
    metadata,
    certificates = [],
    withdrawals = [],
    type,
    allowNoOutputs = true,
  } = payload

  const isSend = type !== 'calculate'

  // if build sending transaction update network currentSlot
  if (isSend) {
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

  // const hasStakingKey = yield select((state) => state.wallets.walletStake.hasStakingKey)
  // const rewardsAmount = yield select((state) => state.wallets.walletStake.rewardsAmount)
  // const rewardAddress = yield select((state) => state.wallets.walletParams.rewardAddress)
  // const publicKey = yield select((state) => state.wallets.walletParams.publicKey)

  // if (type === 'delegate') {
  //   const certs = yield call(
  //     Cardano.crypto.generateDelegationCerts,
  //     publicKey,
  //     hasStakingKey,
  //     poolId,
  //   )
  //   certificates.push(...certs)
  // }

  // if (type === 'withdraw') {
  //   withdrawals.push({
  //     address: rewardAddress,
  //     amount: rewardsAmount,
  //   })
  // }

  const { data, error } = yield call(
    Cardano.crypto.txBuild,
    outputs,
    walletUTXOs,
    changeAddress,
    currentSlot,
    metadata,
    certificates,
    withdrawals,
    allowNoOutputs,
  )

  if (data) {
    console.log('tx.build.data', data)
    yield put({
      type: 'transactions/SET_STATE',
      payload: {
        transactionData: data,
      },
    })

    if (isSend) {
      yield put({
        type: 'transactions/SET_STATE',
        payload: {
          transactionType: type,
        },
      })
    }
  }

  if (error) {
    console.log('tx.build.error', error)
    yield put({
      type: 'transactions/SET_STATE',
      payload: {
        transactionData: {},
      },
    })
    yield put({
      type: 'transactions/SET_STATE',
      payload: {
        transactionError: error,
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
  const signedTx = yield call(Cardano.crypto.txSign, transaction, privateKey)
  const { data, errors } = yield call(Cardano.explorer.txSend, signedTx)

  if (data) {
    const transactionHash = data.submitTransaction?.hash
    yield put({
      type: 'transactions/SET_STATE',
      payload: {
        transactionWaitingHash: transactionHash,
      },
    })
  }

  if (errors) {
    console.log(errors)
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
  const { data: success } = yield call(Cardano.explorer.getTxByHash, [hash])
  if (success?.transactions?.length) {
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
      transactionData: {},
      transactionError: {},
      transactionWaitingHash: '',
      transactionWaiting: false,
      transactionSuccess: false,
    },
  })
}

export function* SETUP() {
  const chan = eventChannel((emitter) => {
    window.addEventListener('hashchange', (message) => emitter(message))
    return () => {}
  })

  while (true) {
    yield take(chan)
    yield put({
      type: 'transactions/CLEAR_TX',
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CHANGE_SETTING, CHANGE_SETTING),
    takeEvery(actions.BUILD_TX, BUILD_TX),
    takeEvery(actions.SEND_TX, SEND_TX),
    takeEvery(actions.CLEAR_TX, CLEAR_TX),
    takeEvery(actions.CHECK_TX, CHECK_TX),
    SETUP(), // run once on app load to init listeners
  ])
}
