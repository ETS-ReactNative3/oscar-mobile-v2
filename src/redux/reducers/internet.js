import { INTERNET_TYPES as types } from '../types'

const initialState = {
  hasInternet: false
}

export default internetReducer = (state = initialState, action) => {
  switch (action.type) {

    case types.UPDATE_CONNECTION:
      return {
        ...state,
        hasInternet: action.connection
      }

    default:
      return state
  }
}