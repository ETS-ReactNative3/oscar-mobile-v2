import axios from 'axios'
import { updateClient }             from './clients'
import { Alert, NetInfo }           from 'react-native'
import { loadingScreen }            from '../../navigation/config'
import { Navigation }               from 'react-native-navigation'
import endpoint                     from '../../constants/endpoint'
import { saveAssessmentOffline, createAssessmentOffline }    from './offline/assessment'

export function updateAssessment(params, assessmentId, client, previousComponentId, alertMessage) {
  return dispatch => {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        const path = endpoint.clientsPath + '/' + client.id + endpoint.assessmentsPath + '/' + assessmentId
        const assessmentParams = handleAssessmentParams(params, 'update')

        loadingScreen()
        axios
          .put(path, assessmentParams)
          .then(response => {
            client.assessments.forEach(assessment => {
              if (assessment.id === assessmentId) assessment.assessment_domain = response.data.assessment.assessment_domain
            })
            dispatch(updateClient(client))

            Navigation.dismissOverlay('LOADING_SCREEN')
            Navigation.popTo(previousComponentId)
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        dispatch(saveAssessmentOffline(params, assessmentId, client, previousComponentId))
      }
    })
  }
}

export function syncUpdateAssessment(params, assessmentId, client) {
  return dispatch => {
    const path = endpoint.clientsPath + '/' + client.id + endpoint.assessmentsPath + '/' + assessmentId
    const assessmentParams = handleAssessmentParams(params, 'update')

    axios
      .put(path, assessmentParams)
      .then(response => {
        client.assessments.forEach(assessment => {
          if (assessment.id === assessmentId) assessment.assessment_domain = response.data.assessment.assessment_domain
        })

        dispatch(updateClient(client))
      })
      .catch(err => {
        console.log(err)
      })
  }
}

export function createAssessment(params, client, previousComponentId, onSuccess) {
  return dispatch => {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        const path = endpoint.clientsPath + '/' + client.id + endpoint.assessmentsPath
        const assessmentParams = handleAssessmentParams(params, 'create')

        loadingScreen()
        axios
        .post(path, assessmentParams)
        .then(response => {

          client.assessments.push(response.data.assessment)
          dispatch(updateClient(client))

          Navigation.dismissOverlay('LOADING_SCREEN')
          Navigation.popTo(previousComponentId)
        })
        .catch(err => {
          console.log(err.response)
        })
      } else {
        dispatch(createAssessmentOffline(params, client, previousComponentId))
      }
    })
  }
}

export function syncCreateAssessment(params, client) {
  return dispatch => {
    const path = endpoint.clientsPath + '/' + client.id + endpoint.assessmentsPath
    const assessmentParams = handleAssessmentParams(params, 'create')
    axios
        .post(path, assessmentParams)
        .then(response => {
          client.assessments.push(response.data.assessment)
          dispatch(updateClient(client))
          console.log("SYNC created assessment success");
        })
        .catch(err => {
          console.log(err.response)
        })
  }
}

handleAssessmentParams = (params, action) => {
  let formdata = new FormData()

  params.assessmentDomains.forEach((ad, index) => {
    formdata.append(`assessment[default]`, params.default)

    if (action === 'update') formdata.append(`assessment[assessment_domains_attributes[${index}][id]]`, ad.id)
    formdata.append(`assessment[assessment_domains_attributes[${index}][domain_id]]`, ad.domain_id)
    formdata.append(`assessment[assessment_domains_attributes[${index}][score]]`, ad.score)
    formdata.append(`assessment[assessment_domains_attributes[${index}][reason]]`, ad.reason)
    formdata.append(`assessment[assessment_domains_attributes[${index}][goal]]`, ad.goal)

    if (ad.attachments.length > 0) {
      ad.attachments.map(attachment => {
        if (attachment.uri != undefined && attachment.name != undefined) {
          formdata.append(`assessment[assessment_domains_attributes[${index}][attachments]][]`, {
            uri: attachment.uri,
            name: attachment.name,
            type: attachment.type
          })
        }
      })
    } else {
      formdata.append(`assessment[assessment_domains_attributes[${index}][attachments]][]`, '')
    }
  })

  return formdata
}
