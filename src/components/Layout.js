import React, { Component }             from 'react'
import { AppState, SafeAreaView, Modal, View, ActivityIndicator, Text }  from 'react-native'
import BackgroundTimer                  from 'react-native-background-timer'
import NetInfo                          from "@react-native-community/netinfo"
import { connect }                      from 'react-redux'
import { forEach, size }                from 'lodash'
import axios                            from 'axios'
import InternetStatusBar                from './InternetStatusBar'
import { loadingScreen }                from '../navigation/config'
import { MAIN_COLOR }                   from '../constants/colors'
import { handleEntityAdditonalForm }    from '../redux/actions/customForms'
import { updateConnection }             from '../redux/actions/internet'
import { updateClientProperty }         from '../redux/actions/clients'
import { removeClientQueue }            from '../redux/actions/offline/clients'
import { customFieldPropertyDeleted }   from '../redux/actions/offline/customFieldProperties'

class Layout extends Component {
  state = {
    syncing: false,
    appState: AppState.currentState,
    isConnected: this.props.isConnected,
    queueCount: this.props.clientQueue.count,
  }

  componentDidMount() {
    this.handleSyncData()
    this.subscribeAppState()
    this.subscribeConnection()
  }

  componentWillUnmount() {
    this.unsubscribeAppState()
    this.unsubscribeConnection()
  }

  componentWillReceiveProps(_, nextState) {
    if (nextState.queueCount === 0)
      BackgroundTimer.stopBackgroundTimer()
  }

  subscribeConnection = () => {
    this.unsubscribeConnection = NetInfo.addEventListener(state => {
      this.props.updateConnection(state.isConnected)
      this.setState({ isConnected: state.isConnected })

      if (!state.isConnected && this.state.syncing)
        this.setState({ syncing: false })
    })
  }

  subscribeAppState = () => {
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  unsubscribeAppState = () => {
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  handleAppStateChange = nextAppState => {
    const { appState }  = this.state
    const goActive      = appState.match(/inactive|background/) && nextAppState === 'active'
    const runBackground = nextAppState.match(/inactive|background/)

    if (goActive) {
      BackgroundTimer.stopBackgroundTimer()
      this.handleSyncData()
    }
    else if (runBackground)
      this.runEveryFiveMinutes(this.handleSyncData)

    this.setState({ appState: nextAppState })
  }

  runEveryFiveMinutes = action => {
    BackgroundTimer.runBackgroundTimer(() => action(), 300000)
  }

  handleSyncData = async () => {
    const { queueCount, isConnected, syncing } = this.state

    if (syncing || !isConnected || queueCount === 0)
      return

    this.setState({ syncing: true })
    await this.syncClient()
    this.setState({ syncing: false })
  }

  // handleUploadOfflineData = () => {
  //   const { queueCustomFieldProperties, handleEntityAdditonalForm, customFieldPropertyDeleted } = this.props
  //   this.setState({ isUploadOffline: true })
  //   forEach(queueCustomFieldProperties, queueCustomFieldProperty => {
  //     if (queueCustomFieldProperty.action == 'delete') {
  //       axios
  //         .delete(queueCustomFieldProperty.endPoint)
  //           .then(response => {
  //             customFieldPropertyDeleted(queueCustomFieldProperty)
  //           }).catch(error => {
  //             console.log(error)
  //           })
  //     } else {
  //       handleEntityAdditonalForm(queueCustomFieldProperty.action, queueCustomFieldProperty.properties, queueCustomFieldProperty.additionalForm, queueCustomFieldProperty.endPoint)
  //         .then(response => {
  //           customFieldPropertyDeleted(queueCustomFieldProperty)
  //         }).catch(error => {
  //           console.log(error)
  //         })
  //     }
  //   })
  //   this.setState({ isUploadOffline: false })
  //   BackgroundTimer.stopBackgroundTimer()
  // }

  syncClient = () => {
    const { clientQueue, updateClientProperty, removeClientQueue } = this.props

    forEach(clientQueue, async client => {
      updateClientProperty(
        client,
        () => {
          this.setState(prevState => ({ queueCount: prevState.queueCount - 1 }))
          removeClientQueue(client)
        }
      )
    })
  }

  render() {
    const { children, isConnected } = this.props

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <InternetStatusBar isConnected={isConnected} />
        {children}

        <Modal
          transparent={true}
          visible={this.state.syncing}
          onRequestClose={ () => {} }
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)', justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={MAIN_COLOR} />
            <Text style={{ fontSize: 15, marginTop: 10 }}>Syncing data to server</Text>
          </View>
        </Modal>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => ({
  isConnected: state.internet.hasInternet,
  queueCustomFieldProperties: state.queueCustomFieldProperties.data,
  clientQueue: state.clientQueue.data
})

const mapDispatch = {
  handleEntityAdditonalForm,
  customFieldPropertyDeleted,
  updateConnection,
  updateClientProperty,
  removeClientQueue
}

export default connect(
  mapStateToProps,
  mapDispatch
)(Layout)
