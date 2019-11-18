
import React, { Component }   from 'react'
import { 
  View, 
  ScrollView, 
  StyleSheet,
  KeyboardAvoidingView, 
} from 'react-native'

import Layout                 from 'src/components/Layout'
import { PreviousButton }     from './controllButton'
import { FormSelect, Form }   from 'src/components/Form' 


export default class SpecificPointReferalData extends Component {

  state = {
    childHistory:[],
    historyHarm:[],
    historyIllness:[],
    historyHighRisk:[],
    reasonEnrollment:[],
    reasonFamilySeparate:[]
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
      <Layout>
        <KeyboardAvoidingView style={styles.container} behavior="height">
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <Form>
              <FormSelect 
                label="Child History"
                items={this.interactionTypes()}
                selectedItems={this.state.childHistory}
                onSelectedItemsChange={ history => this.handleInputChange(history, "childHistory") }
              />

              <FormSelect 
                label="History of disability and/or illness"
                items={this.interactionTypes()}
                selectedItems={this.state.historyIllness}
                onSelectedItemsChange={ history => this.handleInputChange(history, "historyIllness") }
              />
              
              <FormSelect 
                label="History of Harm"
                items={this.interactionTypes()}
                selectedItems={this.state.historyHarm}
                onSelectedItemsChange={ history => this.handleInputChange(history, "historyHarm") }
              />
              
              <FormSelect 
                label="History of high-risk behaviours"
                items={this.interactionTypes()}
                selectedItems={this.state.historyHighRisk}
                onSelectedItemsChange={ history => this.handleInputChange(history, "historyHighRisk") }
              />

              <FormSelect 
                label="Reason for Family Separation"
                items={this.interactionTypes()}
                selectedItems={this.state.reasonFamilySeparate}
                onSelectedItemsChange={ history => this.handleInputChange(history, "reasonFamilySeparate") }
              />
              
              <FormSelect 
                label="Reason of enrollment clients into the program"
                items={this.interactionTypes()}
                selectedItems={this.state.reasonEnrollment}
                onSelectedItemsChange={ history => this.handleInputChange(history, "reasonEnrollment") }
              />

              <View style={styles.controlButtonContainer}>
                <PreviousButton 
                  onPress={() => this.props.handleGoToPrivousTab()}
                />
              </View>
            </Form>
          </ScrollView>
      
        </KeyboardAvoidingView>
      </Layout>
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

