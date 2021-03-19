import store from 'store'
import actions from './actions'

const initialState = {
  walletLoading: false,
  walletParams: {
    name: '',
    order: 0,
    accountId: '', // stake key address
    publicKey: '', // xpub :: encrypted
    provateKey: '', // xprv
    password: '', // password :: encrypted
    encrypted: false,
  },
  walletAddresses: [],
  walletTransactions: [],
  walletAssets: [],
  walletData: {
    assets: [],
    addresses: [],
    transactions: [],
  },
  walletList: store.get('RAY.walletList') || [],
  walletStore: store.get('RAY.walletStore') || {},
}

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
