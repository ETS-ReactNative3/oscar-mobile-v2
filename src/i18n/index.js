import I18n     from 'react-native-i18n'
import en       from './en'
import km       from './km'
import my       from './my'
import Database from '../config/Database'

I18n.defaultLocale  = "en"
I18n.translations   = { km, en, my }

const langSetting   = Database.objects('Setting').filtered('key = $0', 'language')[0]

if (langSetting === undefined) {
  Database.write(() => {
    Database.create('Setting', { key: 'language', value: 'en' })
  })
  I18n.locale = "en"
} else {
  I18n.locale = langSetting.value
}

export default I18n