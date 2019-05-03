import axios                                from 'axios'
import { Navigation }                       from 'react-native-navigation'
import { template, findIndex }              from 'lodash'
import { loadingScreen }                    from '../../../navigation/config'
import { Alert, NetInfo }                   from 'react-native'
import { QUEUE_CUSTOM_FIELD_PEROPERTY_TYPES }       from '../../types'
import {
  createEntityCustomFormSuccess,
  addEntityCustomFormState,
  updateStateAdditionalFormInEntity,
  mergeStateAdditionalFormInEntity,
  deleteStateAdditionalFormInEntity,
} from '../customForms'

const createCustomFieldPropertySuccess = data => ({
  type: QUEUE_CUSTOM_FIELD_PEROPERTY_TYPES.QUEUE_CUSTOM_FIELD_PEROPERTIES_REQUEST_SUCCESS,
  data
})

const updateCustomFieldPropertySuccess = (queueData, index) => ({
  type: QUEUE_CUSTOM_FIELD_PEROPERTY_TYPES.QUEUE_CUSTOM_FIELD_PEROPERTIES_UPDATED,
  queueData,
  index
})

export function createAdditionalFormOffline(properties, entityProfile, additionalForm, customFormType, actions) {
  return (dispatch, getState) => {
    const customFieldProperty = {
      id: Date.now(),
      properties: properties,
      custom_field_id: additionalForm.id,
      custom_formable_type: actions.type,
      custom_formable_id: entityProfile.id,
      created_at: new Date(),
      form: 'persist',
      action: 'create'
    }

    let queueCustomFieldProperties = getState().queueCustomFieldProperties.data
    queueCustomFieldProperties = [...queueCustomFieldProperties, customFieldProperty]

    dispatch(createCustomFieldPropertySuccess(queueCustomFieldProperties))

    if (actions.clickForm == 'additionalForm') {
      entityUpdated = mergeStateAdditionalFormInEntity(entityProfile, customFieldProperty, additionalForm)
    } else {
      entityUpdated = addEntityCustomFormState(entityProfile, customFieldProperty, additionalForm)
    }

    dispatch(createEntityCustomFormSuccess(entityUpdated, customFormType))
    Navigation.dismissOverlay('LOADING_SCREEN')
    Navigation.popTo(actions.entityDetailComponentId)
    actions.alertMessage()
  }
}

export function editAdditionalFormOffline(properties, entityProfile, customField, additionalForm, customFormType, actions) {
  return (dispatch, getState) => {
    let form = 'persist'
    let action = 'create'
    let queueCustomFieldProperties = getState().queueCustomFieldProperties.data
    const currentQueueDataIndex = findIndex(queueCustomFieldProperties, { id: customField.id })
    if (customField.form == undefined) {
      form = 'server'
      action = 'update'
    }
    const customFieldProperty = {
      id: customField.id,
      properties: properties,
      custom_field_id: additionalForm.id,
      custom_formable_type: actions.type,
      custom_formable_id: entityProfile.id,
      created_at: customField.created_at,
      form,
      action
    }

    if (currentQueueDataIndex < 0) {
      queueCustomFieldProperties = [...queueCustomFieldProperties, customFieldProperty]
      dispatch(createCustomFieldPropertySuccess(queueCustomFieldProperties))
    } else {
      dispatch(updateCustomFieldPropertySuccess(customFieldProperty, currentQueueDataIndex))
    }

    const entityUpdated = updateStateAdditionalFormInEntity(entityProfile, customFieldProperty, additionalForm)
    dispatch(createEntityCustomFormSuccess(entityUpdated, customFormType))
    Navigation.dismissOverlay('LOADING_SCREEN')
    Navigation.popTo(actions.currentComponentId)
    actions.alertMessage()
  }
}

export function deleteAdditionalForm(customFieldProperty, entityProfile, actions, alertMessage) {
  return dispatch => {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        const { customFieldPropertyPath, customFormType } = customFormPropertyPathAndType(actions.type)
        let deleteEntityAdditonalFormPath = template(customFieldPropertyPath)
        deleteEntityAdditonalFormPath = deleteEntityAdditonalFormPath({ entity_id: entityProfile.id })
        deleteEntityAdditonalFormPath = deleteEntityAdditonalFormPath + '/' + customFieldProperty.id

        loadingScreen()
        axios
          .delete(deleteEntityAdditonalFormPath)
          .then(response => {
            const entityUpdated = deleteStateAdditionalFormInEntity(entityProfile, customFieldProperty, actions.customForm)
            dispatch(createEntityCustomFormSuccess(entityUpdated, customFormType))
            Navigation.dismissOverlay('LOADING_SCREEN')
            alertMessage()
          })
          .catch(error => {
            Navigation.dismissOverlay('LOADING_SCREEN')
            alert(JSON.stringify(error))
          })
      } else {
        Alert.alert('No internet connection')
      }
    })
  }
}