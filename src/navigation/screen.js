import { Navigation } from 'react-native-navigation'
import { Provider }   from 'react-redux'
import configureStore from '../redux/store'

import SplashScreen   from '../screens/SplashScreen'
import Ngos           from '../screens/Ngos'
import Login          from '../screens/Login'

const store = configureStore()

export default () => {
  Navigation.registerComponentWithRedux('oscar.splashScreen', () => SplashScreen, Provider, store)
  Navigation.registerComponentWithRedux('oscar.ngos',         () => Ngos,         Provider, store)
  Navigation.registerComponentWithRedux('oscar.login',        () => Login,        Provider, store)
}
