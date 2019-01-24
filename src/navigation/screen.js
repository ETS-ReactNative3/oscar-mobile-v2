import { Navigation } from 'react-native-navigation'
import { Provider }   from 'react-redux'
import configureStore from '../redux/store'

import SplashScreen   from '../screens/SplashScreen'
import WebView        from '../screens/WebView'

const store = configureStore()

export default () => {
  Navigation.registerComponentWithRedux('oscar.splashScreen', () => SplashScreen, Provider, store)
  Navigation.registerComponentWithRedux('oscar.WebView',      () => WebView, Provider, store)
}