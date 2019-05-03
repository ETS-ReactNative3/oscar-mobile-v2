import axios                                from 'axios'
import { formTypes }                        from '../../../utils/validation'
import { Navigation }                       from 'react-native-navigation'
import { loadingScreen }                    from '../../../navigation/config'
import { Alert, NetInfo }                   from 'react-native'
import Database               from '../../../config/Database'
import { template, map, filter, find }      from 'lodash'
import { QUEUE_CUSTOM_FIELD_PEROPERTY_TYPES }       from '../../types'
import {
  createEntityCustomFormSuccess,
  addEntityCustomFormState,
  updateStateAdditionalFormInEntity,
  mergeStateAdditionalFormInEntity,
  deleteStateAdditionalFormInEntity,
  handleEntityAdditonalForm
} from '../customForms'

const createCustomFieldPropertySuccess = data => ({
  type: QUEUE_CUSTOM_FIELD_PEROPERTY_TYPES.QUEUE_CUSTOM_FIELD_PEROPERTIES_REQUEST_SUCCESS,
  data
})

const updateCustomFieldPropertySuccess = data => ({
  type: QUEUE_CUSTOM_FIELD_PEROPERTY_TYPES.QUEUE_CUSTOM_FIELD_PEROPERTIES_UPDATED,
  data
})

export function createAdditionalFormOffline(properties, entityProfile, additionalForm, customFormType, createEntityAdditonalFormPath, actions) {
  return (dispatch, getState) => {
    const customFieldProperty = {
      id: Date.now(),
      properties: properties,
      custom_field_id: additionalForm.id,
      custom_formable_type: actions.type,
      custom_formable_id: entityProfile.id,
      created_at: new Date()
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

export function editAdditionalForm(properties, entityProfile, custom_field, additionalForm, actions) {
  return dispatch => {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        const { customFieldPropertyPath, customFormType } = customFormPropertyPathAndType(actions.type)
        let updateEntityAdditonalFormPath = template(customFieldPropertyPath)
        updateEntityAdditonalFormPath = updateEntityAdditonalFormPath({ entity_id: entityProfile.id })
        updateEntityAdditonalFormPath = updateEntityAdditonalFormPath + '/' + custom_field.id

        loadingScreen()
        dispatch(handleEntityAdditonalForm('update', properties, additionalForm, updateEntityAdditonalFormPath))
          .then(response => {
            const entityUpdated = updateStateAdditionalFormInEntity(entityProfile, response.data, additionalForm)
            dispatch(createEntityCustomFormSuccess(entityUpdated, customFormType))
            Navigation.dismissOverlay('LOADING_SCREEN')
            Navigation.popTo(actions.currentComponentId)
            actions.alertMessage()
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