import React, { Component }                 from 'react'
import { connect }                          from 'react-redux'
import RNExitApp                            from 'react-native-exit-app'
import KeyboardManager                      from 'react-native-keyboard-manager'
import CryptoJS                             from 'crypto-js'
import styles                               from './styles'
import logo                                 from '../../assets/oscar-logo.png'
import Database                             from '../../config/Database'
import i18n                                 from '../../i18n'
import { LANGUAGE_TYPES }                   from '../../redux/types'
import { startNgoScreen, startScreen }      from '../../navigation/config'
import { setDefaultHeader, verifyUser }     from '../../redux/actions/auth'
import {
  View,
  Alert,
  Image,
  NetInfo,
  Platform,
  SafeAreaView,
  ActivityIndicator
} from 'react-native'

class SplashScreen extends Component {
  state = {
    offline: false
  }

  static options() {
    return {
      statusBar: {
        style: Platform.OS === 'ios' ? 'dark' : 'light'
      }
    }
  }

  constructor(props) {
    super(props)
    if (Platform.OS == 'ios')
      KeyboardManager.setEnableAutoToolbar(false)
  }

  componentDidMount() {
    this.setLanguage()
    setTimeout(() => this.authenticateUser(), 1000)
  }

  setLanguage = () => {
    const languageSetting = Database.objects('Setting').filtered('key = $0', 'language')[0]
    if (languageSetting.value !== null) {
      this.props.setLanguage(languageSetting.value)
    }
  }

  authenticateUser = async () => {
    const { user, verifyUser } = this.props
    const online = await this.getInternetConnection()

    if (online)
      if (user)
        verifyUser(this.goToPinScreen)
      else
        startNgoScreen()
    else
      if (user) {
        const pinCode = CryptoJS.SHA3(user.pin_code)
        this.goToPinScreen(pinCode)
      } else {
        this.setState({ offline: true })
        this.alertNoInternet()
      }
  }

  alertNoInternet = () => {
    Alert.alert(
      i18n.t('warning'), i18n.t('no_internet_connection'),
      [{
        text: i18n.t('language.yes'), onPress: () => RNExitApp.exitApp()
      }, {
        text: i18n.t('language.no'), onPress: () => setTimeout(() => this.authenticateUser(), 2000)
      }]
    )
  }

  getInternetConnection = async () => {
    const isConnected = await NetInfo.isConnected.fetch()
    return isConnected
  }

  goToPinScreen = pinCode => {
    startScreen('oscar.pin', {
      pinTitle: pinCode ? i18n.t('auth.enter_pin') : i18n.t('auth.set_pin'),
      pinMode: pinCode ? 'compare' : 'set',
      pinCode: pinCode
    })
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <Image style={styles.logo} source={logo} />
          {
            this.state.offline && 
            <ActivityIndicator style={{ marginTop: 20 }}/>
          }
        </View>
      </SafeAreaView>
    )
  }
}

const mapState = state => ({
  user: state.auth.data,
})

const mapDispatch = dispatch => ({
  setLanguage: language =>
    dispatch({
      type: LANGUAGE_TYPES.SET_LANGUAGE,
      language
    }),
  verifyUser: action => dispatch(verifyUser(action)),
  setDefaultHeader: () => dispatch(setDefaultHeader())
})

export default connect(
  mapState,
  mapDispatch
)(SplashScreen)
