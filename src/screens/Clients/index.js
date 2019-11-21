import React, { Component }               from 'react'
import { connect }                        from 'react-redux'
import { SearchBar, Button }                      from 'react-native-elements'
import { Navigation }                     from 'react-native-navigation'
import Icon                               from 'react-native-vector-icons/Feather'
import LinearGradient from 'react-native-linear-gradient'
import { pickBy, isEmpty }                from 'lodash'
import { fetchClients }                   from '../../redux/actions/clients'
import { fetchProvinces }                 from '../../redux/actions/provinces'
import { fetchDistricts }                 from '../../redux/actions/districts'
import { fetchCommunes }                  from '../../redux/actions/communes'
import { fetchVillages }                  from '../../redux/actions/villages'
import { fetchSetting }                   from '../../redux/actions/setting'
import { fetchBirthProvinces }            from '../../redux/actions/birthProvinces'
import { fetchProgramStreams }            from '../../redux/actions/programStreams'
import { fetchReferralSources }           from '../../redux/actions/referralSources'
import { fetchReferralSourceCategories }  from '../../redux/actions/referralSourceCategories'
import { fetchQuantitativeTypes }         from '../../redux/actions/quantitativeTypes'
import { fetchAgencies }                  from '../../redux/actions/agencies'
import { fetchDonors }                    from '../../redux/actions/donors'
import { fetchUsers }                     from '../../redux/actions/users'
import { pushScreen }                     from '../../navigation/config'
import FlatList                           from '../../components/FlatList'
import Layout                             from '../../components/Layout'
import NoRecord                           from './NoRecord'
import i18n                               from '../../i18n'
import styles                             from './styles'
import appIcon                            from '../../utils/Icon'
import CreateNewClientButton              from '../../components/FloatButton'
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity
}  from 'react-native'
class Clients extends Component {
  constructor(props) {
    super(props)
    this.state = { clients: props.clients, showSearch: false, searching: false, search: '' }
    Navigation.events().bindComponent(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ clients: nextProps.clients })
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'SEARCH_USER') {
      const { showSearch } = this.state
      this.setState({
        showSearch: !showSearch,
        clients: this.props.clients
      })
    }
  }

  async navigateToNewClient() {
    const icons = await appIcon()
    pushScreen(this.props.componentId, {
      screen: 'oscar.newClient',
      title: "New Client",
      props: {
        // clientId: client.id,
        // setting: this.props.setting
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

  componentDidMount() {
    this.props.fetchClients()
    // this.props.fetchDistricts()
    // this.props.fetchProvinces()
    // this.props.fetchCommunes()
    // this.props.fetchVillages()
    // this.props.fetchSetting()
    // this.props.fetchBirthProvinces()
    // this.props.fetchProgramStreams()
    // this.props.fetchReferralSources()
    // this.props.fetchReferralSourceCategories()
    // this.props.fetchQuantitativeTypes()
    // this.props.fetchAgencies()
    // this.props.fetchDonors()
    // this.props.fetchUsers()
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

  searchClient = text => {
    this.setState({ searching: true, search: text })

    const clients = pickBy(this.props.clients, (client, id) => {
      const value = `${client.given_name} ${client.family_name} ${client.local_given_name} ${client.local_family_name} ${
        client.village
      }`.toLowerCase()
      return text === '' || value.includes(text.toLowerCase())
    })

    this.setState({ searching: false, clients })
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
    const { showSearch, searching, search, clients } = this.state
    const { loading } = this.props

    if (loading)
      return (
        <Layout>
          <View
            style={{
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              flexDirection: 'row'
            }}
          >
            <ActivityIndicator color="#009999" size="large" />
            <Text style={{ fontSize: 16, marginLeft: 8 }}>Loading...</Text>
          </View>
        </Layout>
      )

    if (!showSearch && !search && isEmpty(clients)) {
      return (
        <Layout>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{i18n.t('no_data')}</Text>
          </View>
        </Layout>
      )
    }

    return (
      <Layout>
        <View style={styles.container}>
          <CreateNewClientButton 
            onPress={ (e) => this.navigateToNewClient() }
          />
          {showSearch ? (
            <SearchBar
              containerStyle={styles.searchContainer}
              inputStyle={styles.searchInput}
              lightTheme
              placeholder="Search name, local name, village"
              autoCapitalize="none"
              textInputRef="clear"
              onChangeText={this.searchClient}
              noIcon
              showLoadingIcon={searching}
            />
          ) : null}
          {showSearch && search && isEmpty(clients) ? (
            <NoRecord onShowAllRecords={() => this.setState({ clients: this.props.clients })} />
          ) : (
            <FlatList
              data={clients}
              title={this.clientName}
              subItems={this.subItems}
              onPress={this.onClientPress}
              refreshing={loading}
              onRefresh={() => this.props.fetchClients()}
              isClientList
            />
          )}
        </View>
      </Layout>
    )
  }
}


const mapState = state => ({
  clients: state.clients.data,
  loading: state.clients.loading,
  setting: state.setting.data,
  hasInternet: state.internet.hasInternet,
  clientQueue: state.clientQueue.data
})

const mapDispatch = {
  fetchClients,
  fetchProvinces,
  fetchDistricts,
  fetchCommunes,
  fetchVillages,
  fetchSetting,
  fetchBirthProvinces,
  fetchProgramStreams,
  fetchReferralSources,
  fetchQuantitativeTypes,
  fetchAgencies,
  fetchDonors,
  fetchUsers,
  fetchReferralSourceCategories
}

export default connect(
  mapState,
  mapDispatch
)(Clients)
