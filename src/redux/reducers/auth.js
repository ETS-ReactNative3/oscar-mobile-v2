import Immutable      from 'seamless-immutable'
import { AUTH_TYPES } from '../types'

const initialState = Immutable({
  error: '',
  data: {},
  headers: {},
  loading: false
})

export default userReducer = (state = initialState, action) => {
  switch (action.type) {

    case AUTH_TYPES.LOGIN_REQUEST:
      return state.set('error', '')
                  .set('loading', true)

    case AUTH_TYPES.LOGIN_REQUEST_SUCCESS:
      return state.set('data', action.data)
                  .set('headers', action.headers)
                  .set('loading', false)
                  .set('error', '')

    case AUTH_TYPES.LOGIN_REQUEST_FAILED:
      return state.set('error', action.error)
                  .set('loading', false)

    case AUTH_TYPES.RESET_AUTH_STATE:
      return state.set('error', '')
                  .set('loading', false)
                  .set('data', {})
                  .set('headers', {})

    case AUTH_TYPES.UPDATE_USER_REQUESTING:
      return state.set('error', '')
                  .set('loading', true)

    case AUTH_TYPES.UPDATE_USER_SUCCESS:
      return state.set('error', '')
                  .set('loading', false)
                  .set('data', action.data)

    case AUTH_TYPES.UPDATE_USER_FAILED:
      return state.set('error', action.err)
                  .set('loading', false)

    default:
      return state
  }
}
