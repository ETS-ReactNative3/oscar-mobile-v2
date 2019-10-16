import axios                    from "axios"
import { NetInfo }              from "react-native"
import { Navigation }           from "react-native-navigation"
import { updateUser }           from "./users"
import { updateClient }         from "./clients"
import { saveCaseNoteOffline }  from "./offline/caseNotes"
import endpoint                 from "../../constants/endpoint"
import { loadingScreen }        from '../../navigation/config'

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
            case_note = { ...case_note, case_note_domain_group: case_note.case_note_domain_groups }
            if (action === 'update')
              client.case_notes = client.case_notes.map(cn => cn.id === case_note.id ? case_note : cn)
            else
              client.case_notes.unshift(case_note)
            dispatch(removeCompletedTasks(params, client, onSuccess))
            Navigation.dismissOverlay('LOADING_SCREEN')
            Navigation.popTo(previousComponentId)
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        dispatch(saveCaseNoteOffline(params, client, action, previousComponentId, onSuccess))
      }
    })
  }
}

export const removeCompletedTasks = (params, client, onSuccess) => {
  return (dispatch, getState) => {
    const users   = getState().users.data
    const auth    = getState().auth.data
    const taskIds = []

    params.caseNoteDomainGroups.forEach(cndg => {
      cndg.task_ids.length < 0 && taskIds.push(cndg.task_ids)
    })

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

  formdata.append(`case_note[custom]`, params.custom)
  formdata.append(`case_note[attendee]`, params.attendee)
  formdata.append(`case_note[client_id]`, params.clientId)
  formdata.append(`case_note[meeting_date]`, params.meetingDate)
  formdata.append(`case_note[interaction_type]`, params.interactionType)

  params.caseNoteDomainGroups.forEach((cndg, index) => {
    if (action === 'update')
      formdata.append(`case_note[case_note_domain_groups_attributes[${index}][id]]`, cndg.id)
    formdata.append(`case_note[case_note_domain_groups_attributes[${index}][note]]`, cndg.note)
    formdata.append(`case_note[case_note_domain_groups_attributes[${index}][domain_group_id]]`, cndg.domain_group_id)

    if (cndg.task_ids.length > 0)
      cndg.task_ids.forEach(task => formdata.append(`case_note[case_note_domain_groups_attributes[${index}][task_ids]][]`, task))
    else
      formdata.append(`case_note[case_note_domain_groups_attributes[${index}][task_ids]][]`, "")

    if (cndg.attachments.length > 0) {
      cndg.attachments.forEach(attachment => {
        if (attachment.uri != undefined && attachment.name != undefined) {
          formdata.append(
            `case_note[case_note_domain_groups_attributes[${index}][attachments]][]`,
            {
              uri: attachment.uri,
              name: attachment.name,
              type: attachment.type
            }
          )
        }
      })
    } else {
      formdata.append(`case_note[case_note_domain_groups_attributes[${index}][attachments]][]`, '')
    }
  })

  return formdata
}
