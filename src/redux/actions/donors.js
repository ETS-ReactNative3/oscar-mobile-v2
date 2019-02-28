import axios from 'axios'
import { DONOR_TYPES } from '../types'
import endpoint from '../../constants/endpoint'

requestDonors = () => ({
  type: DONOR_TYPES.DONORS_REQUESTING
})

requestDonorsSucceed = data => ({
  type: DONOR_TYPES.DONORS_SUCCESS,
  data: data
})

requestDonorsFailed = error => ({
  type: DONOR_TYPES.DONORS_FAILED,
  error: error
})

export function fetchDonors() {
  return dispatch => {
    dispatch(requestDonors())
    axios
      .get(endpoint.donorsPath)
      .then(response => {
        dispatch(requestDonorsSucceed(response.data.donors))
      })
      .catch(error => {
        dispatch(requestDonorsFailed(error))
      })
  }
}
