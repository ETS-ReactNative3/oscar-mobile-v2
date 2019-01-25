import { combineReducers }      from 'redux'
import auth                     from './auth'
import internet                 from './internet'
import language                 from './language'
import ngo                      from './ngo'
import users                    from './users'
import domains                  from './domains'

export default combineReducers({
  auth,
  internet,
  ngo,
  language,
  users,
  domains
})