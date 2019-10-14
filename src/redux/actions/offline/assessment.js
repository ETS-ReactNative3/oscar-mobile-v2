import { Navigation } from 'react-native-navigation'
import { loadingScreen } from '../../../navigation/config'
import { updateClient }             from '../clients'
import { QUEUE_ASSESSMENT_TYPES } from '../../types'

export const updateAssessmentQueue = (assessmentDomains) => ({
  type: QUEUE_ASSESSMENT_TYPES.UPDATE_QUEUE_ASSESSMENT,
  assessmentDomains
})

export const createAssessmentQueue = (assessmentDomains) => ({
  type: QUEUE_ASSESSMENT_TYPES.CREATE_QUEUE_ASSESSMENT,
  assessmentDomains
})


export const saveAssessmentOffline = (params, assessmentId, client, previousComponentId) => {

  return dispatch => {
    const {assessmentDomains} = params
    
    loadingScreen()

    client.assessments.forEach(assessment => {
      if (assessment.id === assessmentId) 
        assessment.assessment_domain = assessmentDomains
    })

    const assessmentDomainsParams =  serialize(params, assessmentId, client, 'update')
    
    dispatch(updateAssessmentQueue(assessmentDomainsParams))
    dispatch(updateClient(client))
    
    Navigation.dismissOverlay('LOADING_SCREEN')
    Navigation.popTo(previousComponentId)
  }
}

export const createAssessmentOffline = (params, client, previousComponentId) => {
  return dispatch => {
    
    loadingScreen()
    
    const assessmentDomainParams = serialize(params, Date.now(), client, 'create')
    const assessmentParams = {
      id: Date.now(),
      client_id: client.id,
      assessment_domain: params.assessmentDomains,
      case_notes: [],
      completed: false,
      default: params.default,
      created_at: Date.now(),
      updated_at: Date.now()
    }

    dispatch(createAssessmentQueue(assessmentDomainParams))
    client.assessments.push(assessmentParams)
    dispatch(updateClient(client))

    Navigation.dismissOverlay('LOADING_SCREEN')
    Navigation.popTo(previousComponentId)
  }
}

const serialize = (params, assessmentId, client, method) => ({
  id: assessmentId,
  data: {
    params,
    client,
    method
  },
})

export const removeAssessmentQueue = (params, assessmentId, client) => {
  return dispatch => {
    const assessmentParams = serialize(params, assessmentId, client)
    
    dispatch({
      type: QUEUE_ASSESSMENT_TYPES.REMOVE_QUEUE_ASSESSMENT,
      assessmentDomains: assessmentParams
    })
  }
}