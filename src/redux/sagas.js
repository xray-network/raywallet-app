import { all } from 'redux-saga/effects'
import settings from './settings/sagas'
import wallets from './wallets/sagas'

export default function* rootSaga() {
  yield all([settings(), wallets()])
}
