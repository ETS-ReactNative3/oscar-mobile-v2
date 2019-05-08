import { Navigation }                       from 'react-native-navigation'
import { findIndex, filter }        from 'lodash'
import { QUEUE_CUSTOM_FIELD_PEROPERTY_TYPES }       from '../../types'
import {
  createEntityCustomFormSuccess,
  addEntityCustomFormState,
  updateStateAdditionalFormInEntity,
  mergeStateAdditionalFormInEntity,
  deleteStateAdditionalFormInEntity,
} from '../customForms'

export const createCustomFieldPropertySuccess = data => ({
  type: QUEUE_CUSTOM_FIELD_PEROPERTY_TYPES.QUEUE_CUSTOM_FIELD_PEROPERTIES_REQUEST_SUCCESS,
  data
})

export const customFieldPropertyDeleted = data => ({
  type: QUEUE_CUSTOM_FIELD_PEROPERTY_TYPES.QUEUE_CUSTOM_FIELD_PEROPERTIES_DELETED,
  data
})

export function createAdditionalFormOffline(properties, entityProfile, additionalForm, customFormType, createEntityAdditonalFormPath, actions) {
  return dispatch => {
    const customFieldProperty = {
      id: Date.now(),
      properties: properties,
      custom_field_id: additionalForm.id,
      custom_formable_type: actions.type,
      custom_formable_id: entityProfile.id,
      created_at: new Date(),
      from: 'persist',
      action: 'create',
      endPoint: createEntityAdditonalFormPath,
      additionalForm: { id: additionalForm.id, fields: additionalForm.fields }
    }

    dispatch(createCustomFieldPropertySuccess(customFieldProperty))

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

export function editAdditionalFormOffline(properties, entityProfile, customField, additionalForm, customFormType, updateEntityAdditonalFormPath, actions) {
  return dispatch => {
    let from = 'persist'
    let action = 'create'
    let endPoint = customField.endPoint

    if (customField.from != 'persist') {
      from = 'server'
      action = 'update'
      endPoint = updateEntityAdditonalFormPath
    }

    const customFieldProperty = {
      id: customField.id,
      properties: properties,
      custom_field_id: additionalForm.id,
      custom_formable_type: actions.type,
      custom_formable_id: entityProfile.id,
      created_at: customField.created_at,
      additionalForm: { id: additionalForm.id, fields: additionalForm.fields },
      from,
      action,
      endPoint
    }

    dispatch(createCustomFieldPropertySuccess(customFieldProperty))
    const entityUpdated = updateStateAdditionalFormInEntity(entityProfile, customFieldProperty, additionalForm)
    dispatch(createEntityCustomFormSuccess(entityUpdated, customFormType))
    Navigation.dismissOverlay('LOADING_SCREEN')
    Navigation.popTo(actions.currentComponentId)
    actions.alertMessage()
  }
}

export function deleteAdditionalFormOffline(customFieldProperty, entityProfile, customFormType, deleteEntityAdditonalFormPath, actions , alertMessage) {
  return dispatch => {
    if (customFieldProperty.from == 'persist') {
      dispatch(customFieldPropertyDeleted(customFieldPropertyDeleted))
    } else {
      const customFieldPropertyDeleted = {
        id: customFieldProperty.id,
        properties: customFieldProperty.properties,
        custom_field_id: customFieldProperty.custom_field_id,
        custom_formable_type: actions.type,
        custom_formable_id: entityProfile.id,
        created_at: customFieldProperty.created_at,
        endPoint: deleteEntityAdditonalFormPath,
        from: 'server',
        action: 'delete'
      }
      dispatch(createCustomFieldPropertySuccess(customFieldPropertyDeleted))
    }
    const entityUpdated = deleteStateAdditionalFormInEntity(entityProfile, customFieldProperty, actions.customForm)
    dispatch(createEntityCustomFormSuccess(entityUpdated, customFormType))
    Navigation.dismissOverlay('LOADING_SCREEN')
    alertMessage()
  }
}