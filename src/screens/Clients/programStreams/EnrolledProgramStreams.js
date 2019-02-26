import React, { Component } from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableWithoutFeedback } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Divider } from 'react-native-elements'
import { programStreamStyles } from '../../../styles'
import { pushScreen } from '../../../navigation/config.js'
import { connect } from 'react-redux'
import _ from 'lodash'
import appIcon from '../../../utils/Icon'

class ProgramStreams extends Component {
  _viewEnrollmentReport(programStream) {
    pushScreen(this.props.componentId, {
      screen: 'oscar.programStreamDetail',
      title: programStream.name,
      props: {
        programStreamId: programStream.id,
        clientId: this.props.client.id,
        clickForm: 'EnrolledProgram',
        clientDetailComponentId: this.props.clientDetailComponentId
      }
    })
  }

  async _renderExitForm(programStream) {
    const icons = await appIcon()
    pushScreen(this.props.componentId, {
      screen: 'oscar.exitForm',
      title: 'Exit Form',
      props: {
        programStream: programStream,
        client: this.props.client,
        programStreams: this.props.programStreams,
        clientDetailComponentId: this.props.clientDetailComponentId
      },
      rightButtons: [
        {
          id: 'SAVE_EXIT_FORM',
          icon: icons.save,
          color: '#fff'
        }
      ]
    })
  }

  _renderTrackingForm(programStream) {
    if (!programStream.tracking_required) {
      pushScreen(this.props.componentId, {
        screen: 'oscar.listTracking',
        title: programStream.name,
        props: {
          programStreamId: programStream.id,
          clientId: this.props.client.id,
          clickForm: 'EnrolledProgram'
        }
      })
    }
  }

  render() {
    const { programStreams } = this.props
    return (
      <ScrollView style={programStreamStyles.mainContainer}>
        {_.map(programStreams, programStream => {
          const activeEnrollments = _.filter(programStream.enrollments, enrollment => {
            return enrollment.status == 'Active'
          })
          return _.map(activeEnrollments, (enrollment, index) => {
            return (
              <View key={index} style={programStreamStyles.container}>
                <View style={programStreamStyles.leftSide}>
                  <View style={programStreamStyles.leftSideWrapper}>
                    <View style={programStreamStyles.statusWrapper}>
                      <Text style={programStreamStyles.statusTitle}>{enrollment.status}</Text>
                    </View>
                    <Text style={programStreamStyles.programStreamTitle}>{programStream.name}</Text>

                    <Divider style={programStreamStyles.titleDivider} />

                    <View style={programStreamStyles.quantityWrapper}>
                      <Text style={programStreamStyles.quantityKey}>Number of Place Available:</Text>
                      <Text style={programStreamStyles.quantityValue}>{programStreamStyles.quantity}</Text>
                    </View>

                    <View style={programStreamStyles.domainWrapper}>
                      <Text style={programStreamStyles.domainKey}>Domain:</Text>
                      <View style={programStreamStyles.domainValue}>
                        {_.map(programStream.domain, (domain, dIndex) => {
                          return (
                            <View key={dIndex} style={programStreamStyles.domainValueButtonWrapper}>
                              <Text style={programStreamStyles.domainValueButton}>{domain}</Text>
                            </View>
                          )
                        })}
                      </View>
                    </View>
                  </View>
                </View>

                <View style={programStreamStyles.rightSide}>
                  <TouchableWithoutFeedback onPress={() => this._viewEnrollmentReport(programStream)}>
                    <View style={programStreamStyles.buttonWrapper}>
                      <Text style={programStreamStyles.buttonTitle}>VIEW</Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={() => this._renderTrackingForm(programStream)}>
                    <View
                      style={
                        programStream.tracking_required ? programStreamStyles.buttonWrapperNotTracking : programStreamStyles.buttonWrapperTracking
                      }
                    >
                      <Text style={programStream.tracking_required ? programStreamStyles.buttonTitleTracking : programStreamStyles.buttonTitle}>
                        TRACKING
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={() => this._renderExitForm(programStream)}>
                    <View
                      style={
                        programStream.is_offline != undefined
                          ? [programStreamStyles.buttonWrapperNotTracking, { borderTopWidth: 1, borderTopColor: '#fff' }]
                          : programStreamStyles.buttonWrapper
                      }
                    >
                      <Text
                        style={
                          programStreamStyles.is_offline != undefined ? programStreamStyles.buttonTitleTracking : programStreamStyles.buttonTitle
                        }
                      >
                        EXIT
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            )
          })
        })}
      </ScrollView>
    )
  }
}

const mapState = (state, ownProps) => {
  const client = state.clients.data[ownProps.clientId]
  const programStreams = client.program_streams
  return { client, programStreams }
}

export default connect(mapState)(ProgramStreams)
