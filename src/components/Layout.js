import React, { Component }                 from 'react'
import { connect }                          from 'react-redux'
import _                                    from 'lodash'
import axios                                from 'axios'
import BackgroundTimer                      from 'react-native-background-timer'
import InternetStatusBar                    from './InternetStatusBar'
import { handleEntityAdditonalForm }        from '../redux/actions/customForms'
import { updateConnection }                 from '../redux/actions/internet'
import { customFieldPropertyDeleted }       from '../redux/actions/offline/customFieldProperties'
import { AppState, SafeAreaView, NetInfo }  from 'react-native'
class Layout extends Component {
  state = { appState: AppState.currentState, isUploadOffline: false }

  componentDidMount() {
    this.checkInternetConnection()
    AppState.addEventListener('change', this.handleAppStateChange)
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange)
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange)
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange)
  }

  handleAppStateChange = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      if (!this.state.isUploadOffline) {
        setTimeout(() => {
          if (!this.state.isUploadOffline) this.checkInternetConnection();
        }, 500)
      }
    }

    if (nextAppState === 'background' || nextAppState === 'inactive') {
      BackgroundTimer.runBackgroundTimer(() => {
        this.checkInternetConnection()
      }, 30000)
    }

    this.setState({ appState: nextAppState })
  }


  handleConnectionChange = (isConnected) => {
    this.props.updateConnection(isConnected)
  }

  checkInternetConnection = async () => {
    NetInfo.isConnected.fetch().then(isConnected => {
      this.props.updateConnection(isConnected)
      if (isConnected && !this.state.isUploadOffline) this.handleUploadOfflineData()
    })
  }

  handleUploadOfflineData = () => {
    const { queueCustomFieldProperties, handleEntityAdditonalForm, customFieldPropertyDeleted } = this.props
    this.setState({ isUploadOffline: true })
    _.forEach(queueCustomFieldProperties, queueCustomFieldProperty => {
      if (queueCustomFieldProperty.action == 'delete') {
        axios
          .delete(queueCustomFieldProperty.endPoint)
            .then(response => {
              customFieldPropertyDeleted(queueCustomFieldProperty)
            }).catch(error => {
              console.log(error)
            })
      } else {
        handleEntityAdditonalForm(queueCustomFieldProperty.action, queueCustomFieldProperty.properties, queueCustomFieldProperty.additionalForm, queueCustomFieldProperty.endPoint)
          .then(response => {
            customFieldPropertyDeleted(queueCustomFieldProperty)
          }).catch(error => {
            console.log(error)
          })
      }
    })
    this.setState({ isUploadOffline: false })
    BackgroundTimer.stopBackgroundTimer()
  }

  render() {
    const { children, isConnected } = this.props
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <InternetStatusBar isConnected={isConnected} />
        {children}
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => ({
  isConnected: state.internet.hasInternet,
  queueCustomFieldProperties: state.queueCustomFieldProperties.data
})

const mapDispatch = {
  handleEntityAdditonalForm,
  customFieldPropertyDeleted,
  updateConnection
}

export default connect(
  mapStateToProps,
  mapDispatch
)(Layout)
