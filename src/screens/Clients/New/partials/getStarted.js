import React, { Component } from 'react'
import { 
  Text, 
  View, 
  TextInput,
  StyleSheet, 
} from 'react-native'
import Layout from 'src/components/Layout'

export default class getStarted extends Component {
  state = {
    value: ''
  }

  render() {
    return (
      <Layout>
        <View style={styles.container}>
          <Form>

            <Header 
              title="Staff "
            />

            <FormInput 
              onChangeText={text => onChangeText(text)}
              value={this.state.value}
              label="Given Name"
              placeholder="Given Name"
              error="Can't be blank"
            />

            <FormInput 
              onChangeText={text => onChangeText(text)}
              value={this.state.value}
              label="Given Name"
              placeholder="Given Name"
              error="Can't be blank"
            />
          </Form>
        </View>
      </Layout>
    )
  }
}

const Header = (props) => {
  const {title} = props
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  )
}

const Form = (props) => 
  <View>
    {props.children}
  </View>

const FormInput = (props) => {
  const { 
    onChangeText,
    value,
    label,
    placeholder,
    error
  } = props
  return (
    <View>
      <Text>
        {label}
      </Text>
      <TextInput 
        style={styles.formInput}
        onChangeText={text => onChangeText(text)}
        value={value}
        placeholder={placeholder}
      />

      <Text style={styles.formInputError}>{error}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'lightgreen',
    marginTop: 40,
    flex: 1,
    padding: 10,
    justifyContent: 'space-between'
  },

  headerContainer: {
    flex: 1,
    height: 20,
    flexDirection: 'row'
  },

  headerText: {
    fontSize: 20
  },

  formInput: {
    height: 40, 
    borderWidth: 1,
    borderColor: '#d5d4d7', 
    backgroundColor: '#f5f4f9',
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,

    marginTop: 5,
    marginBottom: 5
  },

  formInputError: {
    color: 'red',
    fontSize: 10,

    marginBottom: 5,
  },

  formInputLabel: {
    marginTop: 5,
    marginBottom: 5
  }
})