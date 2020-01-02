import React                      from 'react'
import { MAIN_COLOR }             from '../constants/colors'
import { View, StyleSheet, Text } from 'react-native'

const Card = (props) => (
  <View style={[styles.container, props.style]}>
    <View style={[styles.header, { backgroundColor: props.color || MAIN_COLOR }]}>
      <Text style={styles.headerTitle}>
        { props.title }
      </Text>
      { props.rightButton }
    </View>
    <View style={styles.content}>
      { props.children }
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    elevation: 15,
    shadowOffset:{  width: 5,  height: 5 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
  },
  content: {
    backgroundColor: '#fff',
    flex: 1,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  header: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: "space-between",
    flexDirection: 'row',
    padding: 20
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff'
  }
})

export default Card