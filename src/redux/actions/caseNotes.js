import axios                    from "axios"
import { NetInfo, Alert }       from "react-native"
import _                        from "lodash"
import { Navigation }           from "react-native-navigation"
import { updateUser }           from "./users"
import { updateClient }         from "./clients"
import { saveCaseNoteOffline }  from "./offline/caseNotes"
import endpoint                 from "../../constants/endpoint"
import { loadingScreen }        from "../../navigation/config"
import Immutable                from "seamless-immutable"

export function saveCaseNote(params, client, action, previousComponentId, onSuccess) {
  return dispatch => {
    const caseNotesPath  = endpoint.clientsPath + '/' + client.id + endpoint.caseNotesPath
    const path           = action === 'update' ? (caseNotesPath + '/' + params.id) : caseNotesPath
    const caseNoteParams = handleCaseNoteParams(params, action)
    const axiosSend      = action === 'update' ? axios.put : axios.post

    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        loadingScreen()
        axiosSend(path, caseNoteParams)
          .then(response => {
            let case_note = response.data.case_note
            case_note = { ...case_note, case_note_domain_group: case_note.case_note_domain_groups, custom: params.custom }

            if (action === 'update')
              client.case_notes = client.case_notes.map(cn => cn.id === case_note.id ? case_note : cn)
            else {
              let case_notes = Immutable([case_note]).concat(client.case_notes)
              client = client.set('case_notes', case_notes)
            }
            
            dispatch(removeCompletedTasks(params, client, onSuccess))
            Navigation.dismissOverlay('LOADING_SCREEN')
            Navigation.popTo(previousComponentId)
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        Alert.alert('No internet connection')
        // dispatch(saveCaseNoteOffline(params, client, action, previousComponentId, onSuccess))
      }
    })
  }
}

const removeCompletedTasks = (params, client, onSuccess) => {
  return (dispatch, getState) => {
    const users   = getState().users.data
    const auth    = getState().auth.data
    const taskIds = params.onCompletedTasksIDs

    let user      = users[auth.id]

    user = {
      ...user,
      clients: user.clients.map(client => {
        if (client.id === params.clientId) {
          return {
            ...client,
            overdue: client.overdue.filter(task => !taskIds.includes(task.id)),
            today: client.today.filter(task => !taskIds.includes(task.id)),
            upcoming: client.upcoming.filter(task => !taskIds.includes(task.id))
          }
        }

        return client
      })
    }

    client = {
      ...client,
      tasks: {
        overdue: client.tasks.overdue.filter(task => !taskIds.includes(task.id)),
        today: client.tasks.today.filter(task => !taskIds.includes(task.id)),
        upcoming: client.tasks.upcoming.filter(task => !taskIds.includes(task.id)),
      }
    }

    dispatch(updateUser(user))
    dispatch(updateClient(client))
    onSuccess(client)
  }
}

handleCaseNoteParams = (params, action) => {
  let formdata = new FormData()
  let {selectedDomainGroups, note, attachments} = params

  formdata.append(`additional_fields[note]`, note)
  formdata.append(`case_note[custom]`, params.custom)
  formdata.append(`case_note[attendee]`, params.attendee)
  formdata.append(`case_note[client_id]`, params.clientId)
  formdata.append(`case_note[meeting_date]`, params.meetingDate)
  formdata.append(`case_note[interaction_type]`, params.interactionType)

  selectedDomainGroups.forEach((domainGroupId, index) => {
    formdata.append(`case_note[domain_group_ids][]`, domainGroupId)
  })

  if(action === 'create') {
    if (attachments.length > 0) {
      attachments.forEach((attachment) => {
        formdata.append(
          `case_note[attachments][]`,
          {
            uri: attachment.uri,
            name: attachment.name,
            type: attachment.type
          }
        )
      })
    } else {
      formdata.append(`case_note[attachments][]`, '')
    }
  }

  params.caseNoteDomainGroups.forEach((cndg, index) => {

    if (action === 'update')
      formdata.append(`case_note[case_note_domain_groups_attributes[${index}][id]]`, cndg.id)
    
    formdata.append(`case_note[case_note_domain_groups_attributes[${index}][note]]`, cndg.note)
    formdata.append(`case_note[case_note_domain_groups_attributes[${index}][domain_group_id]]`, cndg.domain_group_id)
    
    if (cndg.task_ids.length > 0)
      cndg.task_ids.forEach(task => formdata.append(`case_note[case_note_domain_groups_attributes[${index}][task_ids]][]`, task))
    else
      formdata.append(`case_note[case_note_domain_groups_attributes[${index}][task_ids]][]`, "")

  })

  return formdata
}
