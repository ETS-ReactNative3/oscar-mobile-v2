import Immutable from 'seamless-immutable'
import { QUEUE_CLIENT_ENROLLMENT_TYPES } from '../../types'

const initialState = Immutable({
  error: '',
  data: {},
  loading: false
})

export default (state = initialState, action) => {
  switch (action.type) {

    case QUEUE_CLIENT_ENROLLMENT_TYPES.QUEUE_CLIENT_ENROLLMENTS_REQUEST_SUCCESS:
      return state.setIn(['data', action.data.id], action.data)

    case QUEUE_CLIENT_ENROLLMENT_TYPES.QUEUE_CLIENT_ENROLLMENT_DELETED:
      return state.update('data', data => data.without(action.data.id))

    default:
      return state
  }
}
