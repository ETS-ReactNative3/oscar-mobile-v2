import React, { Component }           from 'react'
import { connect }                    from 'react-redux'
import { View, Image, AsyncStorage }  from 'react-native'
import logo                           from '../../assets/oscar-logo.png'
import { checkConnection }            from '../../redux/actions/internet'
import { startNgoScreen }             from '../../navigation/config'
import { LANGUAGE_TYPES }             from '../../redux/types'
import styles                         from './styles'
import Database                       from '../../config/Database'

class SplashScreen extends Component {
  componentDidMount() {
    this.props.checkConnection()
    this.setLanguage()
    this.authenticateUser()
  }

  setLanguage = () => {
    const languageSetting = Database.objects('Setting').filtered('key = $0', 'language')[0]
    if (languageSetting.value !== null) {
      this.props.setLanguage(languageSetting.value)
    }
  }

  authenticateUser = () => {
    setTimeout(() => startNgoScreen(), 1500);
  }

  render() {
    return (
      <View style={ styles.container }>
        <Image
          style={ styles.logo }
          source={ logo }
        />
      </View>
    )
  }
}

const mapState = (state) => ({
  hasInternet: state.internet.hasInternet
})

const mapDispatch = (dispatch) => ({
  checkConnection: () => dispatch(checkConnection()),
  setLanguage: (language) => dispatch({
    type: LANGUAGE_TYPES.SET_LANGUAGE,
    language
  })
})

export default connect(mapState, mapDispatch)(SplashScreen)
