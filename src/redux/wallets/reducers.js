import store from 'store'
import BigNumber from 'bignumber.js'
import config from 'config'
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
    rewardsAmount: new BigNumber(0),
    currentPoolId: '',
    nextRewardsHistory: [],
  },
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
  pools: config.pools,
  poolsInfo: [],
  status: {},
}

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
