import axios                                    from 'axios'
import { PROGRAM_STREAM_TYPES, CLIENT_TYPES }   from '../types'
import { Alert, NetInfo }                       from 'react-native'
import { formTypes }                            from '../../utils/validation'
import { loadingScreen }                        from '../../navigation/config'
import { Navigation }                           from 'react-native-navigation'
import endpoint                                 from '../../constants/endpoint'
import _                                        from 'lodash'

requestProgramStreams = () => ({
  type: PROGRAM_STREAM_TYPES.PROGRAM_STREAMS_REQUESTING
})

requestProgramStreamsSucceed = data => ({
  type: PROGRAM_STREAM_TYPES.PROGRAM_STREAMS_REQUEST_SUCCESS,
  data
})

requestProgramStreamsFailed = error => ({
  type: PROGRAM_STREAM_TYPES.PROGRAM_STREAMS_REQUEST_FAILED,
  error
})

requestUpdateclient = client => ({
  type: CLIENT_TYPES.UPDATE_CLIENT,
  client
})

createEnrollment = (enrollment, programStream, programStreams, client) => {
  enrollment.enrollment_field = programStream.enrollment
  enrollment.status = 'Active'
  enrollment.trackings = []

  programStream.tracking_fields = _.isUndefined(programStream.tracking_fields) ? programStream.trackings : programStream.tracking_fields
  programStream.enrollments = _.isUndefined(programStream.enrollments) ? [enrollment] : programStream.enrollments.concat(enrollment)
  programStream.tracking_required = programStream.tracking_fields.length > 0 ? false : true

  client.program_streams = [programStream, ...client.program_streams]
  client.inactive_program_streams = _.filter(client.inactive_program_streams, program => {
    return program.id != programStream.id
  })
  return client
}

createLeaveProgram = (updateData, fields, programStreamId, programStreams, client) => {
  updateData['leave_program_field'] = fields.leave_program_field
  let inactiveProgramStreams = []
  let updatedProgramStreams = []
  _.forEach(programStreams, programStream => {
    if (programStream.id == programStreamId) {
      const updateEnrollments = _.map(programStream.enrollments, enrollment => {
        if (enrollment.status == 'Active') {
          enrollment['leave_program'] = updateData
          enrollment.status = 'Exited'
          return enrollment
        }
        return enrollment
      })
      programStream['enrollments'] = updateEnrollments
      inactiveProgramStreams.push(programStream)
    } else {
      updatedProgramStreams.push(programStream)
    }
  })
  const updatedInactiveProgramStream = [...inactiveProgramStreams, ...client.inactive_program_streams]
  const updatedClient = { ...client, program_streams: updatedProgramStreams, inactive_program_streams: updatedInactiveProgramStream }
  return updatedClient
}

createTracking = (data, tracking, programStream, client) => {
  data['tracking_field'] = tracking.fields
  const updateEnrollmentTrackings = _.map(programStream.enrollments, enrollment => {
    if (enrollment.status == 'Active') {
      enrollment.trackings = [data, ...enrollment.trackings]
      return enrollment
    }
    return enrollment
  })

  updatedProgramStreams = _.map(client.program_streams, program_stream => {
    if (program_stream.id == programStream.id) {
      program_stream.enrollments = updateEnrollmentTrackings
    }
    return program_stream
  })
  client.program_streams = updatedProgramStreams
  return client
}

updateEnrollment = (updatedProperty, originalProgramStream, client, type, clickForm) => {
  const updateEnrollments = _.map(originalProgramStream.enrollments, enrollment => {
    if (type == 'Enroll') {
      if (enrollment.id == updatedProperty.id) {
        enrollment.properties = updatedProperty.properties
        enrollment.enrollment_date = updatedProperty.enrollment_date
      }
    } else if (type == 'Tracking') {
      if (enrollment.id == updatedProperty.client_enrollment_id) {
        let tracking = _.find(enrollment.trackings, { id: updatedProperty.id })
        tracking.properties = updatedProperty.properties
      }
    } else {
      if (enrollment.id == updatedProperty.client_enrollment_id) {
        enrollment.leave_program.properties = updatedProperty.properties
        enrollment.leave_program.exit_date = updatedProperty.exit_date
      }
    }
    return enrollment
  })
  if (clickForm == 'EnrolledProgram') {
    updatedProgramStreams = _.map(client.program_streams, programStream => {
      if (programStream.id == programStream.id) {
        programStream.enrollments = updateEnrollments
      }
      return programStream
    })
    client.program_streams = updatedProgramStreams
  } else {
    updatedProgramStreams = _.map(client.inactive_program_streams, programStream => {
      if (programStream.id == programStream.id) {
        programStream.enrollments = updateEnrollments
      }
      return programStream
    })

    client.inactive_program_streams = updatedProgramStreams
  }
  return client
}

updateDeleteEnrollment = (enrollmentDeleted, programStream, client, clickForm) => {
  const updateEnrollments = _.filter(programStream.enrollments, enrollment => {
    return enrollment.id != enrollmentDeleted.id
  })

  let updatedProgramStreams = []
  let enrollmentIsEmpty = false
  let clientUpdated = {}

  if (clickForm == 'EnrolledProgram') {
    _.forEach(client.program_streams, program_stream => {
      if (programStream.id == program_stream.id) {
        if (updateEnrollments.length > 0) {
          updatedProgramStream = { ...program_stream, enrollments: updateEnrollments }
          updatedProgramStreams.push(updatedProgramStream)
        }
      } else {
        updatedProgramStreams.push(program_stream)
      }
    })
    clientUpdated = { ...client, program_streams: updatedProgramStreams }
  } else {
    _.forEach(client.inactive_program_streams, program_stream => {
      if (programStream.id == program_stream.id) {
        if (updateEnrollments.length > 0) {
          updatedProgramStream = { ...program_stream, enrollments: updateEnrollments }
          updatedProgramStreams.push(updatedProgramStream)
        } else {
          enrollmentIsEmpty = true
        }
      } else {
        updatedProgramStreams.push(program_stream)
      }
    })
    clientUpdated = { ...client, inactive_program_streams: updatedProgramStreams }
  }

  return { clientUpdated, enrollmentIsEmpty }
}

updateDeleteTracking = (enrollmentId, trackingId, programStreamId, client, clickForm) => {
  let trackingIsEmpty = false
  const programStreams = clickForm == 'EnrolledProgram' ? client.program_streams : client.inactive_program_streams

  const updatedProgramStreams = _.map(programStreams, programStream => {
    if (programStreamId == programStream.id) {
      const updatedEnrollments = _.map(programStream.enrollments, enrollment => {
        if (enrollmentId == enrollment.id) {
          const updateTrackings = _.filter(enrollment.trackings, tracking => {
            return tracking.id != trackingId
          })
          trackingIsEmpty = updateTrackings.length == 0
          return { ...enrollment, trackings: updateTrackings }
        }
        return enrollment
      })
      return { ...programStream, enrollments: updatedEnrollments }
    }
    return programStream
  })
  const clientUpdated =
    clickForm == 'EnrolledProgram'
      ? { ...client, program_streams: updatedProgramStreams }
      : { ...client, inactive_program_streams: updatedProgramStreams }

  return { clientUpdated, trackingIsEmpty }
}

export function fetchProgramStreams() {
  return dispatch => {
    dispatch(requestProgramStreams())
    axios
      .get(endpoint.programStreamsPath)
      .then(response => {
        dispatch(requestProgramStreamsSucceed(response.data.program_streams))
      })
      .catch(err => {
        dispatch(requestProgramStreamsFailed(err))
      })
  }
}

export function createEnrollmentForm(field_properties, enrollment, client_id, enrollment_date, actions) {
  return (dispatch, getState) => {
    const hasInternet = getState().internet.hasInternet
    if (hasInternet) {
      loadingScreen()
      dispatch(handleEnrollmentForm('create', field_properties, enrollment, null, client_id, enrollment_date))
        .then(response => {
          const clientUpdated = createEnrollment(response.data, enrollment, actions.programStreams, actions.client)
          dispatch(requestUpdateclient(clientUpdated))
          Navigation.dismissOverlay('LOADING_SCREEN')
          Navigation.popTo(actions.clientDetailComponentId)
          actions.alertMessage()
        })
        .catch(error => {
          Navigation.dismissOverlay('LOADING_SCREEN')
          alert(JSON.stringify(error))
        })
    } else {
      Alert.alert('No internet connection')
    }
  }
}

export function updateEnrollmentForm(type, field_properties, enrollment, client_enrolled_programs_id, client_id, enrollment_date, actions) {
  return (dispatch, getState) => {
    const hasInternet = getState().internet.hasInternet
    if (hasInternet) {
      loadingScreen()
      dispatch(handleEnrollmentForm('update', field_properties, enrollment, client_enrolled_programs_id, client_id, enrollment_date))
        .then(response => {
          const clientUpdated = updateEnrollment(response.data, actions.programStream, actions.client, actions.type, actions.clickForm)
          dispatch(requestUpdateclient(clientUpdated))
          Navigation.dismissOverlay('LOADING_SCREEN')
          Navigation.popTo(actions.enrollmentDetailComponentId)
          actions.alertMessage()
        })
        .catch(err => {
          Navigation.dismissOverlay('LOADING_SCREEN')
          alert(JSON.stringify(err))
        })
    } else {
      Alert.alert('No internet connection')
    }
  }
}

export function deleteEnrollmentForm(enrollment, client_enrolled_programs_id, client_id, actions) {
  return (dispatch, getState) => {
      const hasInternet = getState().internet.hasInternet
      if (hasInternet) {
        loadingScreen()
        let enrolledProgramPath = _.template(endpoint.editEnrollmentProgramPath)
        enrolledProgramPath = enrolledProgramPath({ client_id: client_id, program_id: client_enrolled_programs_id })

        axios
          .delete(enrolledProgramPath)
          .then(response => {
            const clientDeletedEnrollment = updateDeleteEnrollment(enrollment, actions.programStream, actions.client, actions.clickForm)
            dispatch(requestUpdateclient(clientDeletedEnrollment.clientUpdated))
            const popToComponentId = clientDeletedEnrollment.enrollmentIsEmpty ? actions.clientDetailComponentId : actions.programStreamDetailComponentId
            Navigation.dismissOverlay('LOADING_SCREEN')
            Navigation.popTo(popToComponentId)
            actions.alertEnrollmentMessage()
          })
          .catch(error => {
            Navigation.dismissOverlay('LOADING_SCREEN')
            alert('Error delete Enrollment => ' + JSON.stringify(error))
          })
      } else {
        Alert.alert('No internet connection')
      }
  }
}

export function createLeaveProgramForm(field_properties, enrollment, client_enrolled_program_id, client_id, exit_date, actions) {
  return (dispatch, getState) => {
    const hasInternet = getState().internet.hasInternet
    if (hasInternet) {
      loadingScreen()
      dispatch(handleExitForm('create', field_properties, enrollment, client_enrolled_program_id, client_id, null, exit_date))
      .then(response => {
        const clientUpdated = createLeaveProgram(response.data, enrollment, enrollment.program_stream_id, actions.programStreams, actions.client)
        dispatch(requestUpdateclient(clientUpdated))
        Navigation.dismissOverlay('LOADING_SCREEN')
        Navigation.popTo(actions.clientDetailComponentId)
        actions.alertMessage()
      })
      .catch(error => {
        Navigation.dismissOverlay('LOADING_SCREEN')
        alert(JSON.stringify(error))
      })
    } else {
      Alert.alert('No internet connection')
    }
  }
}

export function updateLeaveProgramForm(
  type,
  field_properties,
  enrollment,
  client_enrolled_programs_id,
  client_id,
  leaveEnrollId,
  exit_date,
  actions
) {
  return (dispatch, getState) => {
    const hasInternet = getState().internet.hasInternet
    if (hasInternet) {
      loadingScreen()
      dispatch(handleExitForm('update', field_properties, enrollment, client_enrolled_programs_id, client_id, leaveEnrollId, exit_date))
      .then(response => {
        const clientUpdated = updateEnrollment(response.data, actions.programStream, actions.client, actions.type, actions.clickForm)
        dispatch(requestUpdateclient(clientUpdated))
        Navigation.dismissOverlay('LOADING_SCREEN')
        Navigation.popTo(actions.enrollmentDetailComponentId)
        actions.alertMessage()
      })
      .catch(err => {
        Navigation.dismissOverlay('LOADING_SCREEN')
        alert(JSON.stringify(err))
      })
    } else {
      Alert.alert('No internet connection')
    }
  }
}

export function createTrackingForm(field_properties, enrollment, client_enrolled_program_id, client_id, tracking_id, actions) {
  return (dispatch, getState) => {
    const hasInternet = getState().internet.hasInternet
    if (hasInternet) {
      loadingScreen()
      dispatch(handleTrackingForm('create', field_properties, enrollment, client_id, client_enrolled_program_id, tracking_id))
      .then(response => {
        const clientUpdated = createTracking(response.data, enrollment, actions.programStream, actions.client)
        dispatch(requestUpdateclient(clientUpdated))
        Navigation.dismissOverlay('LOADING_SCREEN')
        Navigation.popTo(actions.listTrackingComponentId)
        actions.alertMessage()
      })
      .catch(error => {
        Navigation.dismissOverlay('LOADING_SCREEN')
        alert(JSON.stringify(error))
      })
    } else {
      Alert.alert('No internet connection')
    }
  }
}

export function updateTrackingForm(type, field_properties, enrollment, client_id, client_enrolled_programs_id, tracking_id, actions) {
  return (dispatch, getState) => {
    const hasInternet = getState().internet.hasInternet
    if (hasInternet) {
      loadingScreen()
      dispatch(handleTrackingForm('update', field_properties, enrollment, client_id, client_enrolled_programs_id, tracking_id))
        .then(response => {
          const clientUpdated = updateEnrollment(response.data, actions.programStream, actions.client, actions.type, actions.clickForm)
          dispatch(requestUpdateclient(clientUpdated))
          Navigation.dismissOverlay('LOADING_SCREEN')
          Navigation.popTo(actions.enrollmentDetailComponentId)
          actions.alertMessage()
        })
        .catch(err => {
          Navigation.dismissOverlay('LOADING_SCREEN')
          alert(JSON.stringify(err))
        })
    } else {
      Alert.alert('No internet connection')
    }
  }
}

export function deleteTrackingForm(enrollment, client_id, client_enrolled_programs_id, tracking_id, actions, alertMessage) {
  return (dispatch, getState) => {
    const hasInternet = getState().internet.hasInternet
    if (hasInternet) {
      loadingScreen()
      let trackingProgramPath = _.template(endpoint.editTrackingProgramPath)
      trackingProgramPath = trackingProgramPath({ client_id: client_id, client_enrollment_id: client_enrolled_programs_id, id: tracking_id })

      axios
        .delete(trackingProgramPath)
        .then(response => {
          const clientDeletedTracking = updateDeleteTracking(enrollment.id, tracking_id, actions.programStreamId, actions.client, actions.clickForm)
          dispatch(requestUpdateclient(clientDeletedTracking.clientUpdated))
          Navigation.dismissOverlay('LOADING_SCREEN')
          alertMessage()
        })
        .catch(error => {
          Navigation.dismissOverlay('LOADING_SCREEN')
          alert('Error delete Tracking => ' + JSON.stringify(error))
        })
    } else {
      Alert.alert('No internet connection')
    }
  }
}

export function handleEnrollmentForm(type, field_properties, enrollment, client_enrolled_program_id, client_id, enrollment_date) {
  return dispatch => {
    let enrolledProgramPath = ''
    if (type == 'create') {
      enrolledProgramPath = _.template(endpoint.createEnrollmentProgramPath)
      enrolledProgramPath = enrolledProgramPath({ client_id: client_id })
    } else {
      enrolledProgramPath = _.template(endpoint.editEnrollmentProgramPath)
      enrolledProgramPath = enrolledProgramPath({
        client_id: client_id,
        program_id: client_enrolled_program_id
      })
    }
    let formdata = new FormData()
    formdata.append('program_stream_id', type == 'create' ? enrollment.id : enrollment.program_stream_id)
    formdata.append('client_enrollment[enrollment_date]', enrollment_date)

    enrollment.enrollment_field.map((field, index) => {
      if (formTypes.includes(field.type)) {
        if (field.type == 'file') {
          if (field_properties[field.label] != undefined && field_properties[field.label].length > 0) {
            const uniqIndex = Math.floor(Math.random() * 1000000)
            field_properties[field.label].map(attachment => {
              if (attachment.uri != undefined) {
                formdata.append(`client_enrollment[form_builder_attachments_attributes[${uniqIndex}][name]]`, field.name)
                formdata.append(`client_enrollment[form_builder_attachments_attributes[${uniqIndex}][file]][]`, {
                  uri: attachment.path,
                  name: attachment.name,
                  type: attachment.type
                })
              }
            })
          } else {
            if (type == 'create') {
              formdata.append(`client_enrollment_tracking[form_builder_attachments_attributes[${index}][name]]`, field.name)
              formdata.append(`client_enrollment_tracking[form_builder_attachments_attributes[${index}][file]][]`, '')
            }
          }
        } else {
          let appendString = _.template('client_enrollment[properties[${label}]]')
          let appendObject = _.template('client_enrollment[properties[${label}]][]')
          if (typeof field_properties[field.label] === 'string') {
            formdata.append(appendString({ label: field.name }), field_properties[field.label])
          } else if (typeof field_properties[field.label] === 'object') {
            if (field_properties[field.label].length > 0) {
              field_properties[field.label].map((value, index) => {
                formdata.append(appendObject({ label: field.name }), value)
              })
            } else {
              formdata.append(appendObject({ label: field.name }), '')
            }
          }
        }
      }
    })
    let response = ''
    if (type == 'create') {
      response = axios.post(enrolledProgramPath, formdata)
    } else {
      response = axios.put(enrolledProgramPath, formdata)
    }
    return response
  }
}

export function handleTrackingForm(type, field_properties, enrollment, client_id, client_enrolled_program_id, tracking_id) {
  return dispatch => {
    let trackingProgramPath = ''
    if (type == 'create') {
      trackingProgramPath = _.template(endpoint.createTrackingPath)
      trackingProgramPath = trackingProgramPath({
        client_id: client_id,
        client_enrollment_id: client_enrolled_program_id
      })
    } else {
      trackingProgramPath = _.template(endpoint.editTrackingProgramPath)
      trackingProgramPath = trackingProgramPath({
        client_id: client_id,
        client_enrollment_id: client_enrolled_program_id,
        id: tracking_id
      })
    }

    let formdata = new FormData()
    let tracking_fields = type == 'create' ? enrollment.fields : enrollment.tracking_field
    formdata.append('tracking_id', type == 'create' ? tracking_id : enrollment.tracking_id)

    tracking_fields.map((field, index) => {
      if (formTypes.includes(field.type)) {
        if (field.type == 'file') {
          if (field_properties[field.label] != undefined && field_properties[field.label].length > 0) {
            const uniqIndex = Math.floor(Math.random() * 1000000)
            field_properties[field.label].map(attachment => {
              if (attachment.uri != undefined) {
                formdata.append(`client_enrollment_tracking[form_builder_attachments_attributes[${uniqIndex}][name]]`, field.name)
                formdata.append(`client_enrollment_tracking[form_builder_attachments_attributes[${uniqIndex}][file]][]`, {
                  uri: attachment.path,
                  name: attachment.name,
                  type: attachment.type
                })
              }
            })
          } else {
            if (type == 'create') {
              formdata.append(`client_enrollment_tracking[form_builder_attachments_attributes[${index}][name]]`, field.name)
              formdata.append(`client_enrollment_tracking[form_builder_attachments_attributes[${index}][file]][]`, '')
            }
          }
        } else {
          if (typeof field_properties[field.label] === 'string') {
            formdata.append(`client_enrollment_tracking[properties[${field.name}]]`, field_properties[field.label])
          } else if (typeof field_properties[field.label] === 'object') {
            if (field_properties[field.label].length > 0) {
              field_properties[field.label].map((value, index) => {
                formdata.append(`client_enrollment_tracking[properties[${field.name}]][]`, value)
              })
            } else {
              formdata.append(`client_enrollment_tracking[properties[${field.name}]][]`, '')
            }
          }
        }
      }
    })

    let response = ''
    if (type == 'create') {
      response = axios.post(trackingProgramPath, formdata)
    } else {
      response = axios.put(trackingProgramPath, formdata)
    }
    return response
  }
}

export function handleExitForm(status, field_properties, enrollment, client_enrolled_program_id, client_id, leaveEnrollId, exit_date) {
  return dispatch => {
    let leaveProgramPath = ''
    if (status == 'create') {
      leaveProgramPath = _.template(endpoint.createLeaveProgramPath)
      leaveProgramPath = leaveProgramPath({
        client_id: client_id,
        program_id: client_enrolled_program_id
      })
    } else {
      leaveProgramPath = _.template(endpoint.editLeaveProgramPath)
      leaveProgramPath = leaveProgramPath({
        client_id: client_id,
        program_id: client_enrolled_program_id,
        leave_id: leaveEnrollId
      })
    }

    let formdata = new FormData()
    formdata.append('program_stream_id', enrollment.program_stream_id)
    formdata.append('leave_program[exit_date]', exit_date)

    enrollment.leave_program_field.map((field, index) => {
      if (formTypes.includes(field.type)) {
        if (field.type == 'file') {
          if (field_properties[field.label] != undefined && field_properties[field.label].length > 0) {
            const uniqIndex = Math.floor(Math.random() * 1000000)
            field_properties[field.label].map(attachment => {
              if (attachment.uri != undefined) {
                formdata.append(`leave_program[form_builder_attachments_attributes[${uniqIndex}][name]]`, field.name)
                formdata.append(`leave_program[form_builder_attachments_attributes[${uniqIndex}][file]][]`, {
                  uri: attachment.path,
                  name: attachment.name,
                  type: attachment.type
                })
              }
            })
          } else {
            if (status == 'create') {
              formdata.append(`leave_program[form_builder_attachments_attributes[${index}][name]]`, field.name)
              formdata.append(`leave_program[form_builder_attachments_attributes[${index}][file]][]`, '')
            }
          }
        } else {
          if (typeof field_properties[field.label] === 'string') {
            formdata.append(`leave_program[properties[${field.name}]]`, field_properties[field.label])
          } else if (typeof field_properties[field.label] === 'object') {
            if (field_properties[field.label].length > 0) {
              field_properties[field.label].map((value, index) => {
                formdata.append(`leave_program[properties[${field.name}]][]`, value)
              })
            } else {
              formdata.append(`leave_program[properties[${field.name}]][]`, '')
            }
          }
        }
      }
    })

    let response = ''
    if (status == 'create') {
      response = axios.post(leaveProgramPath, formdata)
    } else {
      response = axios.put(leaveProgramPath, formdata)
    }
    return response
  }
}
