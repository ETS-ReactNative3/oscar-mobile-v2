import React, { Component } from 'react'
import { startScreen }       from '../../navigation/config'
import CryptoJS from 'crypto-js'
import { connect } from 'react-redux'
import { updatePin } from '../../redux/actions/auth'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'
import PinCode from '../../components/pin'

class Pin extends Component {
  state = {
    pinCode: this.props.pinCode,
    pinTitle: this.props.pinTitle,
    pinMode: this.props.pinMode
  }

  verifyCode = (code, clear, vibration) => {
    const { pinMode, pinCode  } = this.state

    if (pinMode == 'set') {
      this.setState({
        pinCode:  CryptoJS.SHA3(code),
        pinTitle: 'Confirm Your Pin Code',
        pinMode: 'confirm'
      })
      clear()
    } else {
      const newCode = String(CryptoJS.SHA3(code))
      const oldCode = String(pinCode)

      if (newCode == oldCode) {
        if (pinMode == 'compare') {
          setTimeout(function () {
            startScreen('oscar.ngos')
          }, 200)
        } else {
          this.props.updatePin(code)
        }
      } else {
        vibration()
        clear()
      }
    }
  }


  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.title}>{this.state.pinTitle}</Text>
        <PinCode Size={5} eventCode={this.verifyCode} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#009999'
  },
  title: {
    fontSize: 24,
    color: '#fff',
    paddingBottom: 50
  }
})

const mapDispatch = {
  updatePin
}

export default connect(null, mapDispatch)(Pin)
