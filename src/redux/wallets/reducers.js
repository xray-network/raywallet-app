import actions from './actions'

const initialState = {
  wallet: {
    selected: null,
    loading: false,
    data: {},
  },
  walletsList: [
    {
      id: '1f2d47627ae826e6b7d442dcf45d5a08efa8ad13040a3af0bc148612',
      name: 'Test Wallet',
      ticker: 'RAY',
      tickers: ['ADA', 'RAY', 'EGOR'],
      network: 'cardano testnet',
    },
    {
      id: 'efa8ad13040a3af0b1f2d47627ae826e6b7d442dcf45d5a08c148612',
      name: 'Cardano Stake',
      ticker: 'ADA',
      tickers: ['ADA'],
      network: 'cardano mainnet',
    },
    // {
    //   id: 'cf45d5a08c14861247627ae8efa8ad130b1f2d26e6b7d442d040a3af',
    //   name: 'Main',
    //   ticker: 'ADA',
    //   network: 'cardano mainnet',
    // },
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
