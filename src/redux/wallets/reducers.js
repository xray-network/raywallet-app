import store from 'store'
import actions from './actions'

const pools =
  process.env.REACT_APP_NETWORK === 'mainnet'
    ? {
        pool1rjxdqghfjw5rv6lxg8qhedkechvfgnsqhl8rrzwck9g45n43yql: {
          ticker: 'RAY',
          name: 'RAY Network Pool #1',
        },
      }
    : {
        pool15sfcpy4tps5073gmra0e6tm2dgtrn004yr437qmeh44sgjlg2ex: {
          ticker: 'JUNO',
          name: 'Testpool #1',
        },
        pool1d03p2xfdcq09efx0hgy4jkr0tqdgvklues5cg3ud45t9wndafmm: {
          ticker: 'ANGEL',
          name: 'Testpool #2',
        },
      }

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
    value: 0,
    tokens: [],
  },
  walletAddresses: [],
  walletTransactions: [],
  walletStake: {
    hasStakingKey: true,
    rewardsAmount: 0,
    activeStakeAmount: 1000000000,
    currentPoolId: 'pool1d03p2xfdcq09efx0hgy4jkr0tqdgvklues5cg3ud45t9wndafmm',
    activePoolId: 'pool1d03p2xfdcq09efx0hgy4jkr0tqdgvklues5cg3ud45t9wndafmm',
  },
  walletStakeRewardsHistory: [],
  walletRayRewardsHistory: [],
  walletList: store.get('RAY.walletList') || [],
  walletStore: store.get('RAY.walletStore') || {},
  networkInfo: {},
  verifiedTokensList: [],
  exchangeRates: {},
  pools,
  poolsInfo: [],
}

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
