import React, { Component }   from 'react'
import { View, Text, Image }  from 'react-native'
import { connect }            from 'react-redux'
import { checkConnection }    from '../../redux/actions/internet'
import logo                   from '../../assets/oscar-logo.png'
import styles                 from './styles'

class SplashScreen extends Component {
  componentDidMount() {
    this.props.checkConnection()
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