import React, { Component } from 'react'
import { View, Text, TextInput, Picker, StyleSheet, ScrollView, Dimensions } from 'react-native'
import { Button, CheckBox, Icon } from 'react-native-elements'
import LabelSelect from 'react-native-label-select'
import _ from 'lodash'

export default class CaseWorker extends Component {
  constructor(props) {
    super(props)
    const { client, users } = props
    let arrs = []

    if (client.case_workers.length > 0) {
      _.map(client.case_workers, case_worker => {
        _.map(users, user => {
          if (user.id == case_worker.id) {
            arrs = arrs.concat(_.extend({}, user, { isSelected: true }))
          } else {
            arrs = arrs.concat(_.extend({}, user, { isSelected: false }))
          }
        })
      })
    } else if (users != undefined) {
      _.map(users, user => {
        arrs = arrs.concat(_.extend({}, user, { isSelected: false }))
      })
    }

    this.state = {
      case_workers: arrs,
      user_ids: []
    }
  }

  selectConfirm(list) {
    let { case_workers } = this.state
    for (let item of list) {
      let index = case_workers.findIndex(ele => ele === item)
      if (~index) {
        case_workers[index].isSelected = true
      } else {
        continue
      }
    }

    let filterCaseWorkers = _.filter(case_workers, quantitative => {
      return quantitative.isSelected
    })

    const case_workersID = _.map(filterCaseWorkers, 'id')
    this.setState({ case_workers: case_workers, user_ids: case_workersID })
    this.props._setCaseWorkers(case_workersID)
  }

  deleteItem(list) {
    let { case_workers, user_ids } = this.state
    let index = case_workers.findIndex(ele => ele === list)
    if (~index) {
      case_workers[index].isSelected = false
    }

    const newIDs = _.remove(user_ids, function(case_workder_id) {
      return case_workder_id == list.id
    })

    this.setState({ case_workers: case_workers, user_ids: newIDs })
    this.props._removeCaseWorkers(list.id)
  }

  render() {
    const { case_workers } = this.state

    return (
      <LabelSelect
        ref="labelSelect"
        title="Users"
        enable={true}
        enableAddBtn={true}
        readOnly={false}
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={list => this.selectConfirm(list)}
        cancelButton={{ color: 'red', backgroundColor: 'red' }}
        customStyle={{ cancelText: { color: '#000' }, cancelButton: { backgroundColor: '#eee' } }}
      >
        {case_workers
          .filter(item => item.isSelected)
          .map((item, index) => {
            const name = `${item.first_name} ${item.last_name}`
            return (
              <LabelSelect.Label
                customStyle={{ text: { lineHeight: 16 } }}
                key={'label-' + index}
                data={item}
                onCancel={() => {
                  this.deleteItem(item)
                }}
              >
                {name}
              </LabelSelect.Label>
            )
          })}

        {_.uniqBy(case_workers, 'id')
          .filter(item => !item.isSelected)
          .map((item, index) => {
            const name = `${item.first_name} ${item.last_name}`
            return (
              <LabelSelect.ModalItem key={'modal-item-' + index} data={item}>
                {name}
              </LabelSelect.ModalItem>
            )
          })}
      </LabelSelect>
    )
  }
}
