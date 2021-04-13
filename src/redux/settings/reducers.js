import store from 'store'
import actions from './actions'

const STORED_SETTINGS = (storedSettings) => {
  const settings = {}
  const skip = ['modalEncrypt']
  Object.keys(storedSettings).forEach((key) => {
    if (skip.includes(key)) {
      return
    }
    const item = store.get(`app.settings.${key}`)
    settings[key] = typeof item !== 'undefined' ? item : storedSettings[key]
  })
  return settings
}

const initialState = {
  ...STORED_SETTINGS({
    title: 'RAY',
    theme: 'default',
    locale: 'en-US',
    routerAnimation: 'slide-fadein-up',
    primaryColor: '#017AFF',
    modalAddWallet: false,
    modalSettings: false,
    modalEncrypt: false,
    isPrivateMode: false,
    QRCodeAddress: '',
    sections: ['wallet', 'stake', 'rewards', 'swap', 'kickstart', 'nft'],
  }),
}

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
