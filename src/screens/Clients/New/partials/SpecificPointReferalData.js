import React, { Component }       from 'react'
import { 
  View, 
  ScrollView, 
  StyleSheet,
  KeyboardAvoidingView, 
} from 'react-native'
import _                          from 'lodash'
import Layout                     from 'src/components/Layout'
import { FormSelect, Form }       from 'src/components/Form'
import { PreviousButton }         from './controllButton'
import { connect }                from 'react-redux'
import { fetchQuantitativeTypes } from 'src/redux/actions/quantitativeTypes' 

class SpecificPointReferalData extends Component {
  state = {
    quantitativeTypes: []
  }

  componentDidMount() {
    this.props.fetchQuantitativeTypes()
  }

  handleInputChange = (value, name) => {
    this.setState({ [name]: value })
    console.log("inputChange", name, value)
  }

  quantitativeTypes = () => {
    const { quantitativeTypes } = this.props
      return _.map( quantitativeTypes, quantitativeType => ({
        id: quantitativeType.id,
        name: quantitativeType.name,
      })
    )
  }

  quantitativeCases = (data) => {
    return _.map(data, d => ({ id: d.id, name: d.value }))
  }

  render() {
    return (
      <Layout>
        <KeyboardAvoidingView style={styles.container} behavior="height">
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <Form>
              {
                this.props.quantitativeTypes.map(quantitative =>
                  <FormSelect 
                    key={quantitative.id}
                    label={quantitative.name}
                    items={this.quantitativeCases(quantitative.quantitative_cases)}
                    selectedItems={this.state[quantitative.name]}
                    onSelectedItemsChange={ value => this.handleInputChange(value, quantitative.name) }
                  />
                )
              }

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
    padding: 20,
    justifyContent: 'space-between'
  },

  headerContainer: {
    height: 40,
    marginTop: 5,
    marginBottom: 5
  },

  controlButtonContainer: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

const mapState = (state) => ({
  quantitativeTypes: state.quantitativeTypes.data
})

const mapDispatch = () => ({
  fetchQuantitativeTypes
})

export default connect(mapState, mapDispatch)(SpecificPointReferalData)