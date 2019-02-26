import React, { Component } from 'react'
import { StyleSheet, View, Image } from 'react-native'
import Modal from 'react-native-modal'
import { Button } from 'react-native-elements'

class ModalImage extends Component {
  render() {
    return (
      <Modal isVisible={this.props.isVisible} onBackButtonPress={() => this.props.hideModal()} animationOutTiming={1000}>
        <View style={styles.modalContainer}>
          <Image resizeMode="contain" source={{ uri: this.props.image }} style={styles.image} />
          <Button raised icon={{ name: 'close' }} title="Close" onPress={() => this.props.hideModal()} />
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'transparent',
    flex: 1
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined
  }
})

export default ModalImage
