import React            from 'react'
import Icon             from 'react-native-vector-icons/Feather'
import LinearGradient   from 'react-native-linear-gradient'
import {
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
}                       from 'react-native'

export default function FloatButton(props) {
  const {
    onPress
  } = props

  return (
    <TouchableHighlight
      style={styles.buttonContainer}
      onPress={(e) => onPress()}
    >
      <LinearGradient 
        start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
        colors={['#CC2B67', '#FF4B53']}
        style={styles.buttonWrapper}
      >
        <Icon name="plus" size={30} color="#fff" />
      </LinearGradient>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    
    right: 15,
    bottom: 15,
    zIndex: 2,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,

    elevation: 5,
  },

  buttonWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  }
})
