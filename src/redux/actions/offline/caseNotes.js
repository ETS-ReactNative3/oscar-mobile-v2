import { Navigation }     from "react-native-navigation"
import { updateUser }     from "../users"
import { updateClient }   from "../clients"
import { loadingScreen }  from "../../../navigation/config"

export function saveCaseNoteOffline(params, client, action, previousComponentId, onSuccess) {
  return dispatch => {
    loadingScreen()
    const case_note = serialize(params, client)
    // if (action === 'update')
    //   client.case_notes = client.case_notes.map(cn => cn.id === case_note.id ? case_note : cn)
    // else
    //   client.case_notes.unshift(case_note)

    // dispatch(removeCompletedTasks(params, client, onSuccess))
    Navigation.dismissOverlay('LOADING_SCREEN')
    Navigation.popTo(previousComponentId)
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

    let user = users[auth.id]

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

serialize = (case_note, client) => {
  const case_note_domain_group = case_note.caseNoteDomainGroups.map(cndg => ({
    attachments: cndg.attachments,
    domain_group_id: cndg.domain_group_id,
    domain_group_identities: cndg.domain_group_jsdentities,
    note: cndg.note,
    domain_scores: [{ domain_id: 1, score: 4 }],
    completed_tasks: cndg.completed_tasks
  }))

  debugger

  return {
    id: Date.now(),
    meeting_date: case_note.meetingDate,
    attendee: case_note.attendee,
    custom: case_note.custom,
    interaction_type: case_note.interactionType,
    case_note_domain_group: case_note_domain_group,
    assessment_id: case_note.assessment_id,
  }
}
