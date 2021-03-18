import store from 'store'
import actions from './actions'

const initialState = {
  walletLoading: false,
  walletParams: {
    order: 0,
    accountId: '',
    mnemonic: '',
    password: '',
    name: '',
    encrypted: false,
  },
  walletData: {
    assets: [],
    addresses: [],
    transactions: [],
  },
  // walletList: store.get('RAY.walletList') || [],
  walletStore: store.get('RAY.walletStore') || {},
  walletList: [
    {
      order: 0,
      accountId: 'test',
      mnemonic: 'simple nation hedgehog vapor helmet split plate tomato picture polar sure oak notice ramp scrub mechanic afford door furnace gate build drop manual silk',
      password: 'hello',
      name: 'Test Wallet',
      encrypted: false,
    },
    {
      order: 1,
      accountId: 'test2',
      mnemonic: 'mad exist rent sick garlic salute tail sugar unknown bird bottom acid treat diamond hamster garden umbrella best rival jelly public prefer wear valid',
      password: 'hello',
      name: 'Rays',
      encrypted: false,
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
