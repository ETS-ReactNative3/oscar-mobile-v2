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
      from: 'persist',
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
    let from = 'persist'
    let action = 'create'
    let queueCustomFieldProperties = getState().queueCustomFieldProperties.data
    const currentQueueDataIndex = findIndex(queueCustomFieldProperties, { id: customField.id })

    if (customField.form != 'persist') {
      from = 'server'
      action = 'update'
    }

    const customFieldProperty = {
      id: customField.id,
      properties: properties,
      custom_field_id: additionalForm.id,
      custom_formable_type: actions.type,
      custom_formable_id: entityProfile.id,
      created_at: customField.created_at,
      from,
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

export function deleteAdditionalFormOffline(customFieldProperty, entityProfile, customFormType, actions, alertMessage) {
  return (dispatch, getState) => {
    let queueCustomFieldProperties = getState().queueCustomFieldProperties.data

    if (customFieldProperty.from == 'persist') {
      queueCustomFieldProperties = filter(queueCustomFieldProperties, queueCustomFieldProperty => {
        return queueCustomFieldProperty.id !== customFieldProperty.id
      })
    } else {
      const customFieldPropertyDeleted = {
        id: customFieldProperty.id,
        properties: customFieldProperty.properties,
        custom_field_id: customFieldProperty.custom_field_id,
        custom_formable_type: actions.type,
        custom_formable_id: entityProfile.id,
        created_at: customFieldProperty.created_at,
        from: 'server',
        action: 'delete'
      }
      queueCustomFieldProperties = [...queueCustomFieldProperties, customFieldPropertyDeleted]
    }

    dispatch(createCustomFieldPropertySuccess(queueCustomFieldProperties))
    const entityUpdated = deleteStateAdditionalFormInEntity(entityProfile, customFieldProperty, actions.customForm)
    dispatch(createEntityCustomFormSuccess(entityUpdated, customFormType))
    Navigation.dismissOverlay('LOADING_SCREEN')
    alertMessage()
  }
}