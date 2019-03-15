import React, { Component } from 'react'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Navigation } from 'react-native-navigation'
import DropdownAlert from 'react-native-dropdownalert'
import { Text, View, FlatList, TouchableOpacity, Alert } from 'react-native'
import moment from 'moment'
import appIcons from '../../utils/Icon'
import { pushScreen } from '../../navigation/config'
import i18n from '../../i18n'
import styles from './styles'

class CaseNotes extends Component {
  state = {
    client: this.props.client,
  }

  componentDidMount() {
    Navigation.events().bindComponent(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ client: nextProps.client })
  }

  navigationButtonPressed = () => {
    Alert.alert('Case Note', 'Please choose case note type.', [
      { text: this.props.setting.default_assessment, onPress: () => this.navigateToCaseNoteForm('default') },
      { text: this.props.setting.custom_assessment, onPress: () => this.navigateToCaseNoteForm('custom') },
    ])
  }

  navigateToCaseNoteForm = async type => {
    const icons = await appIcons()

    pushScreen(this.props.componentId, {
      screen: 'oscar.caseNoteForm',
      title: i18n.t('client.case_note_form.create_title'),
      props: {
        custom: type === 'custom',
        client: this.state.client,
        action: 'create',
        previousComponentId: this.props.componentId,
        onSaveSuccess: this.onCreateSuccess
      },
      rightButtons: [{
        id: 'SAVE_CASE_NOTE',
        icon: icons.save,
        color: '#fff'
      }]
    })
  }

  onCreateSuccess = client => {
    this.refs.dropdown.alertWithType('success', 'Success', 'Client has been successfully created.')
    this.setState({ client })
  }

  onCaseNotePress = async caseNote => {
    const icons = await appIcons()

    pushScreen(this.props.componentId, {
      screen: 'oscar.caseNoteDetail',
      title: caseNote.attendee || '(No Name)',
      props: {
        caseNote,
        client: this.state.client
      },
      rightButtons: [{
        id: 'EDIT_CASE_NOTE',
        icon: icons.edit,
        color: '#fff'
      }]
    })
  }


  keyExtractor = (item, _) => item.id.toString()

  renderItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => this.onCaseNotePress(item)}
    >
      <View style={styles.caseNoteWrapper} >
        <Text style={styles.title}>
          {item.attendee || '(No Name)'}{' '}
          {item.interaction_type != '' && `( ${item.interaction_type} )`}
        </Text>
        <Text style={styles.meetingDate}>
          {moment(item.meeting_date).format('MMMM Do, YYYY')}
        </Text>
      </View>
    </TouchableOpacity>
  )

  render() {
    const { client } = this.state

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <FlatList
            data={client.case_notes}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
          />
        </View>
        <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
      </View>
    )
  }
}

const mapState = (state, ownProps) => ({
  setting: state.setting.data,
  client: state.clients.data[ownProps.clientId]
})

export default connect(mapState)(CaseNotes)
