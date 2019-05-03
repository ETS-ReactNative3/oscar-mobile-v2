import Immutable from 'seamless-immutable'
import { QUEUE_CUSTOM_FIELD_PEROPERTY_TYPES } from '../../types'

const initialState = Immutable({
  error: '',
  data: [],
  loading: false
})

export default (state = initialState, action) => {
  switch (action.type) {

    case QUEUE_CUSTOM_FIELD_PEROPERTY_TYPES.QUEUE_CUSTOM_FIELD_PEROPERTIES_REQUEST_SUCCESS:
      return state.set('data', action.data).set('loading', false)

    case QUEUE_CUSTOM_FIELD_PEROPERTY_TYPES.QUEUE_CUSTOM_FIELD_PEROPERTIES_UPDATED:
      return state
        .setIn(['data', action.client.id], action.client)
        .set('loading', false)

    default:
      return state
  }
}
