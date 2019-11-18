import React, { Component }                     from 'react'
import ImagePicker                              from 'react-native-image-picker'
import { 
  Text, 
  View, 
  TextInput,
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView,
  TouchableHighlightBase
} from 'react-native'

import { 
  Form, 
  FormInput, 
  FormSelect, 
  FormInputDate, 
  FormInputFile }                               from 'src/components/Form'
import Layout                                   from 'src/components/Layout'
import { MAX_SIZE, options }                    from 'src/constants/option'
import {NextButton}                             from './controllButton'
import Header                                   from './header'

export default class getStarted extends Component {
  state = {
    referralReceivedBy: [],
    firstFollowUpBy: [],
    caseWorkerStaff: [],
    initalReferalDate: '',
    firstFollowUpDate: '',

    givenNameEnglish: '',
    familyNameEnglish: '',
    givenNameKhmer: '',
    familyNameKhmer: '',
    gender: [],
    dateOfBirth: '',
    birthProvince: [],
    referralSourceCategory: [],
    referralSource: [],
    nameOfReferee: '',
    refereePhoneNumber: '',
    photos: []
  }

  ReferalReceivedByNames = () => {
    return (
      [
        { id: 'Admin 1', name: 'Admin 1' },
        { id: 'Admin 2', name: 'Admin 2' },
      ]
    )
  }

  handleInputChange = (text, name) => {
    this.setState({ [name]: text })
  }

  handleSubmit = () => {
    console.log("The state is ", this.state)
  }

  handleSelectChange = (value, name) => {
    this.setState({ [name]: value })
  }

  handleMultipleSelectChange = (value, name) => {
    this.setState({ [name]: value })
  }

  uploadAttachment = () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.error) {
        alert('ImagePicker Error: ', response.error)
      } else if (response.customButton) {
        this.selectAllFile()
      } else if (response.didCancel) {
      } else {
        this.handleSelectedFile(response)
      }
    })
  }
  selectAllFile = () => {
    DocumentPicker.show(
      {
        filetype: [DocumentPickerUtil.allFiles()]
      },
      (error, res) => {
        if (error === null && res.uri != null) {
          const type = res.fileName.substring(res.fileName.lastIndexOf('.') + 1)
          if ('jpg jpeg png doc docx xls xlsx pdf'.includes(type)) {
            this.handleSelectedFile(res)
          } else {
            Alert.alert('Invalid file type', 'Allow only : jpg jpeg png doc docx xls xlsx pdf')
          }
        }
      }
    )
  }

  handleSelectedFile = (response) => {
    let { photos } = this.state
    const filePath = response.path != undefined ? `file://${response.path}` : response.uri
    const fileSize = response.fileSize / 1024
    const source = {
      uri: response.uri,
      path: filePath,
      name: response.fileName,
      type: response.type,
      size: fileSize
    }

    photos = source

    if (fileSize > MAX_SIZE)
      return Alert.alert('Upload file is reach limit', 'We allow only 30MB upload per request.')
      
    this.setState({ photos })
  }

  render() {
    const {handleGoToNextTab} = this.props
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Layout>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            
            <Form>

              <Header 
                title="Staff Responsibilities"
              />

              <FormSelect 
                label="Referral Received By"
                items={this.ReferalReceivedByNames()}
                selectedItems={this.state.referralReceivedBy}
                onSelectedItemsChange={ ReferalReceivedByName => this.handleSelectChange(ReferalReceivedByName, "referralReceivedBy") }
                required={true}
                single={true}
              />

              <FormSelect 
                label="First Follow-Up By"
                single={true}
                items={this.ReferalReceivedByNames()}
                selectedItems={this.state.firstFollowUpBy}
                onSelectedItemsChange={ followUpName => this.handleSelectChange(followUpName, "firstFollowUpBy") }
                required={true}
              />

              <FormSelect 
                label="Case Worker / Staff"
                items={this.ReferalReceivedByNames()}
                selectedItems={this.state.caseWorkerStaff}
                onSelectedItemsChange={ caseWorker => this.handleSelectChange(caseWorker, "caseWorkerStaff") }
                required={true}
              />

              <FormInputDate
                label="Initial Referral Date"
                date={this.state.initalReferalDate}
                onDateChange={date => this.setState({initalReferalDate: date})}
                required={true}
              />

              <FormInputDate
                label="First Follow-Up Date"
                date={this.state.firstFollowUpDate}
                onDateChange={date => this.setState({firstFollowUpDate: date})}
                required={true}
              />

              <Header 
                title="Referral Information"
              />

              <FormInput 
                onChangeText={text => this.handleInputChange(text, "givenNameEnglish")}
                value={this.state.givenNameEnglish}
                label="Given Name (Latin)"
                placeholder="Given Name (Latin)"
              />

              <FormInput 
                onChangeText={text => this.handleInputChange(text, "familyNameEnglish")}
                value={this.state.familyNameEnglish}
                label="Family Name (Latin)"
                placeholder="Family Name (Latin)"
              />

              <FormInput 
                onChangeText={text => this.handleInputChange(text, "givenNameKhmer")}
                value={this.state.givenNameKhmer}
                label="Given Name (Khmer)"
                placeholder="Given Name (Khmer)"
              />

              <FormInput 
                onChangeText={text => this.handleInputChange(text, "familyNameKhmer")}
                value={this.state.familyNameKhmer}
                label="Family Name (Khmer)"
                placeholder="Family Name (Khmer)"
              />

              <FormSelect 
                label="Gender"
                items={this.ReferalReceivedByNames()}
                selectedItems={this.state.gender}
                onSelectedItemsChange={ g => this.handleSelectChange(g, "gender") }
                required={true}
                single={true}
              />

              <FormInputDate
                label="Date of birth"
                date={this.state.dateOfBirth}
                onDateChange={date => this.setState({dateOfBirth: date})}
              />

              <FormSelect 
                label="Birth Province"
                items={this.ReferalReceivedByNames()}
                selectedItems={this.state.birthProvince}
                onSelectedItemsChange={ province => this.handleSelectChange(province, "birthProvince") }
                single={true}
              />

              <FormSelect 
                label="Referral Source Category"
                items={this.ReferalReceivedByNames()}
                selectedItems={this.state.referralSourceCategory}
                onSelectedItemsChange={ category => this.handleSelectChange(category, "referralSourceCategory") }
                required={true}
                single={true}
              />

              <FormSelect 
                label="Referral Source"
                items={this.ReferalReceivedByNames()}
                selectedItems={this.state.referralSource}
                onSelectedItemsChange={ source => this.handleSelectChange(source, "referralSource") }
                single={true}
              />
              
              <FormInput 
                onChangeText={text => this.handleInputChange(text, "nameOfReferee")}
                value={this.state.nameOfReferee}
                label="Name of Referee"
                placeholder="Name of Referee"
                required={true}
              />
              
              <FormInput 
                onChangeText={text => this.handleInputChange(text, "refereePhoneNumber")}
                value={this.state.refereePhoneNumber}
                label="Referee Phone Number"
                placeholder="Referee Phone Number"
              />

              <FormInputFile
                onPress={() => this.uploadAttachment()}
                value={this.state.photos}
                label={this.state.photos.name || "Upload Photo"}
              />

              <View style={styles.controlButtonContainer}>
                <NextButton 
                  onPress={() => this.props.handleGoToNextTab()}
                />
              </View>
            </Form>
             
          </ScrollView>
      </Layout>
      
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flex: 1,
    padding: 10,
    justifyContent: 'space-between'
  },

  controlButtonContainer: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
})