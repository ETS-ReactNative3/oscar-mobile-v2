import { Navigation }  from 'react-native-navigation'
import { startScreen } from './config'
import registerScreens from './screen'

Navigation.events().registerAppLaunchedListener(() => {
  registerScreens()
  startScreen('oscar.splashScreen')
})