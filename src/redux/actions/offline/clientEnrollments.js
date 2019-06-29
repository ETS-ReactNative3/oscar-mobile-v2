import { Navigation }                       from 'react-native-navigation'
import { QUEUE_CLIENT_ENROLLMENT_TYPES }       from '../../types'
import {
  createEnrollment
} from '../programStreams'

export const createClientEnrollmentSuccess = data => ({
  type: QUEUE_CLIENT_ENROLLMENT_TYPES.QUEUE_CLIENT_ENROLLMENTS_REQUEST_SUCCESS,
  data
})

export const clientEnrollmentDeleted = data => ({
  type: QUEUE_CLIENT_ENROLLMENT_TYPES.QUEUE_CLIENT_ENROLLMENT_DELETED,
  data
})

export function createClientEnrollmentOffline(field_properties, programStream, client_id, enrollment_date, actions) {
  return dispatch => {
    const clientEnrollment = {
      id: Date.now(),
      properties: field_properties,
      program_stream_id: programStream.id,
      client_id: client_id,
      enrollment_date,
      from: 'persist',
      action: 'create'
    }

    dispatch(createClientEnrollmentSuccess(clientEnrollment))

    const clientUpdated = createEnrollment(clientEnrollment, programStream, actions.client)
    dispatch(requestUpdateclient(clientUpdated))
    Navigation.dismissOverlay('LOADING_SCREEN')
    Navigation.popTo(actions.clientDetailComponentId)
    actions.alertMessage()
  }
}

export function editClientEnrollmentOffline(field_properties, enrollment, client_enrolled_programs_id, client_id, enrollment_date, actions) {
  return dispatch => {
    let from = 'persist'
    let action = 'create'

    if (enrollment.from != 'persist') {
      from = 'server'
      action = 'update'
    }

    const clientEnrollment = {
      id: client_enrolled_programs_id,
      properties: field_properties,
      program_stream_id: enrollment.program_stream_id,
      client_id,
      enrollment_date,
      from,
      action,
    }

    dispatch(createClientEnrollmentSuccess(clientEnrollment))
    const clientUpdated = updateEnrollment(clientEnrollment, actions.programStream, actions.client, actions.type, actions.clickForm)
    dispatch(requestUpdateclient(clientUpdated))
    Navigation.dismissOverlay('LOADING_SCREEN')
    Navigation.popTo(actions.enrollmentDetailComponentId)
    actions.alertMessage()
  }
}

export function deleteAdditionalFormOffline(enrollment, client_enrolled_programs_id, client_id, actions) {
  return dispatch => {
    if (enrollment.from == 'persist') {
      dispatch(clientEnrollmentDeleted(enrollment))
    } else {
      const clientEnrollmentDeleted = {
        id: client_enrolled_programs_id,
        properties: enrollment.properties,
        program_stream_id: enrollment.program_stream_id,
        client_id,
        enrollment_date: enrollment.enrollment_date,
        from: 'server',
        action: 'delete'
      }
      dispatch(createClientEnrollmentSuccess(clientEnrollmentDeleted))
    }

    const clientDeletedEnrollment = updateDeleteEnrollment(enrollment, actions.programStream, actions.client, actions.clickForm)
    dispatch(requestUpdateclient(clientDeletedEnrollment.clientUpdated))
    const popToComponentId = clientDeletedEnrollment.enrollmentIsEmpty ? actions.clientDetailComponentId : actions.programStreamDetailComponentId
    Navigation.dismissOverlay('LOADING_SCREEN')
    Navigation.popTo(popToComponentId)
    actions.alertEnrollmentMessage()
  }
}