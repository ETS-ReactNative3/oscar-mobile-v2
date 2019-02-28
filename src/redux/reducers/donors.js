import Immutable from 'seamless-immutable'
import { DONOR_TYPES } from '../types'

const initialState = Immutable({
  error: '',
  data: [],
  loading: false
})

export default (state = initialState, action) => {
  switch (action.type) {
    case DONOR_TYPES.DONORS_REQUESTING:
      return state.set('error', '').set('loading', true)

    case DONOR_TYPES.DONORS_SUCCESS:
      return state.set('data', action.data).set('loading', false)

    case DONOR_TYPES.DONORS_FAILED:
      return state.set('error', action.error).set('loading', false)

    default:
      return state
  }
}
