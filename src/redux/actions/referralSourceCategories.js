import axios from 'axios'
import { REFERRAL_SOURCE_CATEGORIE_TYPES } from '../types'
import endpoint from '../../constants/endpoint'

requestReferralSourceCategories = () => ({
  type: REFERRAL_SOURCE_CATEGORIE_TYPES.REFERRAL_SOURCE_CATEGORIES_REQUESTING
})

requestReferralSourceCategoriesSucceed = data => ({
  type: REFERRAL_SOURCE_CATEGORIE_TYPES.REFERRAL_SOURCE_CATEGORIES_SUCCESS,
  data: data
})

requestReferralSourceCategoriesFailed = error => ({
  type: REFERRAL_SOURCE_CATEGORIE_TYPES.REFERRAL_SOURCE_CATEGORIES_FAILED,
  error: error
})

export function fetchReferralSourceCategories() {
  return dispatch => {
    dispatch(requestReferralSourceCategories())
    axios
      .get(endpoint.referralSourceCategoriessPath)
      .then(response => {
        dispatch(requestReferralSourceCategoriesSucceed(response.data.referral_sources))
      })
      .catch(error => {
        dispatch(requestReferralSourceCategoriesFailed(error))
      })
  }
}
