import { Navigation } from 'react-native-navigation'
import { Provider }   from 'react-redux'
import configureStore from '../redux/store'

import SplashScreen   from '../screens/SplashScreen'
import Ngos           from '../screens/Ngos'
import Login          from '../screens/Login'
import Pin            from '../screens/Pin'
import WebView        from '../screens/WebView'

const store = configureStore()

export default () => {
  Navigation.registerComponentWithRedux('oscar.splashScreen', () => SplashScreen, Provider, store)
  Navigation.registerComponentWithRedux('oscar.ngos',         () => Ngos,         Provider, store)
  Navigation.registerComponentWithRedux('oscar.login',        () => Login,        Provider, store)
  Navigation.registerComponentWithRedux('oscar.pin',          () => Pin,          Provider, store)
  Navigation.registerComponentWithRedux('oscar.WebView',      () => WebView,      Provider, store)
}
