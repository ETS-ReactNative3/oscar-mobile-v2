import React, { Component }             from 'react'
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  KeyboardAvoidingView, 
} from 'react-native'
import Layout                           from 'src/components/Layout'
import { NextButton, PreviousButton }   from './controllButton'
import { 
  Form,
  FormInput, 
  FormSelect, 
  FormInputSwitch }                     from 'src/components/Form'
import { fetchDonors }                  from 'src/redux/actions/donors'
import { fetchAgencies }                from 'src/redux/actions/agencies'
import { connect }                      from 'react-redux'
import _                                from 'lodash'

class OtherDetails extends Component {
  state={
    notes:'',
    firstID: '',
    secondID: '',
    agencies: [],
    donors: [],
    poorId: [],
    isLiveInOrphanage: false,
    isLiveInGovCare: false,
  }
  componentDidMount() {
    this.props.fetchAgencies()
    this.props.fetchDonors()
  }

  handleInputChange = (value, name) => {
    this.setState({ [name]: value })
    console.log("handleInputChange", name , value)
  }

  poorTypes = () => (
    [
      { id: 'No', name: 'No'},
      { id: 'Level 1', name: 'Level 1' },
      { id: 'Level 2', name: 'Level 2' }
    ]
  )

  agenciesTypes = () => {
    const { agencies } = this.props
      return _.map( agencies,agency => ({
        id: agency.id,
        name: agency.name
      })
    )
  }

  donorsTypes = () => {
    const { donors } = this.props
      return _.map(donors, donor => ({
        id: donor.id,
        name: donor.name
      })
    )
  }

  render() {
    console.log( "handleInputChange", this.handleInputChange.value)
    console.log( "value", this.value)
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Layout>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <Form>
              <FormSelect 
                label="Other Agencies Involved"
                items={this.agenciesTypes()}
                selectedItems={this.state.agencies}
                onSelectedItemsChange={ value => this.handleInputChange(value, "agencies") }
              />

              <FormSelect 
                label="Donor"
                items={this.donorsTypes()}
                selectedItems={this.state.donors}
                onSelectedItemsChange={ value => this.handleInputChange(value, "donors") }
              />

              <FormSelect 
                label="Is the Client Rated for ID Poor?"
                single={true}
                items={this.poorTypes()}
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

const mapState = (state) => ({
  agencies: state.agencies.data,
  donors: state.donors.data
})

const mapDispatch = () => ({
  fetchAgencies,
  fetchDonors
})

export default connect(mapState, mapDispatch)(OtherDetails)
