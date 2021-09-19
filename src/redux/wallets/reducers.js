import store from 'store'
import BigNumber from 'bignumber.js'
// import config from 'config'
import actions from './actions'

const initialState = {
  walletLoading: false,
  walletParams: {
    name: '',
    order: 0,
    accountId: '', // stake key hash
    rewardAddress: '', // stake key
    publicKey: '', // xpub
    privateKey: '', // xprv :: encrypted
    password: '', // password :: encrypted
    encrypted: false,
  },
  walletUTXOs: [],
  walletAssetsSummary: {
    value: new BigNumber(0),
    tokens: [],
  },
  walletAddresses: [],
  walletTransactions: [],
  walletStake: {
    hasStakingKey: false,
    currentPoolId: '',
    rewardsTotal: 0,
    withdrawalsTotal: 0,
    rewardsBalance: 0,
    rewardsHistory: [],
    withdrawalsHistory: [],
  },
  walletIspoBalance: {
    paid: 0,
    balanace: 0,
    accrued: 0,
  },
  walletIspoHistory: {},
  walletIspoPayouts: [],
  walletStakeLoading: true,

  walletStakeRewardsHistory: [],
  walletRayRewards: 0,
  walletRayRewardsHistory: [],
  walletRayRewardsBonus: {},

  walletList: store.get('RAY.walletList') || [],
  walletStore: store.get('RAY.walletStore') || {},
  networkInfo: {},
  epochEndIns: 0,
  verifiedTokensList: [],
  exchangeRates: {},
  status: {},
  pools: {},
}

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
