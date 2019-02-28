import React, { Component } from 'react'
import { View, Text, TextInput, Picker, StyleSheet, ScrollView, Dimensions } from 'react-native'
import { Button, CheckBox, Icon } from 'react-native-elements'
import LabelSelect from 'react-native-label-select'
import _ from 'lodash'

export default class QuantitiveCase extends Component {
  constructor(props) {
    super(props)
    const { client, quantitativeType } = props
    let arrs = []

    if (client.quantitative_cases.length > 0) {
      _.map(client.quantitative_cases, c_case => {
        _.map(c_case.client_quantitative_cases, client_case => {
          _.map(quantitativeType.quantitative_cases, quantitative_case => {
            if (c_case.quantitative_type == quantitativeType.name) {
              if (quantitative_case.value == client_case) {
                arrs = arrs.concat(_.extend({}, quantitative_case, { isSelected: true }))
              } else {
                arrs = arrs.concat(_.extend({}, quantitative_case, { isSelected: false }))
              }
            } else {
              arrs = arrs.concat(_.extend({}, quantitative_case, { isSelected: false }))
            }
          })
        })
      })
    } else if (quantitativeType.quantitative_cases != undefined) {
      _.map(quantitativeType.quantitative_cases, quantitative_case => {
        arrs = arrs.concat(_.extend({}, quantitative_case, { isSelected: false }))
      })
    }

    this.state = {
      quantitatives: arrs,
      quantitative_case_ids: []
    }
  }

  selectConfirm(list) {
    let { quantitatives } = this.state
    for (let item of list) {
      let index = quantitatives.findIndex(ele => ele === item)
      if (~index) {
        quantitatives[index].isSelected = true
      } else {
        continue
      }
    }

    let filterQuantitatives = _.filter(quantitatives, function(quantitative) {
      return quantitative.isSelected
    })

    const quantitativesID = _.map(filterQuantitatives, 'id')
    this.setState({ quantitatives: quantitatives, quantitative_case_ids: quantitativesID })
    this.props._setQuantitativeCases(quantitativesID)
  }

  deleteItem(list) {
    let { quantitatives, quantitative_case_ids } = this.state
    let index = quantitatives.findIndex(ele => ele === list)
    if (~index) {
      quantitatives[index].isSelected = false
    }

    const newIDs = _.remove(quantitative_case_ids, function(quantitative_case) {
      return quantitative_case == list.id
    })

    this.setState({ quantitatives: quantitatives, quantitative_case_ids: newIDs })
    this.props._removeQuantitativeCase(list.id)
  }

  render() {
    const { quantitatives } = this.state
    return (
      <LabelSelect
        ref="labelSelect"
        title="Quantitative Cases"
        enable={true}
        enableAddBtn={true}
        confirmText="Confirm"
        cancelText="Cancel"
        readOnly={false}
        onConfirm={list => this.selectConfirm(list)}
        cancelButton={{ color: 'red', backgroundColor: 'red' }}
        customStyle={{ cancelText: { color: '#000' }, cancelButton: { backgroundColor: '#eee' } }}
      >
        {quantitatives
          .filter(item => item.isSelected)
          .map((item, index) => (
            <LabelSelect.Label
              customStyle={{ text: { lineHeight: 16 } }}
              key={'label-' + index}
              data={item}
              onCancel={() => {
                this.deleteItem(item)
              }}
            >
              {item.value}
            </LabelSelect.Label>
          ))}

        {_.uniqBy(quantitatives, 'id')
          .filter(item => !item.isSelected)
          .map((item, index) => (
            <LabelSelect.ModalItem key={'modal-item-' + index} data={item}>
              {item.value}
            </LabelSelect.ModalItem>
          ))}
      </LabelSelect>
    )
  }
}
