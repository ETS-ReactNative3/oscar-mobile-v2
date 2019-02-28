import React, { Component } from 'react'
import LabelSelect from 'react-native-label-select'
import _ from 'lodash'

export default class Donors extends Component {
  constructor(props) {
    super(props)

    const { client, donors } = props
    let arrs = []

    if (client.donors.length > 0) {
      _.map(client.donors, c_donor => {
        _.map(donors.donors, donor => {
          if (donor.id == c_donor.id) {
            arrs = arrs.concat(_.extend({}, donor, { isSelected: true }))
          } else {
            arrs = arrs.concat(_.extend({}, donor, { isSelected: false }))
          }
        })
      })
    } else if (donors != undefined) {
      _.map(donors, donor => {
        arrs = arrs.concat(_.extend({}, donor, { isSelected: false }))
      })
    }

    this.state = {
      donors: arrs,
      donors_id: []
    }
  }

  selectConfirm(list) {
    let { donors } = this.state
    for (let item of list) {
      let index = donors.findIndex(ele => ele === item)
      if (~index) {
        donors[index].isSelected = true
      } else {
        continue
      }
    }

    let filterDonors = _.filter(donors, function(donor) {
      return donor.isSelected
    })

    const donorsID = _.map(filterDonors, 'id')

    this.setState({ donors: donors, donors_id: donorsID })
    this.props.updateClientState('donor_ids', donorsID)
  }

  deleteItem(list) {
    let { donors, donors_id } = this.state
    let index = donors.findIndex(ele => ele === list)
    donors[index].isSelected = false

    let filterDonors = _.filter(donors, function(donor) {
      return donor.isSelected
    })

    const donorsID = _.map(filterDonors, 'id')

    _.remove(donors_id, function(donor) {
      return donor == list.id
    })

    this.setState({ donors: donors })
    this.props.updateClientState('donor_ids', donorsID)
  }
  render() {
    const { donors } = this.state
    return (
      <LabelSelect
        ref="labelSelect"
        title="Donors"
        enable={true}
        enableAddBtn={true}
        confirmText="Confirm"
        readOnly={false}
        cancelText="Cancel"
        onConfirm={list => this.selectConfirm(list)}
        customStyle={{ cancelText: { color: '#000' }, cancelButton: { backgroundColor: '#eee' } }}
      >
        {donors
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
              {item.name}
            </LabelSelect.Label>
          ))}

        {donors
          .filter(item => !item.isSelected)
          .map((item, index) => (
            <LabelSelect.ModalItem key={'modal-item-' + index} data={item}>
              {item.name}
            </LabelSelect.ModalItem>
          ))}
      </LabelSelect>
    )
  }
}
