import React                                  from 'react'
import {
  View,
  Text,
  Switch,
  TextInput,
  StyleSheet,
} from 'react-native'

import Icon                                     from 'react-native-vector-icons/AntDesign'
import { Button }                               from 'react-native-elements'
import DatePicker                               from 'react-native-datepicker'
import SectionedMultiSelect                     from 'react-native-sectioned-multi-select'

const styles = StyleSheet.create({
  formInputContainer: {
    marginBottom: 5,
  },

  formInput: {
    height: 40, 
    borderWidth: 1,
    borderColor: '#d5d4d7', 
    backgroundColor: '#f5f4f9',
    padding: 10,
    borderRadius: 5,
  },

  formInputError: {
    color: 'red',
    fontSize: 10,
  },

  formInputLabel: {
    marginBottom: 5
  },

  formSelectContainer: {
    marginTop: 5,
    marginBottom: 5,
  },

  formSelect: {
    height: 40, 
    borderWidth: 1,
    borderColor: '#d5d4d7', 
    backgroundColor: '#f5f4f9',
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  formInputDateContainer: {
    marginTop: 5,
    marginBottom: 5,
  },

  formInputDateLabel: {
    marginBottom: 5
  },

  formInputDatePicker: {
    height: 40, 
    flex: 1,
    borderWidth: 1,
    borderColor: '#d5d4d7', 
    backgroundColor: '#f5f4f9',
    padding: 10,
    borderRadius: 5,
    alignItems: 'flex-start',
  },

  switchContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  formInputFileContainer: {
    marginTop: 5,
    marginBottom: 5
  },

  errorStyle: {
    borderColor: 'red',
  }
  
})

export const Form = (props) => 
  <View>
    {props.children}
  </View>


export const FormInput = (props) => {
  const { 
    value,
    label,
    required,
    placeholder,
    onChangeText,
    keyboardType,
    error,
  } = props
  let formInputStyles = error ? {...styles.formInput, ...styles.errorStyle } : styles.formInput
  return (
    <View style={styles.formInputContainer}>
      <Text style={styles.formInputLabel}>
        <Text style={{ color: 'red' }}>{required && "* "}</Text>
        {label}
      </Text>
      <TextInput 
        style={formInputStyles}
        onChangeText={text => onChangeText(text)}
        value={value}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />

      <Text style={styles.formInputError}>{error}</Text>
    </View>
  )
}

export const FormSelect = (props) => {
  const {
    items,
    onSelectedItemsChange,
    selectedItems,
    label,
    single,
    required,
    error
  } = props

  let SelectedToggleStyles = error ? { ...styles.formSelect, ...styles.errorStyle } : styles.formSelect 
  return (
    <View style={styles.formSelectContainer}>
      <Text style={styles.formInputLabel}>
        <Text style={{ color: 'red' }}>{required && "* "}</Text>
        {label}
      </Text>
      <SectionedMultiSelect
        items={items}
        uniqueKey="id"
        subKey="children"
        modalWithSafeAreaView
        single={single}
        selectText="Select Option"
        hideSearch={false}
        confirmText="Confirm"
        showDropDowns={true}
        showCancelButton={true}
        styles={{
          cancelButton: { width: 150 },
          chipText: { maxWidth: 50, fontSize: 12 },
          selectToggle: SelectedToggleStyles
        }}
        onSelectedItemsChange={ value => onSelectedItemsChange(value) }
        selectedItems={selectedItems}
      />

      <Text style={styles.formInputError}>{error}</Text>

    </View>
  )
}

export const FormInputDate = (props) => {
  const {
    date,
    label,
    required,
    onDateChange,
    error
  } = props
  
  let formInputDatePicker = error ? { ...styles.formInputDatePicker, ...styles.errorStyle } : styles.formInputDatePicker
  
  return (
    <View style={styles.formInputDateContainer}>
      <Text style={styles.formInputDateLabel}>
        <Text style={{ color: 'red' }}>{required && "* "}</Text>
        {label}
      </Text>
      
      <DatePicker
        date={date}
        style={{ width: '100%' }}
        mode="date"
        confirmBtnText="Done"
        cancelBtnText="Cancel"
        showIcon={true}
        iconComponent={
          <Icon
            name="calendar"
            size={15}
            style={{
              position: 'absolute',
              right: 0,
              marginRight: 15,
            }}
          />
        }
        placeholder="Selected Date"
        format="YYYY-MM-DD"
        customStyles={{
          dateInput: formInputDatePicker,
        }}
        onDateChange={date => onDateChange(date)}
      />

      <Text style={styles.formInputError}>{error}</Text>
    </View>
  )
}

export const FormInputFile = (props) => {
  const {
    label,
    onPress,
  } = props
  
  return (
    <View style={styles.formInputFileContainer}>
      <Button
        onPress={() => onPress()}
        buttonStyle={{
          height: 100,
          borderStyle: 'dashed',
          borderWidth: 2,
          borderColor: '#d5d4d7', 
          backgroundColor: '#f5f4f9',
          flexDirection: 'column'
        }}
        icon={
          <Icon
            name="upload"
            size={25}
            color="#d5d4d7"
          />
        }

        title={label}
        titleStyle={{ color: '#d5d4d7' }}
      />
    </View>
  )
}

export const FormInputSwitch = (props) => {
  const { 
    title,
    value, 
    trackColor, 
    onValueChange, 
  } = props

  return(
    <View style={styles.switchContainer}>
      <Text>{title}</Text>
      <Switch
        onValueChange={value => onValueChange(value)}
        value={value}
        trackColor={trackColor}
      />
    </View> 
  )
}