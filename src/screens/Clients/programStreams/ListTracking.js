import React, { Component } from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableWithoutFeedback, Alert } from 'react-native'
import { listTracking } from '../../../styles'
import _ from 'lodash'
import { pushScreen } from '../../../navigation/config'
import appIcon from '../../../utils/Icon'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import DropdownAlert from 'react-native-dropdownalert'
class ListTracking extends Component {
  async renderCreateTackingForm(tracking, programStream) {
    const icons = await appIcon()
    pushScreen(this.props.componentId, {
      screen: 'oscar.trackingForm',
      title: tracking.name,
      props: {
        tracking: tracking,
        programStream: programStream,
        client: this.props.client,
        listTrackingComponentId: this.props.componentId,
        action: 'create',
        alertMessage: this.alertMessage
      },
      rightButtons: [
        {
          id: 'SAVE_TRACKING',
          icon: icons.save,
          color: '#fff'
        }
      ]
    })
  }

  async _renderTrackingReport(tracking) {
    const { programStream } = this.props
    const icons = await appIcon()
    let trackingsEnrolled = _.filter(programStream.enrollments, enrollment => {
      return enrollment.trackings.length > 0
    })
    let filterTrackings = []
    let otherTrackings = []

    if (trackingsEnrolled.length > 0) {
      filterTrackings = _.filter(trackingsEnrolled[0].trackings, { tracking_id: tracking.id })
      otherTrackings = _.filter(trackingsEnrolled[0].trackings, track => {
        return track.tracking_id != tracking.id
      })
      trackingsEnrolled[0].trackings = filterTrackings
    }

    if (filterTrackings.length > 0) {
      pushScreen(this.props.componentId, {
        screen: 'oscar.trackingDetail',
        title: `${tracking.name} - ${programStream.name}`,
        props: {
          enrollmentId: trackingsEnrolled[0].id,
          tracking: tracking,
          otherTrackings: otherTrackings,
          clientId: this.props.client.id,
          programStreamId: programStream.id,
          clickForm: this.props.clickForm
        },
        rightButtons: [
          {
            id: 'ADD_TRACKING',
            icon: icons.add,
            color: '#fff'
          }
        ]
      })
    } else {
      this.refs.dropdown.alertWithType('info', 'Info', 'No tracking report')
    }
  }

  alertMessage = () => {
    this.refs.dropdown.alertWithType('success', 'Success', 'Tracking has been successfully created.')
  }

  render() {
    const { programStream } = this.props
    return (
      <View style={listTracking.container}>
        <View style={listTracking.tableWrapper}>
          <View style={[listTracking.tableRow, listTracking.tableHeader]}>
            <View style={listTracking.headerColumn}>
              <Text style={listTracking.headerLabel}>Name</Text>
            </View>
            <View style={listTracking.headerColumn}>
              <Text style={listTracking.headerLabel}>Frequency</Text>
            </View>
            <View style={listTracking.headerColumn}>
              <Text style={listTracking.headerLabel}>Report</Text>
            </View>
            <View style={listTracking.headerColumn}>
              <Text style={listTracking.headerLabel}>Action</Text>
            </View>
          </View>
          <ScrollView>
            {programStream.tracking_fields.map((tracking, index) => {
              return (
                <View key={index} style={[listTracking.tableDetailRow, listTracking.tableRow]}>
                  <View style={listTracking.column}>
                    <Text style={listTracking.detailLabel}>{tracking.name}</Text>
                  </View>
                  <View style={listTracking.column}>
                    <Text style={listTracking.detailLabel}>{tracking.frequency}</Text>
                  </View>
                  <TouchableWithoutFeedback onPress={() => this._renderTrackingReport(tracking)}>
                    <View style={listTracking.column}>
                      <Icon name="ios-eye" size={25} style={[listTracking.detailLabel, { color: '#009999' }]} />
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={() => this.renderCreateTackingForm(tracking, programStream)}>
                    <View style={listTracking.column}>
                      <Icon name="md-add-circle" size={25} style={[listTracking.detailLabel, { color: '#009999' }]} />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              )
            })}
          </ScrollView>
        </View>
        <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
      </View>
    )
  }
}

const mapState = (state, ownProps) => {
  const client = state.clients.data[ownProps.clientId]
  const programStream = _.find(client.program_streams, { id: ownProps.programStreamId })
  return { client, programStream }
}

export default connect(mapState)(ListTracking)
