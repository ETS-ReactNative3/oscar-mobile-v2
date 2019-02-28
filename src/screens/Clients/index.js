import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ScrollView, View, Text } from 'react-native'
import { fetchClients } from '../../redux/actions/clients'
import { fetchProvinces } from '../../redux/actions/provinces'
import { fetchDistricts } from '../../redux/actions/districts'
import { fetchCommunes } from '../../redux/actions/communes'
import { fetchVillages } from '../../redux/actions/villages'
import { fetchSetting } from '../../redux/actions/setting'
import { fetchProgramStreams } from '../../redux/actions/programStreams'
import { fetchReferralSources } from '../../redux/actions/referralSources'
import { fetchQuantitativeTypes } from '../../redux/actions/quantitativeTypes'
import { fetchAgencies } from '../../redux/actions/agencies'
import { fetchDonors } from '../../redux/actions/donors'
import { fetchUsers } from '../../redux/actions/users'
import { pushScreen } from '../../navigation/config'
import FlatList from '../../components/FlatList'
import i18n from '../../i18n'
import styles from './styles'
import appIcon from '../../utils/Icon'

class Clients extends Component {
  componentDidMount() {
    this.props.fetchClients()
    this.props.fetchDistricts()
    this.props.fetchProvinces()
    this.props.fetchCommunes()
    this.props.fetchVillages()
    this.props.fetchSetting()
    this.props.fetchProgramStreams()
    this.props.fetchReferralSources()
    this.props.fetchQuantitativeTypes()
    this.props.fetchAgencies()
    this.props.fetchDonors()
    this.props.fetchUsers()
  }

  onClientPress = async client => {
    const icons = await appIcon()
    pushScreen(this.props.componentId, {
      screen: 'oscar.clientDetail',
      title: this.clientName(client),
      props: {
        clientId: client.id,
        setting: this.props.setting
      },
      rightButtons: [
        {
          id: 'EDIT_CLIENT',
          icon: icons.edit,
          color: '#fff'
        }
      ]
    })
  }

  clientName = ({ given_name, family_name }) => {
    const fullName = [given_name, family_name].filter(Boolean).join(' ')
    return fullName || '(No Name)'
  }

  subItems = client => {
    const taskCount = client.tasks.overdue.length + client.tasks.today.length + client.tasks.upcoming.length
    const assessmentCount = client.assessments.length
    const caseNoteCount = client.case_notes.length

    return [
      `${taskCount} ${i18n.t('client.tasks')}`,
      `${assessmentCount} ${i18n.t('client.assessments')}`,
      `${caseNoteCount} ${i18n.t('client.case_notes')}`
    ]
  }

  render() {
    if (this.props.loading)
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Loading...</Text>
        </View>
      )
    return (
      <ScrollView style={styles.container}>
        <FlatList data={this.props.clients} title={this.clientName} subItems={this.subItems} onPress={this.onClientPress} isClientList />
      </ScrollView>
    )
  }
}

const mapState = state => ({
  clients: state.clients.data,
  loading: state.clients.loading,
  setting: state.setting.data
})

const mapDispatch = {
  fetchClients,
  fetchProvinces,
  fetchDistricts,
  fetchCommunes,
  fetchVillages,
  fetchSetting,
  fetchProgramStreams,
  fetchReferralSources,
  fetchQuantitativeTypes,
  fetchAgencies,
  fetchDonors,
  fetchUsers
}

export default connect(
  mapState,
  mapDispatch
)(Clients)
