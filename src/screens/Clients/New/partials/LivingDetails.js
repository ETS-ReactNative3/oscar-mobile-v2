import React, { Component }              from 'react'
import { 
  Text, 
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


export default class LivingDetails extends Component {
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
                items={this.ReferalReceivedByNames()}
                selectedItems={this.state.currentProvince}
                onSelectedItemsChange={ province => this.handleInputChange(province, "currentProvince") }
                single={true}
              />

              <FormSelect 
                label="Address - District/Khan"
                items={this.ReferalReceivedByNames()}
                selectedItems={this.state.addressDistrictKhan}
                onSelectedItemsChange={ district => this.handleInputChange(district, "addressDistrictKhan") }
                single={true}
              />

              <FormSelect 
                label="Address - Commune/Sangkat"
                items={this.ReferalReceivedByNames()}
                selectedItems={this.state.addressCommuneSangkat}
                onSelectedItemsChange={ commune => this.handleInputChange(commune, "addressCommuneSangkat") }
                single={true}
              />

              <FormSelect 
                label="Address - Village"
                items={this.ReferalReceivedByNames()}
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
                items={this.ReferalReceivedByNames()}
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
                items={this.ReferalReceivedByNames()}
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

