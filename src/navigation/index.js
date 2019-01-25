import { Navigation }  from 'react-native-navigation'
import registerScreens from './screen'
import { startScreen, setDefaultOptions } from './config'

Navigation.events().registerAppLaunchedListener(() => {
  setDefaultOptions()
  registerScreens()
  startScreen('oscar.splashScreen')
})
