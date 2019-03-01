import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { MAIN_COLOR } from '../../constants/colors'

const NoRecord = props => (
  <View style={styles.container}>
    <View style={styles.content}>
      <Icon name='speaker-notes-off' color='#000' size={70}/>
      <Text style={styles.whoop}>Whoops!!!</Text>
      <Text style={styles.text}>There is no match client found</Text>
      <TouchableOpacity onPress={ () => props.onShowAllRecords() }>
        <View style={styles.button}>
          <Text style={styles.buttonTitle}>
            List all Clients
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  whoop: {
    fontSize: 30,
    margin: 10
  },
  text: {
    fontSize: 20,
  },
  button: {
    backgroundColor: MAIN_COLOR,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    marginTop: 20
  },
  buttonTitle: {
    color: '#fff',
    fontSize: 20
  }
})

export default NoRecord