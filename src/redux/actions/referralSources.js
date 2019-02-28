import axios from 'axios'
import { REFERRAL_SOURCE_TYPES } from '../types'
import endpoint from '../../constants/endpoint'

requestReferralsources = () => ({
  type: REFERRAL_SOURCE_TYPES.REFERRAL_SOURCES_REQUESTING
})

requestReferralsourcesSucceed = data => ({
  type: REFERRAL_SOURCE_TYPES.REFERRAL_SOURCES_SUCCESS,
  data: data
})

requestReferralsourcesFailed = error => ({
  type: REFERRAL_SOURCE_TYPES.REFERRAL_SOURCES_FAILED,
  error: error
})

export function fetchReferralSources() {
  return dispatch => {
    dispatch(requestReferralsources())
    axios
      .get(endpoint.referralSourcesPath)
      .then(response => {
        dispatch(requestReferralsourcesSucceed(response.data.referral_sources))
      })
      .catch(error => {
        dispatch(requestReferralsourcesFailed(error))
      })
  }
}
