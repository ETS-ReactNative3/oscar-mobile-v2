import React        from 'react'
import {Button}     from 'react-native-elements'
import Icon         from 'react-native-vector-icons/Feather'

export const PreviousButton = (props) => {
  const {
    onPress
  } = props

  return (
    <Button
      icon={
        <Icon
          name="chevrons-left"
          size={15}
          color="white"
          style={{ marginRight: 10}}
        />
      }
      containerStyle={{width: "40%"}}
      onPress={() => onPress()}
      title="Prev"
      iconRight={false}
    />
  )
}

export const NextButton = (props) => {
  const {
    onPress
  } = props

  return (
    <Button
      icon={
        <Icon
          name="chevrons-right"
          size={15}
          color="white"
          style={{ marginLeft: 10}}
        />
      }
      containerStyle={{width: "40%"}}
      onPress={() => onPress()}
      title="Next"
      iconRight={true}
    />
  )
}