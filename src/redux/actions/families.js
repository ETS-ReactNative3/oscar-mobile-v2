import { Alert, NetInfo }     from 'react-native'
import axios                  from 'axios'
import { map }                from 'lodash'
import { Navigation }         from 'react-native-navigation'
import { loadingScreen }      from '../../navigation/config'
import endpoint               from '../../constants/endpoint'
import i18n                   from '../../i18n'
import { FAMILY_TYPES }       from '../types'
import { updateFamilyOffline } from './offline/families'


export const requestFamilies = () => ({
  type: FAMILY_TYPES.FAMILIES_REQUESTING
})

export const requestFamiliesSuccess = data => ({
  type: FAMILY_TYPES.FAMILIES_REQUEST_SUCCESS,
  data
})

export const requestFamiliesFailed = error => ({
  type: FAMILY_TYPES.FAMILIES_REQUEST_FAILED,
  error
})

export const updateFamilySuccess = family => ({
  type: FAMILY_TYPES.FAMILY_UPDATE_SUCCESS,
  family
})

export function fetchFamilies() {
  return dispatch => {
    dispatch(requestFamilies())
    axios
      .get(endpoint.familiesPath)
      .then(response => {
        const families = response.data.families.reduce((res, family) => {
          res[family.id] = family
          return res
        }, {})
        dispatch(requestFamiliesSuccess(families))
      })
      .catch(error => {
        dispatch(requestFamiliesFailed(error))
      })
  }
}

export function updateFamily(familyParams, actions) {
  return dispatch => {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        loadingScreen()
        dispatch(requestFamilies())
        axios
          .put(endpoint.familiesPath + '/' + familyParams.id, familyParams)
          .then(response => {
            dispatch(updateFamilySuccess(response.data.family))
            Navigation.dismissOverlay('LOADING_SCREEN')
            Navigation.popTo(actions.familyDetailComponentId)
            actions.alertMessage()
          })
          .catch(error => {
            let errors = map(error.response.data, (value, key) => {
              return i18n.t('family.' + key, { locale: 'en' }) + ' ' + value[0]
            })
            Navigation.dismissOverlay('LOADING_SCREEN')
            dispatch(requestFamiliesFailed(errors))
          })
      } else {
        Alert.alert('No internet connection')
        // dispatch(updateFamilyOffline(familyParams, actions))
      }
    })
  }
}
