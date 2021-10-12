import { all, takeEvery, put, take, call, select } from 'redux-saga/effects'
import store from 'store'
import { AES, enc as EncodeTo } from 'crypto-js'
import { message } from 'antd'
import Cardano from 'services/cardano'
import BigNumber from 'bignumber.js'
import * as Github from 'services/api/github'
import * as Coingecko from 'services/api/coingecko'
import * as Distr from 'services/distr'
import * as Graphql from 'services/graphql'
import actions from './actions'

const CARDANO_NETWORK = process.env.REACT_APP_NETWORK || 'mainnet'

export function* CHANGE_SETTING({ payload: { setting, value } }) {
  yield put({
    type: 'wallets/SET_STATE',
    payload: {
      [setting]: value,
    },
  })
}

export function* RESOLVER() {
  yield undefined
}

export function* ADD_WALLET({ payload: { mnemonic } }) {
  const { walletList } = yield select((state) => state.wallets)
  const firstWord = mnemonic.split(' ')[0]

  const accountInfo = yield call(Cardano.crypto.getAccountKeys, mnemonic)

  const walletExist = walletList.some((item) => item.accountId === accountInfo.rewardAddressBech32)
  if (walletExist) {
    message.warning('Wallet already added')
    yield put({
      type: 'wallets/CHANGE_WALLET',
      payload: {
        accountId: accountInfo.accountId,
      },
    })
    return
  }

  const newWallet = {
    order: walletList.length,
    accountId: accountInfo.accountId,
    rewardAddress: accountInfo.rewardAddress,
    publicKey: accountInfo.publicKey,
    privateKey: accountInfo.privateKey,
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

  store.set('RAY.walletLast', newWallet.accountId)
}

export function* IMPORT_WALLET({ payload: { data } }) {
  const { walletList } = yield select((state) => state.wallets)

  const walletExist = walletList.some((item) => item.accountId === data.accountId)
  if (walletExist) {
    message.warning('Wallet already added')
    yield put({
      type: 'wallets/CHANGE_WALLET',
      payload: {
        accountId: data.accountId,
      },
    })
    return
  }

  const newWallet = {
    ...data,
    order: walletList.length,
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

  const encryptedWalletList = [...walletList, newWallet].filter((item) => item.encrypted)
  store.set('RAY.walletList', encryptedWalletList)

  message.success('Wallet was added')
}

export function* DELETE_WALLET() {
  const { walletList, walletParams } = yield select((state) => state.wallets)
  const prevWallet = walletList[walletParams.order - 1]
  const nextWallet = walletList[walletParams.order + 1]

  const walletToLoad = prevWallet || nextWallet || {}

  // delete from wallet list
  walletList.splice(walletParams.order, 1)

  // recalculate order
  const reorderedWalletList = walletList.map((item, index) => {
    return {
      ...item,
      order: index,
    }
  })

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletList',
      value: reorderedWalletList,
    },
  })

  yield put({
    type: 'wallets/CHANGE_WALLET',
    payload: {
      accountId: walletToLoad.accountId ? walletToLoad.accountId : 'empty',
    },
  })

  yield put({
    type: 'settings/CHANGE_SETTING',
    payload: {
      setting: 'modalSettings',
      value: false,
    },
  })

  // save encrypted wallets to localstorage
  const encryptedWalletList = reorderedWalletList.filter((item) => item.encrypted)
  store.set('RAY.walletList', encryptedWalletList)

  // success message
  message.success('Wallet was removed from this device')
}

export function* CHANGE_WALLET({ payload: { accountId } }) {
  if (accountId === 'empty') {
    store.remove('RAY.walletLast')

    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'walletParams',
        value: {
          name: '',
          order: 0,
          accountId: '', // stake key hash
          rewardAddress: '', // stake key
          publicKey: '', // xpub
          privateKey: '', // xprv :: encrypted
          password: '', // password :: encrypted
          encrypted: false,
        },
      },
    })
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'walletUTXOs',
        value: [],
      },
    })
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'walletAssetsSummary',
        value: {
          value: 0,
          tokens: [],
        },
      },
    })
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'walletAddresses',
        value: [],
      },
    })
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'walletTransactions',
        value: [],
      },
    })
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'walletStake',
        value: {
          hasStakingKey: false,
          rewardsAmount: 0,
          currentPoolId: '',
          nextRewardsHistory: [],
        },
      },
    })
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'walletStakeRewardsHistory',
        value: [],
      },
    })
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'walletRayRewardsHistory',
        value: [],
      },
    })

    return
  }

  const { walletList } = yield select((state) => state.wallets)
  const selectedWallet = walletList.filter((item) => item.accountId === accountId)[0]

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletParams',
      value: selectedWallet,
    },
  })

  store.set('RAY.walletLast', selectedWallet.accountId)

  yield put({
    type: 'wallets/FETCH_WALLET_DATA',
  })
}

export function* CHANGE_WALLET_NAME({ payload: { name } }) {
  const { walletList, walletParams } = yield select((state) => state.wallets)

  // replace values with changed
  const changedWallet = {
    ...walletParams,
    name,
  }

  // replace wallet with changed
  walletList[walletParams.order] = changedWallet

  // update in-memory wallet list
  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletList',
      value: walletList,
    },
  })

  // update current wallet
  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletParams',
      value: changedWallet,
    },
  })

  // save encrypted wallets to localstorage
  const encryptedWalletList = walletList.filter((item) => item.encrypted)
  store.set('RAY.walletList', encryptedWalletList)
}

export function* ENCRYPT_WALLET({ payload: { password } }) {
  const { walletList, walletParams } = yield select((state) => state.wallets)

  // replace values with encrypted
  const encryptedWallet = {
    ...walletParams,
    privateKey: AES.encrypt(walletParams.privateKey, password).toString(),
    password: AES.encrypt(password, password).toString(),
    encrypted: true,
  }

  // replace wallet with encrypted
  walletList[walletParams.order] = encryptedWallet

  // update in-memory wallet list
  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletList',
      value: walletList,
    },
  })

  // update current wallet
  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletParams',
      value: encryptedWallet,
    },
  })

  // save encrypted wallets to localstorage
  const encryptedWalletList = walletList.filter((item) => item.encrypted)
  store.set('RAY.walletList', encryptedWalletList)

  // success message
  message.success('Wallet was saved')
}

export function* DECRYPT_WALLET({ payload: { password } }) {
  const { walletList, walletParams } = yield select((state) => state.wallets)

  // check if password is valid
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

  // replace values with decrypted
  const decryptedWallet = {
    ...walletParams,
    privateKey: AES.decrypt(walletParams.privateKey, password).toString(EncodeTo.Utf8),
    password: '',
    encrypted: false,
  }

  // replace wallet with decrypted
  walletList[walletParams.order] = decryptedWallet

  // update in-memory wallet list
  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletList',
      value: walletList,
    },
  })

  // update current wallet
  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletParams',
      value: decryptedWallet,
    },
  })

  // remove wallet from localstorage
  const encryptedWalletList = walletList.filter((item) => item.encrypted)
  store.set('RAY.walletList', encryptedWalletList)

  // success message
  message.success('Wallet was disconnected')
}

export function* GET_PUBLIC_ADRESSES() {
  const { publicKey } = yield select((state) => state.wallets.walletParams)
  const walletAddresses = yield call(Cardano.crypto.getAccountAddresses, publicKey)
  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletAddresses',
      value: walletAddresses.map((address) => address.address),
    },
  })
}

export function* FETCH_NETWORK_STATE() {
  const networkInfo = yield call(Cardano.explorer.getNetworkInfo)
  const cardano = networkInfo?.data?.data?.cardano

  if (cardano) {
    const startedAt = cardano.currentEpoch?.startedAt
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'networkInfo',
        value: cardano,
      },
    })
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'epochEndIns',
        value: new Date(startedAt).getTime() + 5 * 24 * 60 * 60 * 1000,
      },
    })
  }
  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {},
  })
}

export function* GET_VERIFIED_TOKENS_LIST() {
  if (CARDANO_NETWORK === 'mainnet') {
    const verifiedTokensList = yield call(
      Github.GetRawUrl,
      '/ray-network/cardano-verified/main/tokens/list.json',
    )

    if (verifiedTokensList?.data) {
      yield put({
        type: 'wallets/CHANGE_SETTING',
        payload: {
          setting: 'verifiedTokensList',
          value: verifiedTokensList?.data || [],
        },
      })
    }
  }
}

export function* GET_EXCHANGE_RATES() {
  const exchangeRates = yield call(
    Coingecko.GetRawUrl,
    '/simple/price?ids=bitcoin,cardano&vs_currencies=USD,EUR,JPY',
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
  const { assets, transactions, utxos } = yield call(
    Cardano.explorer.getAccountStateByPublicKey,
    publicKey,
    25, // adresses to generate per iteration (pagesize)
    10, // max iterations
    [0, 1], // generate inner / external addresses for check
  )

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletAssetsSummary',
      value: assets,
    },
  })

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletTransactions',
      value: transactions,
    },
  })

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletUTXOs',
      value: utxos,
    },
  })

  // save assets state
  const walletStore = yield select((state) => state.wallets.walletStore)
  const walletStoreUpdated = {
    ...walletStore,
    [accountId]: {
      value: !!assets.value,
      tokens: assets.tokens.length,
    },
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

export function* GET_STAKE_STATE() {
  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletStakeLoading',
      value: true,
    },
  })

  const { rewardAddress } = yield select((state) => state.wallets.walletParams)
  const stakeRegistrations = yield call(Graphql.getStakeRegistrations, rewardAddress)
  const ispoRewards = yield call(Distr.getKeyHistory, rewardAddress)
  const ispoPayouts = yield call(Distr.getKeyPayouts, rewardAddress)
  const adaRewards = yield call(Distr.getKeyAdaHistory, rewardAddress)

  const stakeData = stakeRegistrations?.data?.data
  const ispoRewardsData = ispoRewards?.data
  const ispoPayoutsData = ispoPayouts?.data
  const adaRewardsData = adaRewards?.data

  if (adaRewardsData) {
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'walletAdaRewards',
        value: adaRewardsData,
      },
    })
  }

  if (stakeData) {
    const latestReg = stakeData.stakeRegistrations[0]
      ? parseInt(stakeData.stakeRegistrations[0]?.transaction?.block?.number, 10)
      : -1
    const latestDereg = stakeData.stakeDeregistrations[0]
      ? parseInt(stakeData.stakeDeregistrations[0]?.transaction?.block?.number, 10)
      : -1
    const hasStakingKey = latestReg > latestDereg

    const rewardsTotal = parseInt(stakeData.rewards_aggregate?.aggregate?.sum?.amount || 0, 10)
    const withdrawalsTotal = parseInt(
      stakeData.withdrawals_aggregate?.aggregate?.sum?.amount || 0,
      10,
    )
    const rewardsBalance = rewardsTotal - withdrawalsTotal

    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'walletStake',
        value: {
          hasStakingKey,
          currentPoolId: stakeData.delegations[0]?.stakePool?.id || '',
          rewardsTotal,
          withdrawalsTotal,
          rewardsBalance,
          rewardsHistory: stakeData.rewards,
          withdrawalsHistory: stakeData.withdrawals,
        },
      },
    })
  }

  if (ispoRewardsData && ispoPayoutsData) {
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'walletIspoHistory',
        value: ispoRewardsData,
      },
    })
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'walletIspoPayouts',
        value: ispoPayoutsData,
      },
    })

    const totalPayoutsAmount = ispoPayoutsData[0]
      ? ispoPayoutsData[0].payouts?.reduce((acc, payout) => acc + payout.paid, 0)
      : 0
    const totalAccrued = ispoRewardsData?.totalAccrued || 0
    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'walletIspoBalance',
        value: {
          paid: totalPayoutsAmount,
          balance: totalAccrued - totalPayoutsAmount,
          accrued: totalAccrued,
        },
      },
    })
  }

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletStakeLoading',
      value: false,
    },
  })
}

export function* GET_POOLS_INFO() {
  const pools = yield call(Distr.getPools)

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'pools',
      value: pools?.data || {},
    },
  })
}

export function* FETCH_WALLET_DATA() {
  const { publicKey } = yield select((state) => state.wallets.walletParams)
  const networkInfo = yield select((state) => state.wallets.networkInfo)

  if (!publicKey || !networkInfo?.tip?.number) {
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
  yield call(GET_UTXO_STATE)

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletLoading',
      value: false,
    },
  })

  yield call(GET_STAKE_STATE)
}

export function* FETCH_STATUS() {
  // const apiStatus = yield call(CardanoHelper.GetStatus)
  // if (apiStatus) {
  //   yield put({
  //     type: 'wallets/CHANGE_SETTING',
  //     payload: {
  //       setting: 'status',
  //       value: apiStatus,
  //     },
  //   })
  // }
}

export function* FETCH_SIDE_DATA() {
  yield call(GET_POOLS_INFO)
  yield call(GET_EXCHANGE_RATES)
  yield call(GET_VERIFIED_TOKENS_LIST)
}

export function* SETUP() {
  const { walletList } = yield select((state) => state.wallets)
  if (walletList.length) {
    const lastWallet = store.get('RAY.walletLast')
    const selectedWallet = lastWallet
      ? walletList.filter((item) => item.accountId === lastWallet)[0] || walletList[0]
      : walletList[0]

    yield put({
      type: 'wallets/CHANGE_SETTING',
      payload: {
        setting: 'walletParams',
        value: selectedWallet,
      },
    })
  }
  yield call(FETCH_STATUS)
  yield call(FETCH_NETWORK_STATE)
  yield take(FETCH_NETWORK_STATE)
  yield call(FETCH_WALLET_DATA)
  yield call(FETCH_SIDE_DATA)
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CHANGE_SETTING, CHANGE_SETTING),
    takeEvery(actions.RESOLVER, RESOLVER),
    takeEvery(actions.FETCH_NETWORK_STATE, FETCH_NETWORK_STATE),
    takeEvery(actions.FETCH_WALLET_DATA, FETCH_WALLET_DATA),
    takeEvery(actions.FETCH_SIDE_DATA, FETCH_SIDE_DATA),
    takeEvery(actions.CHANGE_WALLET, CHANGE_WALLET),
    takeEvery(actions.ADD_WALLET, ADD_WALLET),
    takeEvery(actions.GET_PUBLIC_ADRESSES, GET_PUBLIC_ADRESSES),
    takeEvery(actions.GET_VERIFIED_TOKENS_LIST, GET_VERIFIED_TOKENS_LIST),
    takeEvery(actions.GET_EXCHANGE_RATES, GET_EXCHANGE_RATES),
    takeEvery(actions.GET_UTXO_STATE, GET_UTXO_STATE),
    takeEvery(actions.ENCRYPT_WALLET, ENCRYPT_WALLET),
    takeEvery(actions.DECRYPT_WALLET, DECRYPT_WALLET),
    takeEvery(actions.CHANGE_WALLET_NAME, CHANGE_WALLET_NAME),
    takeEvery(actions.DELETE_WALLET, DELETE_WALLET),
    takeEvery(actions.IMPORT_WALLET, IMPORT_WALLET),
    takeEvery(actions.GET_STAKE_STATE, GET_STAKE_STATE),
    takeEvery(actions.GET_POOLS_INFO, GET_POOLS_INFO),
    takeEvery(actions.FETCH_STATUS, FETCH_STATUS),
    SETUP(), // run once on app load to init listeners
  ])
}
