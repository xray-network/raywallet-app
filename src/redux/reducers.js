import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import settings from './settings/reducers'
import wallets from './wallets/reducers'
import transactions from './transactions/reducers'

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    settings,
    wallets,
    transactions,
  })
