import axios from 'axios'
import { CLIENT_TYPES } from '../types'
import endpoint from '../../constants/endpoint'
import _ from 'lodash'
import { Alert } from 'react-native'
import { Navigation } from 'react-native-navigation'
requestClients = () => ({
  type: CLIENT_TYPES.CLIENTS_REQUESTING
})

requestClientsSuccess = data => ({
  type: CLIENT_TYPES.CLIENTS_REQUEST_SUCCESS,
  data
})

requestClientsFailed = error => ({
  type: CLIENT_TYPES.CLIENTS_REQUEST_FAILED,
  error
})

export const updateClient = client => ({
  type: CLIENT_TYPES.UPDATE_CLIENT,
  client
})

export function updateClientProperty(clientParams, actions) {
  return dispatch => {
    dispatch(requestClients())
    axios
      .put(endpoint.clientsPath + '/' + clientParams.id, clientParams)
      .then(response => {
        dispatch(updateClient(response.data.client))
        Alert.alert('Message', 'You have update successfully.', [{ text: 'Ok', onPress: () => Navigation.popTo(actions.clientDetailComponentId) }], {
          cancelable: false
        })
      })
      .catch(error => {
        let errors = _.map(error.response.data, (value, key) => {
          return _.capitalize(key) + ' ' + value[0]
        })
        alert(errors)
      })
  }
}

export function fetchClients() {
  return dispatch => {
    dispatch(requestClients())
    axios
      .get(endpoint.clientsPath)
      .then(response => {
        const clients = response.data.clients.reduce((res, client) => {
          res[client.id] = client
          return res
        }, {})
        dispatch(requestClientsSuccess(clients))
      })
      .catch(error => {
        dispatch(requestClientsFailed(error))
      })
  }
}
