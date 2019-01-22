import { combineReducers }      from 'redux'
import auth                     from './auth'
import internet                 from './internet'
import ngo                      from './ngo'

export default combineReducers({
  auth,
  internet,
  ngo
})