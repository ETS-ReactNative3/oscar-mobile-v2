import React, { Component } from 'react'
import { View, Text, TextInput, ScrollView, Dimensions, Alert, Image, TouchableWithoutFeedback } from 'react-native'
import { CheckBox, Button, Divider } from 'react-native-elements'
import DatePicker from 'react-native-datepicker'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'
import ImagePicker from 'react-native-image-picker'
import { Navigation } from 'react-native-navigation'
import moment from 'moment'
import i18n from '../../../i18n'
import { customFormStyles } from '../../../styles'
import { options, MAX_SIZE } from '../../../constants/option'
import { MAIN_COLOR } from '../../../constants/colors'
import { validateCustomForm, formTypes, disabledUpload } from '../../../utils/validation'
import { createTrackingForm, updateTrackingForm } from '../../../redux/actions/programStreams'
import { connect } from 'react-redux'
class TrackingForm extends Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
    this.state = { field_properties: {}, fileSize: 0 }
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'SAVE_TRACKING') {
      const { programStream, tracking, client, action } = this.props
      const { field_properties } = this.state

      const lastActive = _.filter(programStream.enrollments, enrollment => {
        return enrollment.status == 'Active'
      })
      const client_enrolled_programs_id = lastActive[0].id

      const validated = validateCustomForm(field_properties, tracking.fields)
      if (validated) {
        if (action == 'create') {
          this.props.createTrackingForm(field_properties, tracking, client_enrolled_programs_id, client.id, tracking.id, this.props)
        } else {
          this.props.updateTrackingForm('Tracking', field_properties, tracking, client.id, tracking.client_enrollment_id, tracking.id, this.props)
        }
      }
    }
  }

  componentWillMount() {
    const { tracking, action } = this.props
    let { field_properties } = this.state

    const fields = action == 'create' ? tracking.fields : tracking.tracking_field
    const Values = action == 'create' ? null : tracking.properties

    _.map(fields, field => {
      if (formTypes.includes(field.type)) {
        if (['checkbox-group', 'multiple', 'select', 'file'].includes(field.type)) {
          field_properties[field.label] = Values != null ? Values[field.label] : []
        } else {
          field_properties[field.label] = Values != null ? Values[field.label] : ''
        }
      }
    })
    this.setState({
      field_properties: field_properties
    })
  }

  _updateField(label, updatedValue) {
    const { field_properties } = this.state
    field_properties[label] = updatedValue != 'default' ? updatedValue : ''
    this.setState({
      field_properties: field_properties
    })
  }

  _updateMultipleSelect(label, value) {
    let { field_properties } = this.state
    if (field_properties[label].includes(value)) {
      field_properties[label] = _.filter(field_properties[label], selected_value => {
        return selected_value != value
      })
    } else {
      field_properties[label] = field_properties[label].concat(value)
    }
    this.setState(field_properties)
  }

  listItems(options) {
    return _.map(options, option => ({ name: option.label, id: option.label }))
  }

  _datePickerType(label, data) {
    const value = data != undefined ? data : ''
    return (
      <View style={customFormStyles.fieldContainer}>
        <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        <DatePicker
          date={value}
          style={customFormStyles.datePicker}
          mode="date"
          confirmBtnText="Done"
          cancelBtnText="Cancel"
          placeholder={i18n.t('client.select_date')}
          showIcon={false}
          format="YYYY-MM-DD"
          customStyles={{
            dateInput: customFormStyles.datePickerBorder
          }}
          onDateChange={date => this._updateField(label, date)}
        />
      </View>
    )
  }

  _textType(label, data, formField) {
    const value = data != undefined ? data : ''
    return (
      <View style={customFormStyles.fieldContainer}>
        <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        <TextInput
          autoCapitalize="sentences"
          returnKeyType="next"
          style={customFormStyles.input}
          onChangeText={newData => this._updateField(label, newData)}
          value={value}
        />
      </View>
    )
  }

  _numberType(label, data, formField) {
    let value = data != undefined ? data : ''
    return (
      <View style={customFormStyles.fieldContainer}>
        <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        <TextInput
          autoCapitalize="sentences"
          returnKeyType="next"
          style={customFormStyles.input}
          keyboardType="numeric"
          onChangeText={newData => this._updateField(label, newData)}
          value={value}
        />
      </View>
    )
  }

  _textareaType(label, data) {
    const value = data != undefined ? data : ''
    return (
      <View style={customFormStyles.fieldContainer}>
        <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        <TextInput
          autoCapitalize="sentences"
          placeholder="Relevant Referral Infromation"
          placeholderTextColor="#b7b3b3"
          returnKeyType="next"
          style={customFormStyles.inputTextArea}
          multiline={true}
          textAlignVertical="top"
          numberOfLines={3}
          onChangeText={newData => this._updateField(label, newData)}
          value={value}
        />
      </View>
    )
  }

  _checkBoxType(label, formField, data) {
    const value = data != undefined ? data : ''
    return (
      <View style={customFormStyles.fieldContainer}>
        <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        {_.map(formField.values, (fieldValue, index) => {
          return (
            <View key={index} style={customFormStyles.row}>
              <CheckBox
                title={fieldValue.label}
                checkedIcon="check-square-o"
                uncheckedIcon="square-o"
                checkedColor="#009999"
                style={customFormStyles.checkBox}
                onPress={() => this._updateMultipleSelect(label, fieldValue.label)}
                checked={value.includes(fieldValue.label) ? true : false}
              />
            </View>
          )
        })}
      </View>
    )
  }

  _radioType(label, formField, data) {
    return (
      <View style={customFormStyles.fieldContainer}>
        <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        {_.map(formField.values, (fieldValue, index) => {
          return (
            <View key={index} style={customFormStyles.row}>
              <CheckBox
                title={fieldValue.label}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor="#009999"
                style={{ backgroundColor: 'transparent' }}
                onPress={() => this._updateField(label, fieldValue.label)}
                checked={data == fieldValue.label ? true : false}
              />
            </View>
          )
        })}
      </View>
    )
  }

  _renderParagraph(label) {
    return (
      <View style={customFormStyles.fieldContainer}>
        <Text style={[customFormStyles.label, customFormStyles.labelMargin, { color: '#000' }]}>{label}</Text>
      </View>
    )
  }

  _selectType(label, formField, data) {
    const value = data != undefined ? data : ''
    return (
      <View style={customFormStyles.fieldContainer}>
        <Text style={[customFormStyles.label, customFormStyles.labelMargin]}>{label}</Text>
        <SectionedMultiSelect
          items={this.listItems(formField.values)}
          uniqueKey="id"
          modalWithSafeAreaView
          selectText={i18n.t('select_option')}
          searchPlaceholderText={i18n.t('search')}
          confirmText={i18n.t('confirm')}
          showDropDowns={true}
          single={true}
          hideSearch={false}
          showCancelButton={true}
          styles={{
            button: { backgroundColor: MAIN_COLOR },
            cancelButton: { width: 150 },
            chipText: { maxWidth: 280 },
            selectToggle: { marginTop: 5, marginBottom: 5, paddingHorizontal: 10, paddingVertical: 12, borderRadius: 4 }
          }}
          onSelectedItemsChange={itemValue => this._updateField(label, itemValue[0])}
          selectedItems={[value]}
        />
      </View>
    )
  }

  _fileUploader(label, formField, data) {
    return (
      <View style={[customFormStyles.fieldContainer, { marginTop: 10 }]}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#dedede',
            alignItems: 'center',
            padding: 4
          }}
        >
          <Text style={[customFormStyles.label, customFormStyles.labelMargin, { flex: 1 }]}>{label}</Text>
          <Icon name="add-circle" size={22} color="#fff" onPress={() => this._uploader(label, formField, data)} />
        </View>
        {_.map(data, (attachment, index) => {
          if (attachment.name != undefined) {
            const name = attachment.name.substring(0, 16)
            return (
              <View key={index} style={customFormStyles.attachmentWrapper}>
                <Image style={{ width: 40, height: 40 }} source={{ uri: attachment.uri }} />
                <Text style={customFormStyles.listAttachments}>{name}...</Text>
                <TouchableWithoutFeedback onPress={() => this._removeAttactment(data, index, label)}>
                  <View style={customFormStyles.deleteAttactmentWrapper}>
                    <Icon color="#fff" name="delete" size={25} />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            )
          }
        })}
      </View>
    )
  }

  _removeAttactment(data, attachment, label) {
    let { field_properties } = this.state
    const updatedAttachment = _.filter(data, (file, index) => {
      return index != attachment
    })

    field_properties[label] = updatedAttachment
    this.setState(field_properties)
  }

  _selectAllFile(label, formField, data) {
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.allFiles()]
      },
      (error, res) => {
        if (error === null && res.uri != null) {
          let type = res.fileName.substring(res.fileName.lastIndexOf('.') + 1)
          if ('jpg jpeg png doc docx xls xlsx pdf'.includes(type)) {
            this.handleSelectedFile(res, label, formField, data)
          } else {
            this.setState({ error: res.fileName })
          }
        }
      }
    )
  }

  _uploader(label, formField, data) {
    if (disabledUpload()) {
      Alert.alert(
        'Warning',
        'OSCaR Mobile does not yet support File Upload to Program Stream forms. Please save your form and upload the file on oscarhq.com'
      )
    } else {
      ImagePicker.showImagePicker(options, response => {
        if (response.didCancel) {
        } else if (response.error) {
          alert('ImagePicker Error: ', response.error)
        } else if (response.customButton) {
          this._selectAllFile(label, formField, data)
        } else if (response.didCancel) {
        } else {
          this.handleSelectedFile(response, label, formField, data)
        }
      })
    }
  }

  handleSelectedFile(response, label, formField, data) {
    let { field_properties } = this.state
    const fileSize = response.fileSize

    if (this.state.fileSize + fileSize / 1024 <= MAX_SIZE) {
      const filePath = response.path != undefined ? `file://${response.path}` : response.uri
      const source = {
        path: filePath,
        uri: response.uri,
        name: response.fileName,
        type: response.type,
        size: fileSize / 1024
      }

      field_properties[label] = formField.multiple != undefined && formField.multiple ? field_properties[label].concat(source) : [source]
      this.setState({ fileSize: this.state.fileSize + fileSize / 1024, field_properties: field_properties })
    } else {
      Alert.alert('Upload file is reach limit', 'We allow only 5MB upload per request.')
    }
    this.setState({ error: null })
  }

  _alertFileTypeNotAllow() {
    if (this.state.error != null) {
      Alert.alert(
        'Warning',
        `Invalid extension for file "${this.state.error}". Only "jpg, png, jpeg, doc, docx, xls, xlsx, pdf" files are supported.`,
        [{ text: 'OK', onPress: () => this.setState({ error: null }) }],
        { cancelable: false }
      )
    }
  }

  render() {
    const { tracking, action } = this.props
    const { field_properties } = this.state

    const fields = action == 'create' ? tracking.fields : tracking.tracking_field
    return (
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: '#fff' }}>
        <View style={customFormStyles.aboutClientContainer}>
          {_.map(fields, (formField, index) => {
            const fieldType = formField.type
            const label = formField.label
            return (
              <View key={index}>
                {fieldType == 'text' && this._textType(label, field_properties[label], formField)}
                {fieldType == 'number' && this._numberType(label, field_properties[label])}
                {fieldType == 'textarea' && this._textareaType(label, field_properties[label])}
                {fieldType == 'date' && this._datePickerType(label, field_properties[label])}
                {fieldType == 'checkbox-group' && this._checkBoxType(label, formField, field_properties[label])}
                {fieldType == 'radio-group' && this._radioType(label, formField, field_properties[label])}
                {fieldType == 'select' && formField.multiple && this._checkBoxType(label, formField, field_properties[label])}
                {fieldType == 'select' && !formField.multiple && this._selectType(label, formField, field_properties[label])}
                {fieldType == 'file' && this._fileUploader(label, formField, field_properties[label])}
                {fieldType == 'paragraph' && this._renderParagraph(label)}
                {fieldType == 'separateLine' && <Divider style={{ backgroundColor: '#ccc', marginTop: 20 }} />}
              </View>
            )
          })}
        </View>
      </ScrollView>
    )
  }
}

const mapDispatch = {
  createTrackingForm,
  updateTrackingForm
}

export default connect(
  null,
  mapDispatch
)(TrackingForm)
