import React, { Component }   from 'react'
import { connect }            from 'react-redux'
import { checkConnection }    from '../../redux/actions/internet'
import logo                   from '../../assets/oscar-logo.png'
import { startNgoScreen }     from '../../navigation/config'
import styles                 from './styles'

import {
  View,
  Text,
  Image,
  AsyncStorage
}  from 'react-native'

class SplashScreen extends Component {
  componentDidMount() {
    this.props.checkConnection()
    this.authenticateUser()
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
