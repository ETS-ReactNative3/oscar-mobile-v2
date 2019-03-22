import axios from 'axios'
import moment from 'moment'
import endpoint from '../../constants/endpoint'
import { NetInfo } from 'react-native'
import { updateUser } from './users'
import { Navigation } from 'react-native-navigation'
import { updateClient } from './clients'
import { loadingScreen } from '../../navigation/config'

export function deleteTask(task, clientId, onDeleteSuccess, updateStateMessage) {
  return dispatch => {
    const path = `${endpoint.clientsPath}/${clientId}${endpoint.deleteTaskPath}/${task.id}`
    NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      loadingScreen()
      axios
        .delete(path)
        .then(response => {
          dispatch(updateClientTask(task, null, clientId, 'delete'))
          dispatch(updateUserTasks(task, null, clientId, 'delete'))
          onDeleteSuccess && onDeleteSuccess(task)
          Navigation.dismissOverlay('LOADING_SCREEN')
        })
        .catch(handleError => {
          Navigation.dismissOverlay('LOADING_SCREEN')
        })
    } else {
      alert('No internet connection')
    }
  })
  }
}

export function updateTask(params, task, clientId, taskType, onUpdateSuccess) {
  return dispatch => {
    const path = `${endpoint.clientsPath}/${clientId}${endpoint.editTaskPath}/${task.id}`
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        loadingScreen()
        axios
        .put(path, params)
        .then(response => {
          const updatedTask = response.data.task
          dispatch(updateClientTask(updatedTask, taskType, clientId, 'update'))
          dispatch(updateUserTasks(updatedTask, taskType, clientId, 'update'))
          onUpdateSuccess && onUpdateSuccess(updatedTask)
          Navigation.dismissOverlay('LOADING_SCREEN')
          Navigation.dismissAllModals()
        })
        .catch(handleError => {
          Navigation.dismissOverlay('LOADING_SCREEN')
        })
      } else {
        alert('No internet connection')
      }
    })
  }
}

export function createTask(params, clientId, onCreateSuccess, updateStateMessage) {
  loadingScreen()
  return dispatch => {
    const path = `${endpoint.clientsPath}/${clientId}${endpoint.createTaskPath}`
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        axios
          .post(path, params)
          .then(response => {
            const task = response.data.task
            dispatch(updateClientTask(task, null, clientId, 'create'))
            dispatch(updateUserTasks(task, null, clientId, 'create'))
            onCreateSuccess && onCreateSuccess(task)
            Navigation.dismissOverlay('LOADING_SCREEN')
            Navigation.dismissAllModals()
            updateStateMessage('Task has successfully been created.')
          })
          .catch(handleError => {
            Navigation.dismissOverlay('LOADING_SCREEN')
          })
      }
    })
  }
}

export function updateClientTask(task, oldTaskType, clientId, action) {
  return (dispatch, getState) => {
    const clients = getState().clients.data
    const taskType = getTaskType(task)
    const client = clients[clientId]
    let tasks = { ...client.tasks }
    if (action === 'update')
      if (taskType == oldTaskType) {
        tasks[taskType] = tasks[taskType].map(t => (t.id === task.id ? task : t))
      }
      else {
        tasks[oldTaskType] = tasks[oldTaskType].filter(t => t.id !== task.id)
        tasks[taskType] = tasks[taskType].concat(task)
      }

    if (action === 'delete') tasks[taskType] = tasks[taskType].filter(t => t.id !== task.id)

    if (action === 'create') tasks[taskType] = tasks[taskType].concat(task)

    dispatch(updateClient({ ...client, tasks }))
  }
}

export function updateUserTasks(task, oldTaskType, clientId, action) {
  return (dispatch, getState) => {
    const users = getState().users.data
    const auth = getState().auth.data
    const taskType = getTaskType(task)
    const user = users[auth.id]

    const clients = user.clients.map(client => {
      let tasks = {
        overdue: client.overdue,
        today: client.today,
        upcoming: client.upcoming
      }

      if (client.id === clientId) {
        if (action === 'update')
          if (taskType == oldTaskType) tasks[taskType] = tasks[taskType].map(t => (t.id === task.id ? task : t))
          else {
            tasks[oldTaskType] = tasks[oldTaskType].filter(t => t.id !== task.id)
            tasks[taskType] = tasks[taskType].concat(task)
          }

        if (action === 'delete') tasks[taskType] = tasks[taskType].filter(t => t.id !== task.id)

        if (action === 'create') tasks[taskType] = tasks[taskType].concat(task)

        return { ...client, ...tasks }
      }
      return client
    })

    dispatch(updateUser({ ...user, clients }))
  }
}

handleError = error => console.log(error)

getTaskType = task => {
  const isUpcoming = moment(task.completion_date).isAfter(Date.now(), 'day')
  const isToday = moment(task.completion_date).isSame(Date.now(), 'day')

  return isUpcoming ? 'upcoming' : isToday ? 'today' : 'overdue'
}
