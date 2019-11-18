import React                      from 'react'
import { Text, View, StyleSheet } from 'react-native'

export default (props) => {
  const {title} = props
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>{title}</Text>
      <View style={{borderWidth: 1, borderColor: '#d5d4d7', marginTop: 5}}/>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 40,
    marginTop: 5,
    marginBottom: 5
  },

  headerText: {
    fontSize: 15,
    fontWeight: 'bold'
  },
})