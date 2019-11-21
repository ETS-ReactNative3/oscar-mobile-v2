import React, { Component }              from 'react'
import { connect }                       from 'react-redux'
import _                                 from 'lodash'
import { 
  View, 
  ScrollView, 
  StyleSheet,
  KeyboardAvoidingView, 
} from 'react-native'

import Layout                           from 'src/components/Layout'
import Header                           from './header'
import { NextButton, PreviousButton }   from './controllButton'
import { 
  Form, 
  FormInput, 
  FormSelect, 
} from 'src/components/Form'

import { fetchProvinces }                             from 'src/redux/actions/provinces'
import { fetchDistricts }                             from 'src/redux/actions/districts'
import { fetchCommunes }                              from 'src/redux/actions/communes'
import { fetchVillages }                              from 'src/redux/actions/villages'
import { fetchFamilies }                              from 'src/redux/actions/families'


class LivingDetails extends Component {
  state = {
    primaryCarerName: '',
    primaryCarePhoneNumber: '',
    currentProvince: [],
    addressDistrictKhan: [],
    addressCommuneSangkat: [],
    addressVillage: [],
    addressHouse: '',
    addressStreet: '',
    what3words: '',
    family: [],

    schoolName: '',
    schoolGrade: [],
    mainSchoolContact: ''
  }

  componentDidMount() {
    this.props.fetchProvinces()
    this.props.fetchDistricts()
    this.props.fetchCommunes()
    this.props.fetchVillages()
    this.props.fetchFamilies()
  }

  handleInputChange = (text, name) => {
    this.setState({ [name]: text })
  }

  ReferalReceivedByNames = () => {
    return (
      [
        { id: 'Admin 1', name: 'Admin 1' },
        { id: 'Admin 2', name: 'Admin 2' },
      ]
    )
  }

  mapFilter = (id, objs) => {
    return _.compact(
      _.map(objs, obj => {
        if(id == obj[id])
          return {
            id: obj.id,
            name: obj.name
          }
        else
          null
      })
    )
  }

  currentProvinceTypes = (province_id) => {
    let { provinces } = this.props
    return _.map(provinces, pro => ({id: pro.id, name: pro.name}))
  }

  districtTypes = () => {
    let province_id = this.state.currentProvince[0] || ''
    let { districts } = this.props

    return this.mapFilter(province_id, districts)
  }

  communeTypes = () => {
    let district_id = this.state.addressDistrictKhan || ''
    let { communes } = this.props

    return this.mapFilter(district_id, communes)
  }

  villageTypes = () => {
    let commune_id = this.state.addressCommuneSangkat || ''
    let { villages } = this.props

    return this.mapFilter(commune_id, villages)
  }

  familyTypes = () => {
    let { families } = this.props
    return _.map(families, family => ({ id: family.id, name: family.name}))
  }

  schoolGradeTypes = () => ([
    {id: 'Kindergarten 1', name: 'Kindergarten 1'},
    {id: 'Kindergarten 2', name: 'Kindergarten 2'},
    {id: 'Kindergarten 3', name: 'Kindergarten 3'},
    {id: 'Kindergarten 4', name: 'Kindergarten 4'},
    {id: '1', name: '1'},
    {id: '2', name: '2'},
    {id: '3', name: '3'},
    {id: '4', name: '4'},
    {id: '5', name: '5'},
    {id: '6', name: '6'},
    {id: '7', name: '7'},
    {id: '8', name: '8'},
    {id: '9', name: '9'},
    {id: '10', name: '10'},
    {id: '11', name: '11'},
    {id: '12', name: '12'},
    {id: 'Year 1', name: 'Year 1'},
    {id: 'Year 2', name: 'Year 2'},
    {id: 'Year 3', name: 'Year 3'},
    {id: 'Year 4', name: 'Year 4'},
    {id: 'Year 5', name: 'Year 5'},
    {id: 'Year 6', name: 'Year 6'},
    {id: 'Year 7', name: 'Year 7'},
    {id: 'Year 8', name: 'Year 8'},
  ])

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Layout>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            
            <Form>

              <Header 
                title="Contact Details"
              />

              <FormInput 
                onChangeText={text => this.handleInputChange(text, "primaryCarerName")}
                value={this.state.primaryCarerName}
                label="Primary Carer Name"
                placeholder="Primary Carer Name"
              />
              
              <FormInput 
                onChangeText={text => this.handleInputChange(text, "primaryCarePhoneNumber")}
                value={this.state.primaryCarePhoneNumber}
                label="Primary Carer Phone Number"
                placeholder="Primary Carer Phone Number"
              />

              <FormSelect 
                label="Current Province"
                items={this.currentProvinceTypes()}
                selectedItems={this.state.currentProvince}
                onSelectedItemsChange={ province => this.handleInputChange(province, "currentProvince") }
                single={true}
              />

              <FormSelect 
                label="Address - District/Khan"
                items={this.districtTypes()}
                selectedItems={this.state.addressDistrictKhan}
                onSelectedItemsChange={ district => this.handleInputChange(district, "addressDistrictKhan") }
                single={true}
              />

              <FormSelect 
                label="Address - Commune/Sangkat"
                items={this.communeTypes()}
                selectedItems={this.state.addressCommuneSangkat}
                onSelectedItemsChange={ commune => this.handleInputChange(commune, "addressCommuneSangkat") }
                single={true}
              />

              <FormSelect 
                label="Address - Village"
                items={this.villageTypes()}
                selectedItems={this.state.addressVillage}
                onSelectedItemsChange={ village => this.handleInputChange(village, "addressVillage") }
                single={true}
              />

              <FormInput 
                onChangeText={text => this.handleInputChange(text, "addressHouse")}
                value={this.state.addressHouse}
                label="Address - House"
                placeholder="Address - House"
              />

              <FormInput 
                onChangeText={text => this.handleInputChange(text, "addressStreet")}
                value={this.state.addressStreet}
                label="Address - Street"
                placeholder="Address - Street"
              />

              <FormInput 
                onChangeText={text => this.handleInputChange(text, "what3words")}
                value={this.state.what3words}
                label="What3words"
                placeholder="What3words"
              />

              <FormSelect 
                label="Family"
                items={this.familyTypes()}
                selectedItems={this.state.family}
                onSelectedItemsChange={ familyName => this.handleInputChange(familyName, "family") }
                single={true}
              />

              <Header 
                title="Schooling"
              />

              <FormInput 
                onChangeText={text => this.handleInputChange(text, "schoolName")}
                value={this.state.schoolName}
                label="School Name"
                placeholder="School Name"
              />

              <FormSelect 
                label="School Grade"
                items={this.schoolGradeTypes()}
                selectedItems={this.state.schoolGrade}
                onSelectedItemsChange={ grade => this.handleInputChange(grade, "School Grade") }
                single={true}
              />

              <FormInput 
                onChangeText={text => this.handleInputChange(text, "mainSchoolContact")}
                value={this.state.mainSchoolContact}
                label="Main School Contact"
                placeholder="Main School Contact"
              />

              <View style={styles.controlButtonContainer}>
                <PreviousButton 
                  onPress={() => this.props.handleGoToPrivousTab()}
                />

                <NextButton 
                  onPress={() => this.props.handleGoToNextTab()}
                />

              </View>
          
            </Form>
            
          </ScrollView>


        </Layout>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    padding: 10,
    justifyContent: 'space-between'
  },

  headerContainer: {
    height: 40,
    marginTop: 5,
    marginBottom: 5
  },

  headerText: {
    fontSize: 15
  },

  controlButtonContainer: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})


const mapState = (state) => ({
  provinces: state.provinces.data,
  districts: state.districts.data,
  communes: state.communes.data,
  villages: state.villages.data,
  families: state.families.data
})

const mapDispatch = () => ({
  fetchProvinces,
  fetchDistricts,
  fetchCommunes,
  fetchVillages,
  fetchFamilies
})

export default connect(mapState, mapDispatch)(LivingDetails)
