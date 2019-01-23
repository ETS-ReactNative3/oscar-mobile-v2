import React, { Component } from 'react'
import { View, Text, Image, TextInput, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import Button from 'apsl-react-native-button'
import { Navigation }  from 'react-native-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
import Button from 'apsl-react-native-button';

import { login } from '../../redux/actions/auth'
import styles from './style'

class LoginContainer extends Component {
  state = {
    email: '',
    pwd: '',
    secureTextEntry: true
  }

  _loginHandler() {
    if (this.state.email == '' || this.state.pwd == '') {
      alert('please input email/password')
    } else {
      this.props.login({ email: this.state.email, password: this.state.pwd }, this.props.navigator)
    }
  }

  render() {
    const { user, error, loading } = this.props
    const { email, pwd, secureTextEntry } = this.state

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView>
          <View style={styles.imageWrapper}>
            <Navigation.Element
              elementId={this.props.sharedImageId}
            >
              <Image
                resizeMode="contain"
                style={styles.image}
                source={{ uri: this.props.logo }}
              />
            </Navigation.Element>
          </View>
          <TextInput
            value={email}
            autoCapitalize="sentences"
            style={styles.input}
            autoFocus={true}
            keyboardType="email-address"
            placeholderTextColor="#ccc"
            placeholder="Email"
            onSubmitEditing={() => this.refs.password.focus()}
            returnKeyType="next"
            textInputRef="email"
            onChangeText={email => this.setState({ email: email })}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              value={pwd}
              autoCapitalize="sentences"
              ref="password"
              style={[styles.input, { flex: 1 }]}
              placeholderTextColor="#ccc"
              secureTextEntry={secureTextEntry}
              placeholder="Password"
              textInputRef="password"
              returnKeyType="done"
              onSubmitEditing={() => this._loginHandler()}
              onChangeText={pwd => this.setState({ pwd: pwd })}
            />
            <Icon
              onPress={() => this.setState({ secureTextEntry: !this.state.secureTextEntry })}
              name={ this.state.secureTextEntry ? 'ios-eye' : 'ios-eye-off'  }
              size={30}
              style={{position: 'absolute', right: 6, top: 6}}
            />
          </View>
          <Button
            loading={loading}
            isDisabled={loading}
            style={styles.loginButton}
            textStyle={{ color: '#fff' }}
            onPress={() => this._loginHandler()}>
            LOGIN
          </Button>
          {error != ''
            ? <Text style={styles.error}>
                {error}
              </Text>
            : null}
        </KeyboardAvoidingView>
      </View>
    )
  }
}


const mapState = (state) => ({
  user: state.auth.data,
  loading: state.auth.loading,
  error: state.auth.error
})


const mapDispatch = {
  login
}

export default connect(mapState, mapDispatch)(LoginContainer)
