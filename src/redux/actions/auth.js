import axios                              from 'axios'
import { forEach, capitalize }            from 'lodash'
import { AUTH_TYPES, LOGOUT_TYPES }       from '../types'
import { Alert, AsyncStorage, NetInfo }   from 'react-native'
import { Navigation }                     from 'react-native-navigation'
import endpoint                           from '../../constants/endpoint'
import i18n                               from '../../i18n'
import CryptoJS                           from 'crypto-js'
import {
  pushScreen,
  startTabScreen,
  startNgoScreen,
  loadingScreen
} from '../../navigation/config'

requestLogin = () => ({
  type: AUTH_TYPES.LOGIN_REQUEST
})

requestLoginSuccess = ({ data, headers }) => ({
  type: AUTH_TYPES.LOGIN_REQUEST_SUCCESS,
  data: data.data,
  headers
})

requestLoginFailed = error => ({
  type: AUTH_TYPES.LOGIN_REQUEST_FAILED,
  error: error
})

requestUpdateUser = () => ({
  type: AUTH_TYPES.UPDATE_USER_REQUESTING
})

requestUpdateUserFailed = err => ({
  type: AUTH_TYPES.UPDATE_USER_FAILED,
  err: err
})

requestLogout = () => ({
  type: LOGOUT_TYPES.LOGOUT_REQUESTING
})

requestLogoutSuccess = data => ({
  type: LOGOUT_TYPES.LOGOUT_SUCCESS,
  data: data.data
})

requestLogoutFailed = error => ({
  type: LOGOUT_TYPES.LOGOUT_FAILED,
  error: error
})

formatHeaders = headers => ({
  'access-token': headers['access-token'],
  client: headers['client'],
  uid: headers['uid']
})

export function setDefaultHeader(accHeaders) {
  let headers = accHeaders
  return (dispatch, getState) => {
    const org = getState().ngo.name
    if (headers == null) {
      headers = getState().auth.headers
    }
    axios.defaults.headers.common['access-token'] = headers['access-token']
    axios.defaults.headers.common['client'] = headers['client']
    axios.defaults.headers.common['uid'] = headers['uid']
    axios.defaults.baseURL = endpoint.baseURL(org)
  }
}

export function updatePin(pinCode) {
  return (dispatch, getState) => {
    const org = getState().ngo.name
    const headers = getState().auth.headers
    dispatch(requestLogin())
    axios
      .put(endpoint.baseURL(org) + endpoint.updateTokenPath, { pin_code: pinCode }, { headers: formatHeaders(headers) })
      .then(response => {
        dispatch(requestLoginSuccess(response))
        dispatch(setDefaultHeader(response.headers))
        startTabScreen()
      })
      .catch(err => {
        dispatch(requestLoginFailed(err.response.data.errors[0]))
      })
  }
}

export function login(credentail, currentComponentId) {
  return (dispatch, getState) => {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        const org = getState().ngo.name
        dispatch(requestLogin())
        axios
          .post(endpoint.baseURL(org) + endpoint.login, credentail)
          .then(response => {
            const { pin_code } = response.data.data
            pin_code && dispatch(setDefaultHeader(response.headers))

            dispatch(requestLoginSuccess(response))
            pushScreen(currentComponentId, {
              screen: 'oscar.pin',
              topBar: false,
              drawBehind: true,
              props: {
                pinTitle: pin_code ? i18n.t('auth.enter_pin') : i18n.t('auth.set_pin'),
                pinMode: pin_code ? 'compare' : 'set',
                pinCode: pin_code && CryptoJS.SHA3(pin_code)
              }
            })
          })
          .catch(err => {
            dispatch(requestLoginFailed(err.response.data.errors[0]))
          })
      } else {
        Alert.alert('No internet connection')
      }
    })

  }
}

export function updateUser(userParam, alertMessage) {
  return (dispatch, getState) => {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        loadingScreen()
        const org = getState().ngo.name
        const headers = getState().auth.headers
        const config = { headers: formatHeaders(headers) }
        dispatch(requestUpdateUser())
        return axios
          .put(endpoint.baseURL(org) + endpoint.updateTokenPath, userParam, config)
          .then(response => {
            dispatch(requestLoginSuccess(response))
            Navigation.dismissOverlay('LOADING_SCREEN')
            Navigation.popTo('USERS_TAB_BAR_BUTTON')
            alertMessage()
          })
          .catch(error => {
            let errors = []
            forEach(error.response.data.errors, (value, key) => {
              if (key != 'full_messages') {
                errors.push(capitalize(key) + ' ' + value[0])
              }
            })
            Navigation.dismissOverlay('LOADING_SCREEN')
            dispatch(requestUpdateUserFailed(errors))
          })
      } else {
        Alert.alert('No internet connection')
      }
    })
  }
}

export function verifyUser(goToPin) {
  return (dispatch, getState) => {
    const org = getState().ngo.name
    const headers = getState().auth.headers
    const config = { headers: formatHeaders(headers) }
    axios
      .get(endpoint.baseURL(org) + endpoint.tokenValidationPath, config)
      .then(response => {
        const { pin_code } = response.data.data
        dispatch(requestLoginSuccess(response))
        dispatch(setDefaultHeader(response.headers))
        goToPin(CryptoJS.SHA3(pin_code))
      })
      .catch(error => {
        Alert.alert('Info', 'User session has been expired.', [
          {
            text: 'OK',
            onPress: () => startNgoScreen()
          }
        ])
        dispatch(clearAppData())
      })
  }
}

export function logoutUser(acc, navigator) {
  return dispatch => {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        dispatch(requestLogout())
        axios
          .delete(endpoint.logoutPath)
          .then(response => {
            dispatch(requestLogoutSuccess(response))
            startNgoScreen()
            dispatch(clearAppData())
          })
          .catch(error => {
            dispatch(requestLogoutFailed(error))
          })
      } else {
        Alert.alert('No internet connection')
      }
    })
  }
}

export function clearAppData() {
  return dispatch => {
    setTimeout(function() {
      dispatch({ type: AUTH_TYPES.RESET_AUTH_STATE })
      AsyncStorage.clear()
    }, 500)
  }
}
