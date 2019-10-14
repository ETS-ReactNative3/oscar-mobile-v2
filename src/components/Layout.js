import React, { Component }                 from 'react'
import axios                                from 'axios'
import _                                    from 'lodash'
import { connect }                          from 'react-redux'
import { 
  View,
  Text,
  Modal,
  NetInfo,
  AppState,
  SafeAreaView,
  ActivityIndicator }                       from 'react-native'
import BackgroundTimer                      from 'react-native-background-timer'
import { Navigation }                                   from 'react-native-navigation'
import InternetStatusBar                    from './InternetStatusBar'
import { syncUpdateClientProperty }             from '../redux/actions/clients'
import { updateConnection }                 from '../redux/actions/internet'
import { handleEntityAdditonalForm }        from '../redux/actions/customForms'
import { removeClientQueue }                from '../redux/actions/offline/clients'
import { customFieldPropertyDeleted }       from '../redux/actions/offline/customFieldProperties'

import { syncUpdateAssessment, syncCreateAssessment }                 from '../redux/actions/assessments'
import { removeAssessmentQueue }                                  from '../redux/actions/offline/assessment'

class Layout extends Component {
  state = {
    appState: AppState.currentState,
    isConnected: this.props.isConnected,
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      this.handleConnectionChange(isConnected)
    })

    this.subscribeAppState()
    this.subscribeConnection()
  }

  componentWillUnmount() {
    this.unsubscribeAppState()
    this.unsubscribeConnection()
  }

  handleSyncData = () => {
    this.syncAssessment()
    this.syncClient()
  }

  syncAssessment = () => {
    const {
      isConnected,
      assessmentQueue, 
      syncUpdateAssessment,
      syncCreateAssessment,
      removeAssessmentQueue 
    }                           = this.props;

    const assessmentQueueCount  = _.size(assessmentQueue)

    if (!isConnected || assessmentQueueCount === 0)
      return;

    console.log("Syncing Asssessment", assessmentQueue);
    _.each(assessmentQueue, async (assessment, assessmentId) => {
      const {params, client, method} = assessment

      if(method == 'create') 
        syncCreateAssessment(params, client)
      else if(method == 'update')
        syncUpdateAssessment(params, assessmentId, client)
      
      removeAssessmentQueue(params, assessmentId, client)
    })
    console.log("Asssessment Sync Success");
  }

  syncClient = () => {
    const { 
      isConnected,
      clientQueue, 
      removeClientQueue, 
      syncUpdateClientProperty 
    }                       = this.props
    const clientQueueCount  = _.size(this.props.clientQueue)
    
    if (!isConnected || clientQueueCount === 0)
      return;

    _.each(clientQueue, async client => {
      syncUpdateClientProperty(client)
      removeClientQueue(client)
    })
    console.log("Client Sync Success");
  }

  subscribeAppState = () => {
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  subscribeConnection = () => {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange)
  }

  unsubscribeConnection = () => {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange)
  }

  handleConnectionChange = isConnected => {
    console.log(isConnected ? "online" : "offline")
    this.props.updateConnection(isConnected)

    if (isConnected) 
      this.handleSyncData()
  }


  unsubscribeAppState = () => {
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  handleAppStateChange = nextAppState => {
    const { appState }  = this.state
    const runForeground = appState.match(/inactive|background/) && nextAppState === 'active'

    if (runForeground)
      BackgroundTimer.stopBackgroundTimer();
    else
      this.runEveryTenSeconds()

    this.setState({ appState: nextAppState })
  }

  runEveryTenSeconds = () => {
    BackgroundTimer.runBackgroundTimer( async () => {
      try {
        await axios.get('https://www.google.com/')
        if(!this.props.isConnected)
            this.handleConnectionChange(true)
      } catch (e) {
        if(this.props.isConnected)
          this.handleConnectionChange(false)
      }
    }, 1000 * 10)
  }

  render() {
    const { children, isConnected } = this.props
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <InternetStatusBar isConnected={isConnected} />
        {children}

        {/* <Modal
          transparent={true}
          visible={this.state.syncing}
          onRequestClose={ () => {} }
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)', justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{ fontSize: 15, marginTop: 10 }}>Syncing data to server</Text>
          </View>
        </Modal> */}
      </SafeAreaView>
    )
  }
}

const mapStateToProps = state => ({
  isConnected: state.internet.hasInternet,
  queueCustomFieldProperties: state.queueCustomFieldProperties.data,
  clientQueue: state.clientQueue.data,
  assessmentQueue: state.assessmentQueue.data
})

const mapDispatch = {
  updateConnection,
  handleEntityAdditonalForm,
  customFieldPropertyDeleted,

  removeClientQueue,
  syncUpdateClientProperty,

  syncUpdateAssessment,
  syncCreateAssessment,
  removeAssessmentQueue,
}

export default connect(
  mapStateToProps,
  mapDispatch
)(Layout)
