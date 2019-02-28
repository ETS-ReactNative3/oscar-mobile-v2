import axios from 'axios'
import { AGENCY_TYPES } from '../types'
import endpoint from '../../constants/endpoint'

requestAgencies = () => ({
  type: AGENCY_TYPES.AGENCIES_REQUESTING
})

requestAgenciesSucceed = data => ({
  type: AGENCY_TYPES.AGENCIES_SUCCESS,
  data: data
})

requestAgenciesFailed = error => ({
  type: AGENCY_TYPES.AGENCIES_FAILED,
  error: error
})

export function fetchAgencies() {
  return dispatch => {
    dispatch(requestAgencies())
    axios
      .get(endpoint.agenciesPath)
      .then(response => {
        dispatch(requestAgenciesSucceed(response.data.agencies))
      })
      .catch(error => {
        dispatch(requestAgenciesFailed(error))
      })
  }
}
