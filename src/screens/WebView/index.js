import React, { Component } from 'react'
import { connect }          from 'react-redux'
import { WebView }          from 'react-native'

class WebViewScreen extends Component {
  render () {
    const { ngo } = this.props
    const url = `https://${ngo}.oscarhq.com/users/sign_in`

    return (
      <WebView
        style={{ flex: 1 }}
        source={{ uri: url }}
        startInLoadingState
        scalesPageToFit
      />
    )
  }
}

const mapState = (state) => ({
  ngo: state.ngo.name
})

export default connect(mapState)(WebViewScreen);
