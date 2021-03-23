import store from 'store'
import actions from './actions'

const initialState = {
  walletLoading: false,
  walletParams: {
    name: '',
    order: 0,
    accountId: '', // stake key address
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
  walletList: store.get('RAY.walletList') || [],
  walletStore: store.get('RAY.walletStore') || {},
  networkInfo: {},
  verifiedTokensList: [],
  exchangeRates: {},
}

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
