import React, { Component }   from 'react'
import { connect }            from 'react-redux'
import { checkConnection }    from '../../redux/actions/internet'
import logo                   from '../../assets/oscar-logo.png'
import { startNgoScreen }     from '../../navigation/config'
import { LANGUAGE_TYPES }     from '../../redux/types'
import configureStore         from '../../redux/store'
import styles                 from './styles'

import {
  View,
  Text,
  Image,
  AsyncStorage,
  TouchableOpacity
}  from 'react-native'

const store = configureStore()

class SplashScreen extends Component {
  componentDidMount() {
    this.props.checkConnection()
    this.setLanguage()
    this.authenticateUser()
  }

  setLanguage = () => {
    AsyncStorage.getItem('language', (err, result) => {
      if(err === null && result !== null) {
        store.dispatch({
          type: LANGUAGE_TYPES.SET_LANGUAGE,
          language: result
        })
      }
    })
  }

  authenticateUser = () => {
    const { hasInternet } = this.props

    // if (user) {
    //   if (hasInternet) {
    //     verifyUser()
    //   } else {
    //     gotoPinScreen()
    //   }
    // } else {
      setTimeout(function() { startNgoScreen() }, 1500);
    // }
  }

  render() {
    return (
      <View style={ styles.container }>
        <Image
          style={ styles.logo }
          source={ logo }
        />
        <TouchableOpacity>
          <Text></Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapState = (state) => ({
  hasInternet: state.internet.hasInternet
})

const mapDispatch = {
  checkConnection
}

export default connect(mapState, mapDispatch)(SplashScreen)
