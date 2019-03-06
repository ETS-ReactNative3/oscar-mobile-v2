import React, { Component } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'

class Loading extends Component {
  render() {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#009999" size="large" />
      </View>
    )
  }
}

export default Loading

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
