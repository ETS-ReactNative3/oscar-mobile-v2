import { Alert } from 'react-native'
import { filter, isEmpty } from 'lodash'

export const formTypes = ['checkbox-group', 'textarea', 'date', 'text', 'number', 'radio-group', 'select', 'file']

export function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export function disabledUpload() {
  return false
}

export function validateProgramStreamForm(
  status,
  type,
  field_properties,
  enrollment,
  program_stream,
  client_enrolled_programs_id,
  exit_date,
  enrollment_date,
  actions
) {
  let enrollmentFormFields = []
  if (type == 'Exit') {
    enrollmentFormFields = enrollment.leave_program_field
  } else if (type == 'Enroll') {
    enrollmentFormFields = enrollment.enrollment_field
  } else {
    enrollmentFormFields = enrollment.tracking_field
  }

  const formrequired = filter(enrollmentFormFields, field => {
    return field.required && isEmpty(field_properties[field.label])
  })

  const numberBetween = filter(enrollmentFormFields, field => {
    if (field.type == 'number' && field_properties[field.label] != '') {
      if (field.max != undefined && field.min != undefined) {
        return !(
          parseFloat(field.min) <= parseFloat(field_properties[field.label]) &&
          parseFloat(field_properties[field.label]) <= parseFloat(field.max)
        )
      } else if (field.max != undefined && field.min == undefined) {
        return parseFloat(field_properties[field.label]) > parseFloat(field.max)
      } else if (field.max == undefined && field.min != undefined) {
        return parseFloat(field_properties[field.label]) < parseFloat(field.min)
      }
    }
  })

  const emailValidation = filter(enrollmentFormFields, field => {
    if (field.type == 'text' && field.subtype == 'email' && field_properties[field.label] != '') {
      return !validateEmail(field_properties[field.label])
    }
  })

  if (formrequired.length + numberBetween.length + emailValidation.length == 0) {
    if (type == 'Exit') {
      if (status == 'update') {
        actions.updateLeaveProgramForm(
          type,
          field_properties,
          enrollment,
          client_enrolled_programs_id,
          actions.client.id,
          enrollment.id,
          exit_date,
          actions
        )
      }
    } else if (type == 'Enroll') {
      if (status == 'update') {
        actions.updateEnrollmentForm(
          type,
          field_properties,
          enrollment,
          client_enrolled_programs_id,
          actions.client.id,
          enrollment_date,
          actions
        )
      }
    } else {
      if (status == 'update') {
        actions.updateTrackingForm(
          type,
          field_properties,
          enrollment,
          actions.client.id,
          enrollment.client_enrollment_id,
          enrollment.id,
          actions
        )
      }
    }
  } else {
    let message = ''
    if (formrequired.length > 0) {
      message = `${formrequired[0].label} is required.`
    } else if (numberBetween.length > 0) {
      const field = numberBetween[0]
      if (field.min != undefined && field.max != undefined) {
        message = `${field.label} cannot be ${
          parseFloat(field_properties[field.label]) < parseFloat(field.min)
            ? 'lower then ' + field.min
            : 'greater then ' + field.max
        }`
      } else if (field.min != undefined && field.max == undefined) {
        message = `${field.label} cannot be lower than ${field.min}`
      } else if (field.min == undefined && field.max != undefined) {
        message = `${field.label} cannot be greater than ${field.max}`
      }
    } else if (emailValidation.length > 0) {
      message = `${emailValidation[0].label} is not an email`
    }
    Alert.alert('Warning', message)
  }
}

export function validateAdditonalForm(status, properties, client, custom_field, additionalForm, actions) {
  const formrequired = filter(additionalForm.fields, field => {
    return field.required && isEmpty(properties[field.label])
  })

  const numberBetween = filter(additionalForm.fields, field => {
    if (field.type == 'number' && properties[field.label] != '') {
      if (field.max != undefined && field.min != undefined) {
        return !(
          parseFloat(field.min) <= parseFloat(properties[field.label]) &&
          parseFloat(properties[field.label]) <= parseFloat(field.max)
        )
      } else if (field.max != undefined && field.min == undefined) {
        return parseFloat(properties[field.label]) > parseFloat(field.max)
      } else if (field.max == undefined && field.min != undefined) {
        return parseFloat(properties[field.label]) < parseFloat(field.min)
      }
    }
  })

  const emailValidation = filter(additionalForm.fields, field => {
    if (field.type == 'text' && field.subtype == 'email' && properties[field.label] != '') {
      return !validateEmail(properties[field.label])
    }
  })

  if (formrequired.length + numberBetween.length + emailValidation.length == 0) {
    if (status == 'update') {
      actions.editAdditionalForm(properties, client, custom_field, additionalForm, actions)
    } else {
      actions.createAdditionalForm(properties, client, additionalForm, actions)
    }
  } else {
    let message = ''
    if (formrequired.length > 0) {
      message = `${formrequired[0].label} is required.`
    } else if (numberBetween.length > 0) {
      const field = numberBetween[0]
      if (field.min != undefined && field.max != undefined) {
        message = `${field.label} cannot be ${
          parseFloat(properties[field.label]) < parseFloat(field.min)
            ? 'lower then ' + field.min
            : 'greater then ' + field.max
        }`
      } else if (field.min != undefined && field.max == undefined) {
        message = `${field.label} cannot be lower than ${field.min}`
      } else if (field.min == undefined && field.max != undefined) {
        message = `${field.label} cannot be greater than ${field.max}`
      }
    } else if (emailValidation.length > 0) {
      message = `${emailValidation[0].label} is not an email`
    }
    Alert.alert('Warning', message)
  }
}

export function validateCustomForm(field_properties, fields) {
  const formrequired = filter(fields, field => {
    return field.required && isEmpty(field_properties[field.label])
  })

  const numberBetween = filter(fields, field => {
    if (field.type == 'number' && field_properties[field.label] != '') {
      if (field.max != undefined && field.min != undefined) {
        return !(
          parseFloat(field.min) <= parseFloat(field_properties[field.label]) &&
          parseFloat(field_properties[field.label]) <= parseFloat(field.max)
        )
      } else if (field.max != undefined && field.min == undefined) {
        return parseFloat(field_properties[field.label]) > parseFloat(field.max)
      } else if (field.max == undefined && field.min != undefined) {
        return parseFloat(field_properties[field.label]) < parseFloat(field.min)
      }
    }
  })

  const emailValidation = filter(fields, field => {
    if (field.type == 'text' && field.subtype == 'email' && field_properties[field.label] != '') {
      return !validateEmail(field_properties[field.label])
    }
  })

  if (formrequired.length + numberBetween.length + emailValidation.length == 0) {
    return true
  } else {
    let message = ''
    if (formrequired.length > 0) {
      message = `${formrequired[0].label} is required.`
    } else if (numberBetween.length > 0) {
      const field = numberBetween[0]
      if (field.min != undefined && field.max != undefined) {
        message = `${field.label} cannot be ${
          parseFloat(field_properties[field.label]) < parseFloat(field.min)
            ? 'lower then ' + field.min
            : 'greater then ' + field.max
        }`
      } else if (field.min != undefined && field.max == undefined) {
        message = `${field.label} cannot be lower than ${field.min}`
      } else if (field.min == undefined && field.max != undefined) {
        message = `${field.label} cannot be greater than ${field.max}`
      }
    } else if (emailValidation.length > 0) {
      message = `${emailValidation[0].label} is not an email`
    }
    Alert.alert('Warning', message)
    return false
  }
}
