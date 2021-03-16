import store from 'store'
import actions from './actions'

const initialState = {
  walletLoading: false,
  walletParams: {
    order: 0,
    accountId: '',
    password: '',
    name: '',
  },
  walletData: {
    assets: [],
    addresses: [],
    transactions: [],
  },
  walletList: store.get('RAY.walletList') || [],
  walletStore: store.get('RAY.walletStore') || {},
  // walletList: [
  //   {
  //     order: 0,
  //     accountId: '1f2d47627ae826e6b7d442dcf45d5a08efa8ad13040a3af0bc148612',
  //     password: 'hello',
  //     name: 'Main Wallet',
  //   },
  //   {
  //     order: 1,
  //     accountId: '17627ae826e6b7d442dcf45d5a08c148612efa8ad13040a3af0b1f2d',
  //     password: 'hello',
  //     name: 'Rays',
  //   },
  // ],
}

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
