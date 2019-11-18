import React, { Component }             from 'react'
import { 
  Text, 
  View, 
  Switch,
  ScrollView, 
  StyleSheet, 
  KeyboardAvoidingView, 
} from 'react-native'

import Layout                           from 'src/components/Layout'
import { NextButton, PreviousButton }   from './controllButton'
import { FormSelect, FormInput, Form, FormInputSwitch }  from 'src/components/Form' 


export default class OtherDetails extends Component {
  state={
    notes:'',
    firstID: '',
    secondID: '',
    agenciesInvolved: [],
    donor: [],
    poorId: [],
    isLiveInOrphanage: false,
    isLiveInGovCare: false,
  }

  handleInputChange = (value, name) => {
    this.setState({ [name]: value })
  }

  interactionTypes = () => {
    return [
      { id: 'Visit', name: 'Visit' },
      { id: 'Non face to face', name: 'Non face to face' },
      { id: '3rd Party', name: '3rd Party' },
      { id: 'Other', name: 'Other' },
    ]
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Layout>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <Form>
              <FormSelect 
                label="Other Agencies Involved"
                items={this.interactionTypes()}
                selectedItems={this.state.agenciesInvolved}
                onSelectedItemsChange={ value => this.handleInputChange(value, "agenciesInvolved") }
              />

              <FormSelect 
                label="Donor"
                items={this.interactionTypes()}
                selectedItems={this.state.donor}
                onSelectedItemsChange={ value => this.handleInputChange(value, "donor") }
              />

              <FormSelect 
                label="Is the Client Rated for ID Poor?"
                single={true}
                items={this.interactionTypes()}
                selectedItems={this.state.poorId}
                onSelectedItemsChange={ value => this.handleInputChange(value, "poorId") }
              />


              <FormInputSwitch
                title="Has the client lived in an orphanage?"
                onValueChange={value => this.handleInputChange(value, "isLiveInOrphanage")}
                value={this.state.isLiveInOrphanage}
              />

              <FormInputSwitch
                title="Has the client lived in government care?"
                onValueChange={value => this.handleInputChange(value, "isLiveInGovCare")}
                value={this.state.isLiveInGovCare}
              />
              
              <FormInput 
                onChangeText={text => this.handleInputChange(text, "firstID")}
                value={this.state.firstID}
                label="First ID"
              />

              <FormInput 
                onChangeText={text => this.handleInputChange(text, "secondID")}
                value={this.state.secondID}
                label="Second ID"
              />

              <FormInput 
                onChangeText={text => this.handleInputChange(text,"notes")}
                value={this.state.notes}
                label="Relevant Referral Information / Notes"
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

  controlButtonContainer: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

