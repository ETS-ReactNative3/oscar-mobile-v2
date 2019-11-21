import React, { Component }                     from 'react'
import ImagePicker                              from 'react-native-image-picker'
import { connect }                              from 'react-redux'
import _                                        from 'lodash'
import { 
  View, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView,
  TouchableHighlightBase,
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
import { fetchClients }                         from 'src/redux/actions/clients'
import { fetchBirthProvinces }                         from 'src/redux/actions/birthProvinces'
import { fetchReferralSourceCategories }                         from 'src/redux/actions/referralSourceCategories'

class getStarted extends Component {
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
    nameOfReferee: '',
    refereePhoneNumber: '',
    photos: [],

    errors: {},
  }

  componentDidMount() {
    this.props.fetchClients()
    this.props.fetchBirthProvinces()
    this.props.fetchReferralSourceCategories()
  }

  handleInputChange = (text, name) => {
    this.setState({ [name]: text, errors: {[name]: ""} })
  }

  handleSubmit = () => {
    let {
      referralReceivedBy,
      firstFollowUpBy,
      caseWorkerStaff,
      initalReferalDate,
      firstFollowUpDate,
      gender,
      referralSourceCategory,
      nameOfReferee,
    } = this.state
    
    let errors = {}
    
    if(_.isEmpty(referralReceivedBy))
      errors.referralReceivedBy = "Can't be blank"

    if(_.isEmpty(firstFollowUpBy))
      errors.firstFollowUpBy = "Can't be blank"

    if(_.isEmpty(caseWorkerStaff))
      errors.caseWorkerStaff = "Can't be blank"

    if(_.isEmpty(initalReferalDate))
      errors.initalReferalDate = "Can't be blank"

    if(_.isEmpty(firstFollowUpDate))
      errors.firstFollowUpDate = "Can't be blank"

    if(_.isEmpty(gender))
      errors.gender = "Can't be blank"

    if(_.isEmpty(referralSourceCategory))
      errors.referralSourceCategory = "Can't be blank"

    if(_.isEmpty(nameOfReferee))
      errors.nameOfReferee = "Can't be blank"
    
    if(_.every(_.values(errors)))
      this.props.handleGoToNextTab()
    
    console.log("The errors is ", errors);
    
    this.setState({ errors })
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

  genderTypes = () => ([
    {id: 'male', name: 'Male'}, 
    {id: 'female', name: 'Female'}, 
    {id: 'other', name: 'Other'}, 
    {id: 'unknown', name: 'Unknown'}
  ])

  birthProvincesTypes = () => {
    let { birthProvinces } = this.props

    return _.map(birthProvinces, (bp, index) => {
      return ({
        id: index,
        name: bp.country,
        children: _.map(bp.provinces, p => ({id: p.id, name: p.name}))
      })
    })
  }

  referralSourceCategoriesTypes = () => {
    let { referralSourceCategories } = this.props

    return _.map(referralSourceCategories, category => ({id: category.id, name: category.name}))
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

  userTypes = () => {
    let { users } = this.props
    return (
      _.map(
        _.values(users), 
        user => ({
          id: user.id, 
          name: `${user.first_name} ${user.last_name}`
        })
      )
    )
  }

  render() {
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
                items={this.userTypes()}
                selectedItems={this.state.referralReceivedBy}
                onSelectedItemsChange={ ReferalReceivedByName => this.handleSelectChange(ReferalReceivedByName, "referralReceivedBy") }
                required={true}
                single={true}
                error={this.state.errors.referralReceivedBy}
              />

              <FormSelect 
                label="First Follow-Up By"
                single={true}
                items={this.userTypes()}
                selectedItems={this.state.firstFollowUpBy}
                onSelectedItemsChange={ followUpName => this.handleSelectChange(followUpName, "firstFollowUpBy") }
                required={true}
                error={this.state.errors.firstFollowUpBy}
              />

              <FormSelect 
                label="Case Worker / Staff"
                items={this.userTypes()}
                selectedItems={this.state.caseWorkerStaff}
                onSelectedItemsChange={ caseWorker => this.handleSelectChange(caseWorker, "caseWorkerStaff") }
                required={true}
                error={this.state.errors.caseWorkerStaff}
              />

              <FormInputDate
                label="Initial Referral Date"
                date={this.state.initalReferalDate}
                onDateChange={date => this.setState({initalReferalDate: date})}
                required={true}
                error={this.state.errors.initalReferalDate}
              />

              <FormInputDate
                label="First Follow-Up Date"
                date={this.state.firstFollowUpDate}
                onDateChange={date => this.setState({firstFollowUpDate: date})}
                required={true}
                error={this.state.errors.firstFollowUpDate}
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
                items={this.genderTypes()}
                selectedItems={this.state.gender}
                onSelectedItemsChange={ g => this.handleSelectChange(g, "gender") }
                required={true}
                single={true}
                error={this.state.errors.gender}
              />

              <FormInputDate
                label="Date of birth"
                date={this.state.dateOfBirth}
                onDateChange={date => this.setState({dateOfBirth: date})}
              />

              <FormSelect 
                label="Birth Province"
                items={this.birthProvincesTypes()}
                selectedItems={this.state.birthProvince}
                onSelectedItemsChange={ province => this.handleSelectChange(province, "birthProvince") }
                single={true}
              />

              <FormSelect 
                label="Referral Source Category"
                items={this.referralSourceCategoriesTypes()}
                selectedItems={this.state.referralSourceCategory}
                onSelectedItemsChange={ category => this.handleSelectChange(category, "referralSourceCategory") }
                required={true}
                single={true}
                error={this.state.errors.referralSourceCategory}
              />

              <FormInput 
                onChangeText={text => this.handleInputChange(text, "nameOfReferee")}
                value={this.state.nameOfReferee}
                label="Name of Referee"
                placeholder="Name of Referee"
                required={true}
                error={this.state.errors.nameOfReferee}
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
                  onPress={() => this.handleSubmit()}
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

const mapState = (state) => ({
  users: state.users.data,
  birthProvinces: state.birthProvinces.data,
  referralSourceCategories: state.referralSourceCategories.data
})

const mapDispatch = () => ({
  fetchClients,
  fetchBirthProvinces,
  fetchReferralSourceCategories,
})

export default connect(mapState, mapDispatch)(getStarted);