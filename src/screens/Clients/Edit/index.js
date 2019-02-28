import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import Modal from 'react-native-modal'
import ClientFormWidget from '../../../components/ClientFormWidget'

import { updateClientProperty } from '../../../redux/actions/clients'

class ClientForm extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ClientFormWidget {...this.props} />
      </View>
    )
  }
}

const mapState = state => ({
  provinces: state.provinces.data,
  districts: state.districts.data,
  communes: state.communes.data,
  villages: state.villages.data,
  donors: state.donors.data,
  referralSources: state.referralSources.data,
  quantitativeTypes: state.quantitativeTypes.data,
  users: state.users.data,
  agencies: state.agencies.data
})

const mapDispatch = {
  updateClientProperty
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 5
  }
})

export default connect(
  mapState,
  mapDispatch
)(ClientForm)
