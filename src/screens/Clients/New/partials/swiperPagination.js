import React from 'react'
import {View, Text, StyleSheet } from 'react-native'

export default function swiperPagination(props) {
  const StepPageName = [
    'Getting Started',
    'Living Details',
    'Other Details',
    'Specific Point of Referal Data'
  ]

  const {
    index,
    total
  } = props

  return (
    <View style={styles.paginationStyle}>
      <Text style={styles.paginationText}>{StepPageName[index]}</Text>

      <Text style={{}}>
      {index + 1} / {total}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  paginationStyle: {
    position: 'absolute',
    height: 40,
    width: '100%',
    flexDirection: 'row',
    padding: 10,
    alignContent: 'center',
  },
  paginationText: {
    flexGrow: 1,
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 17,
    fontWeight: 'bold'
  }
})

  