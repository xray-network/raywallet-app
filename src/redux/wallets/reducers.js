import store from 'store'
import BigNumber from 'bignumber.js'
import actions from './actions'

const pools =
  process.env.REACT_APP_NETWORK === 'testnet'
    ? {
        '58e3124fbd0e33188658a616c97932e50ba40430d81d3ed61b33d2ab': {
          delegateId: 'pool15sfcpy4tps5073gmra0e6tm2dgtrn004yr437qmeh44sgjlg2ex',
          ticker: 'JUNO',
          name: 'Testpool #1',
        },
        '48794370608c8d41cf4ad665833da210ad4fed6c6fd40b48bfad9ca8': {
          delegateId: 'pool1d03p2xfdcq09efx0hgy4jkr0tqdgvklues5cg3ud45t9wndafmm',
          ticker: 'ANGEL',
          name: 'Testpool #2',
        },
        '683e89fa1bcde139504b11fbfd914f8ebe9b8db2678b3da0abdcb2f1': {
          delegateId: 'pool1tzmx7k40sm8kheam3pr2d4yexrp3jmv8l50suj6crnvn6dc2429',
          ticker: 'WURST',
          name: 'Testpool #3',
        },
      }
    : {
        '1c8cd022e993a8366be641c17cb6d9c5d8944e00bfce3189d8b1515a': {
          delegateId: 'pool1rjxdqghfjw5rv6lxg8qhedkechvfgnsqhl8rrzwck9g45n43yql',
          ticker: 'RAY',
          name: 'RAY Network Pool #1',
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
  pools,
  poolsInfo: [],
  status: {
    maintenance: false,
    message: 'Wallet node is under maintenance. Services may not be available.',
    url: 'https://status.rraayy.com',
  },
}

export default function settingsReducer(state = initialState, action) {
  console.log(action)
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
