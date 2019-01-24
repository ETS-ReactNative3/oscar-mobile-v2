import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'
import { Navigation } from 'react-native-navigation'
import { pushScreen } from '../../navigation/config'

export default class Users extends Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'TRANSLATION') {
      pushScreen(this.props.componentId, {
        screen: 'oscar.language',
        title: 'TRANSLATED CONTENTS'
      })
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>I'm the Users component</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
