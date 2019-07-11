import { applyMiddleware, createStore, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'
import { autoRehydrate, persistStore } from 'redux-persist'
import { seamlessImmutableReconciler, seamlessImmutableTransformCreator } from 'redux-persist-seamless-immutable'
import FilesystemStorage from 'redux-persist-filesystem-storage'
const store = createStore(
  rootReducer,
  {},
  compose(
    autoRehydrate(),
    applyMiddleware(thunkMiddleware)
  )
)
persistStore(store, {
  storage: FilesystemStorage,
  stateReconciler: seamlessImmutableReconciler,
  transforms: [seamlessImmutableTransformCreator({})],
  blacklist: ['network']
})

export default function configureStore() {
  return store
}
