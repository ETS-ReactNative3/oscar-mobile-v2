import axios                                from 'axios'
import { formTypes }                        from '../../utils/validation'
import { Navigation }                       from 'react-native-navigation'
import { loadingScreen }                    from '../../navigation/config'
import { Alert, NetInfo }                   from 'react-native'
import { template, map, filter, find }      from 'lodash'
import { FAMILY_TYPES, CLIENT_TYPES }       from '../types'
import endpoint                             from '../../constants/endpoint'
import {
  createAdditionalFormOffline,
  editAdditionalFormOffline,
  deleteAdditionalFormOffline
} from './offline/customFieldProperties'

export const createEntityCustomFormSuccess = (entityUpdated, customFormType) => ({
  type: customFormType,
  entityUpdated
})

export const addEntityCustomFormState = (entity, newCustomFieldProperty, form) => {
  form['custom_field_properties'] = [newCustomFieldProperty]
  const updateForms = entity.add_forms.filter(add_form => {
    return add_form.id !== form.id
  })
  entity.add_forms = updateForms
  entity.additional_form = [form, ...entity.additional_form]
  return entity
}

export const updateStateAdditionalFormInEntity = (entity, updatedCustomFieldProperty, additionalForm) => {
  let newForm = []
  if (additionalForm.custom_field_properties.length > 0) {
    newForm = map(entity.additional_form, form => {
      if (form.id === updatedCustomFieldProperty.custom_field_id) {
        const newCustomFieldProperties = map(form.custom_field_properties, customFieldProperty => {
          if (customFieldProperty.id === updatedCustomFieldProperty.id) {
            return updatedCustomFieldProperty
          }
          return customFieldProperty
        })
        form.custom_field_properties = newCustomFieldProperties
        return form
      }
      return form
    })
    entity.additional_form = newForm
  }
  return entity
}

export const mergeStateAdditionalFormInEntity = (entity, newCustomFieldProperty, additionalForm) => {
  let newForm = []
  if (additionalForm.custom_field_properties.length > 0) {
    newForm = map(entity.additional_form, form => {
      if (form.id === newCustomFieldProperty.custom_field_id) {
        form.custom_field_properties = [newCustomFieldProperty, ...form.custom_field_properties]
        return form
      }
      return form
    })
    entity.additional_form = newForm
  }
  return entity
}

export const deleteStateAdditionalFormInEntity = (entity, deletedCustomFieldProperty, additionalForm) => {
  let newAddForms = []
  let newAdditionalForms = []
  let newForms = []
  if (additionalForm.custom_field_properties.length > 0) {
    newForms = map(entity.additional_form, form => {
      if (form.id === deletedCustomFieldProperty.custom_field_id) {
        const updatedCustomFieldProperties = filter(form.custom_field_properties, customFieldProperty => {
          return customFieldProperty.id !== deletedCustomFieldProperty.id
        })
        return { ...form, custom_field_properties: updatedCustomFieldProperties }
      }
      return form
    })
  }
  const customFormDeleted = find(newForms, { id: additionalForm.id })
  if (customFormDeleted.custom_field_properties.length === 0) {
    newAddForms = [customFormDeleted, ...newAddForms]
    newAdditionalForms = filter(entity.additional_form, additional_form => {
      return additional_form.id != customFormDeleted.id
    })
    return {
      ...entity,
      additional_form: newAdditionalForms,
      add_forms: [...newAddForms, ...entity.add_forms]
    }
  }

  return {
    ...entity,
    additional_form: newForms
  }
}

customFormPropertyPathAndType = type => {
  let customFieldPropertyPath = ''
  let customFormType = ''
  if (type == 'client') {
    customFieldPropertyPath = endpoint.createClientAdditonalFormPath
    customFormType = CLIENT_TYPES.CLIENT_CUSTOM_FORM
  } else {
    customFieldPropertyPath = endpoint.createFamilyAdditonalFormPath
    customFormType = FAMILY_TYPES.FAMILY_CUSTOM_FORM
  }
  return { customFieldPropertyPath, customFormType }
}

export function createAdditionalForm(properties, entityProfile, additionalForm, actions) {
  return dispatch => {
    NetInfo.isConnected.fetch().then(isConnected => {
      const { customFieldPropertyPath, customFormType } = customFormPropertyPathAndType(actions.type)
      loadingScreen()
      if (isConnected) {
        let entityUpdated = {}
        let createEntityAdditonalFormPath = template(customFieldPropertyPath)
        createEntityAdditonalFormPath = createEntityAdditonalFormPath({ entity_id: entityProfile.id })
        dispatch(handleEntityAdditonalForm('create', properties, additionalForm, createEntityAdditonalFormPath))
          .then(response => {
            if (actions.clickForm == 'additionalForm') {
              entityUpdated = mergeStateAdditionalFormInEntity(entityProfile, response.data, additionalForm)
            } else {
              entityUpdated = addEntityCustomFormState(entityProfile, response.data, additionalForm)
            }
            dispatch(createEntityCustomFormSuccess(entityUpdated, customFormType))
            Navigation.dismissOverlay('LOADING_SCREEN')
            Navigation.popTo(actions.entityDetailComponentId)
            actions.alertMessage()
          })
          .catch(error => {
            Navigation.dismissOverlay('LOADING_SCREEN')
            alert(JSON.stringify(error))
          })
      } else {
        dispatch(createAdditionalFormOffline(properties, entityProfile, additionalForm, customFormType, actions))
      }
    })
  }
}

export function editAdditionalForm(properties, entityProfile, customField, additionalForm, actions) {
  return dispatch => {
    NetInfo.isConnected.fetch().then(isConnected => {
      const { customFieldPropertyPath, customFormType } = customFormPropertyPathAndType(actions.type)
      loadingScreen()
      if (isConnected) {
        let updateEntityAdditonalFormPath = template(customFieldPropertyPath)
        updateEntityAdditonalFormPath = updateEntityAdditonalFormPath({ entity_id: entityProfile.id })
        updateEntityAdditonalFormPath = updateEntityAdditonalFormPath + '/' + customField.id

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
        dispatch(editAdditionalFormOffline(properties, entityProfile, customField, additionalForm, customFormType, actions))
      }
    })
  }
}

export function deleteAdditionalForm(customFieldProperty, entityProfile, actions, alertMessage) {
  return dispatch => {
    NetInfo.isConnected.fetch().then(isConnected => {
      const { customFieldPropertyPath, customFormType } = customFormPropertyPathAndType(actions.type)
      if (isConnected) {
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
        dispatch(deleteAdditionalFormOffline(customFieldProperty, entityProfile, customFormType, actions, alertMessage))
      }
    })
  }
}

export function handleEntityAdditonalForm(type, properties, additionalForm, EndPoint) {
  return dispatch => {
    let formData = new FormData()
    formData.append('custom_field_id', additionalForm.id)

    additionalForm.fields.forEach((field, index) => {
      if (formTypes.includes(field.type)) {
        if (field.type == 'file') {
          if (properties[field.label] != undefined && properties[field.label].length > 0) {
            const uniqIndex = Math.floor(Math.random() * 1000000)
            properties[field.label].forEach(attachment => {
              if (attachment.uri != undefined) {
                formData.append(`custom_field_property[form_builder_attachments_attributes[${uniqIndex}][name]]`, field.name)
                formData.append(`custom_field_property[form_builder_attachments_attributes[${uniqIndex}][file]][]`, {
                  uri: attachment.path,
                  name: attachment.name,
                  type: attachment.type
                })
              }
            })
          } else {
            if (type == 'create') {
              formData.append(`custom_field_property[form_builder_attachments_attributes[${index}][name]]`, field.name)
              formData.append(`custom_field_property[form_builder_attachments_attributes[${index}][file]][]`, '')
            }
          }
        } else {
          if (typeof properties[field.label] === 'string') {
            formData.append(`custom_field_property[properties[${field.name}]]`, properties[field.label])
          } else if (typeof properties[field.label] === 'object') {
            if (properties[field.label].length > 0) {
              properties[field.label].forEach((value, index) => {
                formData.append(`custom_field_property[properties[${field.name}]][]`, value)
              })
            } else {
              formData.append(`custom_field_property[properties[${field.name}]][]`, '')
            }
          }
        }
      }
    })

    if (type == 'create') {
      return axios.post(EndPoint, formData)
    } else {
      return axios.put(EndPoint, formData)
    }
  }
}
