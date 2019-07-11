import Immutable from 'seamless-immutable'
import { CLIENT_TYPES } from '../../types'

const initialState = Immutable({
  data: {},
})

export default (state = initialState, action) => {
  switch (action.type) {
    case CLIENT_TYPES.UPDATE_CLIENT_QUEUE:
      return state.setIn(['data', action.client.id], action.client)

    case CLIENT_TYPES.REMOVE_CLIENT_QUEUE:
      return state.set('data', state.data.without(action.client.id))

    default:
      return state
  }
}
