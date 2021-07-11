import actions from './actions'

const initialState = {
  transactionLoading: false,
  transactionType: '',
  transactionData: {},
  transactionError: {},
  transactionWaitingHash: '',
  transactionWaiting: false,
  transactionSuccess: false,
}

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
