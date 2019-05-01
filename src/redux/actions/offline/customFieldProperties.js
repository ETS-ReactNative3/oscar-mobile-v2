import axios                                from 'axios'
import { formTypes }                        from '../../../utils/validation'
import { Navigation }                       from 'react-native-navigation'
import { loadingScreen }                    from '../../../navigation/config'
import { Alert, NetInfo }                   from 'react-native'
import Database               from '../../../config/Database'
import { template, map, filter, find }      from 'lodash'
import {
  createEntityCustomFormSuccess,
  addEntityCustomFormState,
  updateStateAdditionalFormInEntity,
  mergeStateAdditionalFormInEntity,
  deleteStateAdditionalFormInEntity,
  handleEntityAdditonalForm
} from '../customForms'

export function createAdditionalFormOffline(properties, entityProfile, additionalForm, customFormType, createEntityAdditonalFormPath, actions) {
  return dispatch => {
    const params = {
      id: Date.now(),
      properties: JSON.stringify(properties),
      custom_field_id: additionalForm.id,
      custom_formable_type: actions.type,
      custom_formable_id: entityProfile.id,
      created_at: new Date(),
      type: 'create',
      custom_field_property_path: createEntityAdditonalFormPath
    }

    const customFieldProperty = {
      id: Date.now(),
      properties: properties,
      custom_field_id: additionalForm.id,
      custom_formable_type: actions.type,
      custom_formable_id: entityProfile.id,
      created_at: new Date(),
      custom_field_property_path: createEntityAdditonalFormPath
    }

    Database.write(() => { Database.create('CustomFieldProperties', params) })

    // let currentClient = JSON.stringify(Database.objects('CustomFieldProperties'))
    // console.log(JSON.parse(currentClient))

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