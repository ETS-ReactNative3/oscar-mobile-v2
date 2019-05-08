import Immutable from 'seamless-immutable'
import { QUEUE_CUSTOM_FIELD_PEROPERTY_TYPES } from '../../types'

const initialState = Immutable({
  error: '',
  data: {},
  loading: false
})

export default (state = initialState, action) => {
  switch (action.type) {

    case QUEUE_CUSTOM_FIELD_PEROPERTY_TYPES.QUEUE_CUSTOM_FIELD_PEROPERTIES_REQUEST_SUCCESS:
      return state.setIn(['data', action.data.id], action.data)

    case QUEUE_CUSTOM_FIELD_PEROPERTY_TYPES.QUEUE_CUSTOM_FIELD_PEROPERTIES_DELETED:
      return state.update('data', data => data.without(action.data.id))

    default:
      return state
  }
}
