import Immutable from 'seamless-immutable'
import { QUEUE_ASSESSMENT_TYPES } from '../../types'

const initialState = Immutable({
  data: {},
})

export default (state = initialState, action) => {
  switch (action.type) {
    case QUEUE_ASSESSMENT_TYPES.UPDATE_QUEUE_ASSESSMENT:

      return state
              .updateIn(['data', action.assessmentDomains.id], (prevData) => {
                let { data } = action.assessmentDomains
                let method = data.method

                if(prevData !== undefined && prevData.method == "create" && method == "update")
                  method = "create"
                
                return {
                  params: data.params,
                  client: data.client,
                  method
                }
              })

    case QUEUE_ASSESSMENT_TYPES.CREATE_QUEUE_ASSESSMENT:
      return state.setIn(['data', action.assessmentDomains.id], action.assessmentDomains.data)

    case QUEUE_ASSESSMENT_TYPES.REMOVE_QUEUE_ASSESSMENT:
      return state.set('data', state.data.without(action.assessmentDomains.id))

    default:
      return state
  }
}