import { combineReducers }      from 'redux'
import auth                     from './auth'
import internet                 from './internet'
import language                 from './language'
import ngo                      from './ngo'

export default combineReducers({
  auth,
  internet,
  ngo,
  language
})