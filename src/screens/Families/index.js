import React, { Component } from 'react'
import FlatList from '../../components/FlatList'
import { Navigation } from 'react-native-navigation'
import { View, Text, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { pushScreen } from '../../navigation/config'
import { fetchFamilies, requestFamiliesSuccess } from '../../redux/actions/families'
import i18n from '../../i18n'
import styles from './styles'
import appIcon from '../../utils/Icon'

class Families extends Component {
  componentDidMount() {
    this.props.fetchFamilies()
  }

  subItems = family => {
    const clientsCount = family.clients.length
    const familyType = family.family_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())

    return [familyType, `${clientsCount} ${i18n.t('family.member_count')}`]
  }

  onPress = async family => {
    const icons = await appIcon()
    pushScreen(this.props.componentId, {
      screen: 'oscar.familyDetail',
      title: family.name,
      props: {
        familyId: family.id
      },
      rightButtons: [
        {
          id: 'EDIT_FAMILY',
          icon: icons.edit,
          color: '#fff'
        }
      ]
    })
  }

  render() {
    if (this.props.loading)
      return (
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
      )
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.families}
          title={({ name }) => name || '(No Name)'}
          subItems={this.subItems}
          onPress={this.onPress}
          refreshing={this.props.loading}
          onRefresh={() => this.props.hasInternet && this.props.fetchFamilies()}
        />
      </View>
    )
  }
}

const mapState = state => ({
  families: state.families.data,
  loading: state.families.loading,
  hasInternet: state.internet.hasInternet
})

const mapDispatch = {
  fetchFamilies,
  requestFamiliesSuccess
}

export default connect(
  mapState,
  mapDispatch
)(Families)
