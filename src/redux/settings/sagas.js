import { all, takeEvery, put } from 'redux-saga/effects'
import store from 'store'
import actions from './actions'

export function* CHANGE_SETTING({ payload: { setting, value } }) {
  yield store.set(`app.settings.${setting}`, value)
  yield put({
    type: 'settings/SET_STATE',
    payload: {
      [setting]: value,
    },
  })
}

export default function* rootSaga() {
  yield all([takeEvery(actions.CHANGE_SETTING, CHANGE_SETTING)])
}
