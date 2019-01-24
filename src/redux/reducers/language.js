import { LANGUAGE_TYPES } from '../types'

const initialState = {
  language: 'en'
}

export default (state = initialState, action) => {
  switch (action.type) {

    case LANGUAGE_TYPES.SET_LANGUAGE:
      return {
        ...state,
        language: action.language
      }

    default:
      return state
  }
}