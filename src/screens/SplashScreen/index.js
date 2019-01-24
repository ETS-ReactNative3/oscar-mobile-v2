import React, { Component }   from 'react'
import { View, Text, Image, AsyncStorage, TouchableOpacity }  from 'react-native'
import { connect }            from 'react-redux'
import { checkConnection }    from '../../redux/actions/internet'
import logo                   from '../../assets/oscar-logo.png'
import styles                 from './styles'
import { LANGUAGE_TYPES }     from '../../redux/types'
import configureStore         from '../../redux/store'

import { Navigation }         from 'react-native-navigation'

const store = configureStore()

class SplashScreen extends Component {
  componentDidMount() {
    this.props.checkConnection()
    this.setLanguage()
    setTimeout(function() {
      Navigation.setRoot({
        root: {
          stack: {
            children: [{
              component: {
                name: 'oscar.language',
                options: {
                  topBar: {
                    title: {
                      text: 'Language',
                      color: '#fff'
                    },
                    background: { color: "#009999" }
                  }
                }
              }
            }]
          }
        }
      })
    }, 2000)
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