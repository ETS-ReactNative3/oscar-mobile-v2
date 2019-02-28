import axios from 'axios'
import { QUANTITATIVE_TYPES } from '../types'
import endpoint from '../../constants/endpoint'

requestQuantitativeTypes = () => ({
  type: QUANTITATIVE_TYPES.QUANTITATIVE_TYPES_REQUESTING
})

requestQuantitativeTypesSucceed = data => ({
  type: QUANTITATIVE_TYPES.QUANTITATIVE_TYPES_SUCCESS,
  data: data
})

requestQuantitativeTypesFailed = error => ({
  type: QUANTITATIVE_TYPES.QUANTITATIVE_TYPES_FAILED,
  error: error
})

export function fetchQuantitativeTypes() {
  return dispatch => {
    dispatch(requestQuantitativeTypes())
    axios
      .get(endpoint.quantitativeTypesPath)
      .then(response => {
        dispatch(requestQuantitativeTypesSucceed(response.data.quantitative_types))
      })
      .catch(error => {
        dispatch(requestQuantitativeTypesFailed(error))
      })
  }
}
