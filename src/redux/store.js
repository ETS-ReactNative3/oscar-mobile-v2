import { applyMiddleware, createStore, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import logger          from 'redux-logger'
import rootReducer     from './reducers'


export default () => {
  const middlewares = applyMiddleware(logger, thunkMiddleware)
  const enhancer    = compose(middlewares)
  const store       = createStore(rootReducer, enhancer)

  return store
}