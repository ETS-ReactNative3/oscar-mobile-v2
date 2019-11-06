import { AsyncStorage }       from 'react-native'
import I18n                   from 'i18n-js'
import en                     from './en'
import km                     from './km'
import my                     from './my'

I18n.defaultLocale  = "en"
I18n.translations   = { km, en, my }

AsyncStorage.getItem('Language', async (error, language) => {
  I18n.locale = language

  if (!language) {
    await AsyncStorage.setItem('Language', 'en')
    I18n.locale = "en"
  }
})

export default I18n