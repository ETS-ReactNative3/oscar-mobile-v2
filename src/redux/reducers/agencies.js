import Immutable from 'seamless-immutable'
import { AGENCY_TYPES } from '../types'

const initialState = Immutable({
  error: '',
  data: [],
  loading: false
})

export default (state = initialState, action) => {
  switch (action.type) {
    case AGENCY_TYPES.AGENCIES_REQUESTING:
      return state.set('error', '').set('loading', true)

    case AGENCY_TYPES.AGENCIES_SUCCESS:
      return state.set('data', action.data).set('loading', false)

    case AGENCY_TYPES.AGENCIES_FAILED:
      return state.set('error', action.error).set('loading', false)

    default:
      return state
  }
}
