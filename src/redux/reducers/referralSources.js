import Immutable from 'seamless-immutable'
import { REFERRAL_SOURCE_TYPES } from '../types'

const initialState = Immutable({
  error: '',
  data: [],
  loading: false
})

export default (state = initialState, action) => {
  switch (action.type) {
    case REFERRAL_SOURCE_TYPES.REFERRAL_SOURCES_REQUESTING:
      return state.set('error', '').set('loading', true)

    case REFERRAL_SOURCE_TYPES.REFERRAL_SOURCES_SUCCESS:
      return state.set('data', action.data).set('loading', false)

    case REFERRAL_SOURCE_TYPES.REFERRAL_SOURCES_FAILED:
      return state.set('error', action.error).set('loading', false)

    default:
      return state
  }
}
