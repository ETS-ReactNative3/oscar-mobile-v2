import { Navigation }  from 'react-native-navigation'
import { startScreen, setDefaultOptions } from './config'
import registerScreens from './screen'

Navigation.events().registerAppLaunchedListener(() => {
  setDefaultOptions()
  registerScreens()
  startScreen('oscar.splashScreen')
})
