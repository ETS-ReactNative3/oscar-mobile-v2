import React from 'react'
import { View, Text } from 'react-native'
import styles from './styles'

export default function card(props) {
  return (
    <View style={[styles.card, props.style]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          { props.title }
        </Text>
      </View>
      <View style={styles.content}>
        { props.children }
      </View>
    </View>
  )
}
