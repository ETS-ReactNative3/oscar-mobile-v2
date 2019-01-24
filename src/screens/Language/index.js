import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
  AsyncStorage
} from 'react-native'
import configureStore from '../../redux/store'
import { LANGUAGE_TYPES } from '../../redux/types'
// import DropdownAlert from 'react-native-dropdownalert'

var store = configureStore()
const { width } = Dimensions.get('window')

class LanguageScreen extends Component {
  state = {
    currentLanguage: this.props.language
  }

  updateLanguage(language) {
    store.dispatch({
      type: LANGUAGE_TYPES.SET_LANGUAGE,
      language
    })
    AsyncStorage.setItem('language', language)
    this.setState({ currentLanguage: language })

    // this.dropdown.alertWithType(
    //   'success',
    //   'Message',
    //   `You’ve switched your language to ${language == 'km' ? 'ខ្មែរ' : language == 'en' ? 'English' : 'Burmese'}`
    // )
  }

  getLanguageObject = {
    en: {
      title: 'English',
      flag: require('../../assets/en.png')
    },
    km: {
      title: 'ភាសាខ្មែរ',
      flag: require('../../assets/km.png')
    },
    my: {
      title: 'မြန်မာစာ',
      flag: require('../../assets/my.png')
    },
  }

  renderLanguageButton = (abbr) => {
    const isActive = abbr === this.state.currentLanguage

    return (
      <TouchableOpacity onPress={ () => this.updateLanguage(abbr) }>
        <View style={[ styles.languageWrapper, isActive ? styles.active : {} ]}>
          <Text style={[ styles.languageTitle, isActive ? styles.activeText : {} ]}>
            { this.getLanguageObject[abbr].title }
          </Text>
          <Image source={ this.getLanguageObject[abbr].flag } style={ styles.flag }/>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    console.log(this.props.language)
    return (
      <View style={ styles.container }>
        { this.renderLanguageButton('en') }
        { this.renderLanguageButton('km') }
        { this.renderLanguageButton('my') }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  languageWrapper: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#ddd'
  },
  languageTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  flag: {
    width: 50,
    height: 35
  },
  active: {
    backgroundColor: '#009999'
  },
  activeText: {
    color: '#fff'
  }
})

const mapState = (state) => ({
  language: state.language.language
})

export default connect(mapState)(LanguageScreen)
