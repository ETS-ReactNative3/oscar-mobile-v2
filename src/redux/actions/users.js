import axios from 'axios'
import { USER_TYPES } from '../types'
import endpoint from '../../constants/endpoint'

requestUsers = () => ({
  type: USER_TYPES.USERS_REQUESTING
})

requestUsersSuccess = data => ({
  type: USER_TYPES.USERS_REQUEST_SUCCESS,
  data
})

requestUsersFailed = error => ({
  type: USER_TYPES.USERS_REQUEST_FAILED,
  error
})

export const updateUser = user => ({
  type: USER_TYPES.UPDATE_USER,
  user
})

export function fetchUser() {
  return (dispatch, getState) => {
    dispatch(requestUsers())
    const userId = getState().auth.data.id
    axios
      .get(endpoint.usersPath + '/' + userId)
      .then(response => {
        dispatch(updateUser(response.data.user))
      })
      .catch(error => {
        dispatch(requestUsersFailed(error))
      })
  }
}

export function fetchUsers() {
  return dispatch => {
    dispatch(requestUsers())
    axios
      .get(endpoint.usersPath)
      .then(response => {
        dispatch(requestUsersSuccess(response.data.users))
      })
      .catch(error => {
        dispatch(requestUsersFailed(error))
      })
  }
}
