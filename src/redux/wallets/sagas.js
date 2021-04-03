import { all, takeEvery, put, take, call, select } from 'redux-saga/effects'
import store from 'store'
import { AES, enc as EncodeTo } from 'crypto-js'
import AssetFingerprint from '@emurgo/cip14-js'
import { message } from 'antd'
import * as CardanoUtils from 'utils/ray-cardano-utils'
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
    yield put({
      type: 'wallets/CHANGE_WALLET',
      payload: {
        accountId: CardanoUtils.bechAddressToHex(accountInfo.rewardAddressBech32)
          .data.toString('hex')
          .slice(2),
      },
    })
    return
  }

  const newWallet = {
    order: walletList.length,
    accountId: CardanoUtils.bechAddressToHex(accountInfo.rewardAddressBech32)
      .data.toString('hex')
      .slice(2),
    rewardAddress: accountInfo.rewardAddressBech32,
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
  message.success('Wallet was deleted')
}

export function* CHANGE_WALLET({ payload: { accountId } }) {
  if (accountId === 'empty') {
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
          const { assetId, quantity, assetName, policyId } = token
          if (!assetsSummary.tokens[assetId]) {
            assetsSummary.tokens[assetId] = {}
          }

          const fingerprint = new AssetFingerprint(
            Buffer.from(policyId, 'hex'),
            assetName ? Buffer.from(assetName.substr(2), 'hex') : undefined,
          ).fingerprint()

          assetsSummary.tokens[assetId].assetId = assetId
          assetsSummary.tokens[assetId].ticker = 'TEST'
          assetsSummary.tokens[assetId].name = 'Testcoint'
          assetsSummary.tokens[assetId].fingerprint = fingerprint
          assetsSummary.tokens[assetId].quantity = assetsSummary.tokens[assetId].quantity
            ? BigInt(assetsSummary.tokens[assetId].quantity) + BigInt(quantity)
            : BigInt(quantity)
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
          tokens[token.assetId].ticker = new TextDecoder().decode(
            Buffer.from(token.assetName.substr(2), 'hex'),
          )
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
          tokens[token.assetId].ticker = new TextDecoder().decode(
            Buffer.from(token.assetName.substr(2), 'hex'),
          )
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
    [accountId]: {
      value: !!assetsSummary.value,
      tokens: assetsSummary.tokens.length,
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
  const walletAssetsSummary = yield select((state) => state.wallets.walletAssetsSummary)
  // const { currentEpoch } = yield select((state) => state.wallets.networkInfo)
  // const rawStakeInfo = yield call(Explorer.GetStakeAddressInfo, rewardAddress, currentEpoch.number)
  const rawStakeInfo = {
    data: {
      activeStake: [
        {
          amount: '1756862531',
          stakePoolHash: '1c8cd022e993a8366be641c17cb6d9c5d8944e00bfce3189d8b1515a',
        },
      ],
      stakeRegistrations: [
        {
          address: 'stake1uypzwrjvckawg5ch59de4ph4petvz7pgpgu44zttkyfz8mqe8ejrz',
          transaction: {
            block: {
              number: 5014835,
            },
          },
        },
      ],
      stakeDeregistrations: [],
    },
  }
  const stakeRegistrationBlock =
    rawStakeInfo.data?.stakeRegistrations[0]?.transaction.block.number || 0
  const stakeDeregistrationBlock =
    rawStakeInfo.data?.stakeDeregistrations[0]?.transaction.block.number || 0
  const hasStakingKey = stakeRegistrationBlock > stakeDeregistrationBlock
  const stakeData = {
    activeStakeAmount: hasStakingKey
      ? parseInt(rawStakeInfo.data?.activeStake[0]?.amount || 0, 10)
      : 0,
    rewardsAmount: hasStakingKey
      ? parseInt(rawStakeInfo.data?.activeStake[0]?.amount - walletAssetsSummary.value || 0, 10)
      : 0,
    stakePoolHash: rawStakeInfo.data?.activeStake[0]?.stakePoolHash || false,
    hasStakingKey,
  }

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletStake',
      value: stakeData,
    },
  })
}

export function* GET_POOLS_INFO() {
  const { currentEpoch } = yield select((state) => state.wallets.networkInfo)
  const pools = {
    '1c8cd022e993a8366be641c17cb6d9c5d8944e00bfce3189d8b1515a': {
      ticker: 'RAY',
      name: 'RAY Network',
    },
  }

  let poolsInfo = yield call(Explorer.GetPoolsInfo, Object.keys(pools), currentEpoch.number)
  poolsInfo = [
    {
      activeStake_aggregate: {
        aggregate: {
          count: '8',
          sum: {
            amount: '31936229742',
          },
        },
      },
      fixedCost: '340000000',
      hash: '1c8cd022e993a8366be641c17cb6d9c5d8944e00bfce3189d8b1515a',
      id: 'pool1rjxdqghfjw5rv6lxg8qhedkechvfgnsqhl8rrzwck9g45n43yql',
      margin: 0,
      pledge: '1000000000',
      url: 'https://rraayy.com/poolmeta.json',
    },
  ]

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletPools',
      value: poolsInfo.map((item) => {
        return {
          ...item,
          ...pools[item.hash],
        }
      }),
    },
  })
}

export function* GET_STAKE_REWARDS_HISTORY() {
  const { rewardAddress } = yield select((state) => state.wallets.walletParams)

  let walletStakeRewards = yield call(Explorer.GetRewardsForAddress, rewardAddress)
  walletStakeRewards = [
    {
      address: 'stake1uypzwrjvckawg5ch59de4ph4petvz7pgpgu44zttkyfz8mqe8ejrz',
      amount: '8608',
      earnedIn: {
        number: 234,
        startedAt: '2020-12-06T21:44:51Z',
        lastBlockTime: '2020-12-11T21:44:50Z',
      },
    },
    {
      address: 'stake1uypzwrjvckawg5ch59de4ph4petvz7pgpgu44zttkyfz8mqe8ejrz',
      amount: '2552755',
      earnedIn: {
        number: 235,
        startedAt: '2020-12-11T21:45:01Z',
        lastBlockTime: '2020-12-16T21:43:48Z',
      },
    },
  ]

  yield put({
    type: 'wallets/CHANGE_SETTING',
    payload: {
      setting: 'walletStakeRewards',
      value: walletStakeRewards,
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
    yield call(GET_STAKE_STATE)
    yield call(GET_POOLS_INFO)
    yield call(GET_STAKE_REWARDS_HISTORY)
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
    takeEvery(actions.CHANGE_WALLET_NAME, CHANGE_WALLET_NAME),
    takeEvery(actions.DELETE_WALLET, DELETE_WALLET),
    takeEvery(actions.IMPORT_WALLET, IMPORT_WALLET),
    takeEvery(actions.GET_STAKE_STATE, GET_STAKE_STATE),
    takeEvery(actions.GET_POOLS_INFO, GET_POOLS_INFO),
    takeEvery(actions.GET_STAKE_REWARDS_HISTORY, GET_STAKE_REWARDS_HISTORY),
    SETUP(), // run once on app load to init listeners
  ])
}
