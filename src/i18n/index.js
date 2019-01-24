import I18n           from 'react-native-i18n'
import en             from './en'
import km             from './km'
import my             from './my'
import configureStore from '../redux/store'

const store         = configureStore()
const language      = store.getState().language.language

I18n.defaultLocale  = "en"
I18n.translations   = { km, en, my }
I18n.locale         = language

export default I18n