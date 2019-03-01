import React, { Component } from 'react'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import moment from 'moment'
import appIcons from '../../utils/Icon'
import { pushScreen } from '../../navigation/config'
import styles from './styles'

class CaseNotes extends Component {
  onCaseNotePress = async caseNote => {
    const icons = await appIcons()

    const todayDate = moment(new Date()).format("YYYY-MM-DD").toString()
    const createdAt = moment(caseNote.created_at).format("YYYY-MM-DD").toString()

    const rightButtons = createdAt === todayDate
                          ? [{ id: 'EDIT_CASE_NOTE', icon: icons.edit, color: '#fff' }]
                          : []

    pushScreen(this.props.componentId, {
      screen: 'oscar.caseNoteDetail',
      title: caseNote.attendee || '(No Name)',
      props: {
        caseNoteId: caseNote.id,
        clientId: this.props.clientId
      },
      rightButtons
    })
  }

  keyExtractor = (item, _) => item.id.toString()

  renderIcon = () => {
    if (this.props.isClientList) return <Icon name={'account-circle'} color="#dedede" size={55} />
    else
      return (
        <View style={styles.iconWrapper}>
          <Icon name="group" color="#fff" size={46} style={{ padding: 2 }} />
        </View>
      )
  }

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
    const { client } = this.props

    return (
      <ScrollView style={styles.container}>
        <FlatList
          data={client.case_notes}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </ScrollView>
    )
  }
}

const mapState = (state, ownProps) => ({
  client: state.clients.data[ownProps.clientId]
})

export default connect(mapState)(CaseNotes)
