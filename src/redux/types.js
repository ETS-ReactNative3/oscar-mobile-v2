import createConstants from '../utils/createConstants'

export const INTERNET_TYPES  = createConstants('UPDATE_CONNECTION')

export const NGO_TYPES = createConstants(
  'SET_NGO_NAME',
  'NGO_REQUESTING',
  'NGO_REQUEST_SUCCESS',
  'NGO_REQUEST_FAILED',
)

export const AUTH_TYPES = createConstants(
  'LOGIN_REQUEST',
  'LOGIN_REQUEST_SUCCESS',
  'LOGIN_REQUEST_FAILED',
  'RESET_AUTH_STATE',
  'UPDATE_USER_REQUESTING',
  'UPDATE_USER_SUCCESS',
  'UPDATE_USER_FAILED',
)