// import store from 'store'
import actions from './actions'

const initialState = {
  walletLoading: false,
  walletParams: {
    accountId: '',
    mnemonicPhrase: '',
    password: '',
    name: '',
  },
  walletData: {
    assets: [],
    transactions: [],
  },
  // walletList: store.get('RAY.wallets') || [],
  walletList: [
    {
      order: 0,
      accountId: '1f2d47627ae826e6b7d442dcf45d5a08efa8ad13040a3af0bc148612',
      mnemonicPhrase: 'mnemonic',
      password: 'hello',
      name: 'Main Wallet',
      tickers: [],
    },
    {
      order: 1,
      accountId: '17627ae826e6b7d442dcf45d5a08c148612efa8ad13040a3af0b1f2d',
      mnemonicPhrase: 'mnemonic',
      password: 'hello',
      name: 'Rays',
      tickers: [],
    },
  ],
}

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
