import React, { Component } from 'react'
import LabelSelect from 'react-native-label-select'
import _ from 'lodash'

export default class Agencies extends Component {
  constructor(props) {
    super(props)

    const { client, agencies } = props
    let arrs = []

    if (client.agencies.length > 0) {
      _.map(client.agencies, c_agency => {
        _.map(agencies.agencies, agency => {
          if (agency.id == c_agency.id) {
            arrs = arrs.concat(_.extend({}, agency, { isSelected: true }))
          } else {
            arrs = arrs.concat(_.extend({}, agency, { isSelected: false }))
          }
        })
      })
    } else if (agencies != undefined) {
      _.map(agencies, agency => {
        arrs = arrs.concat(_.extend({}, agency, { isSelected: false }))
      })
    }

    this.state = {
      agencies: arrs,
      agencies_id: []
    }
  }

  selectConfirm(list) {
    let { agencies } = this.state
    for (let item of list) {
      let index = agencies.findIndex(ele => ele === item)
      if (~index) {
        agencies[index].isSelected = true
      } else {
        continue
      }
    }

    let filterAgencies = _.filter(agencies, function(agency) {
      return agency.isSelected
    })

    const agenciesID = _.map(filterAgencies, 'id')

    this.setState({ agencies: agencies, agencies_id: agenciesID })
    this.props.updateClientState('agency_ids', agenciesID)
  }

  deleteItem(list) {
    let { agencies, agencies_id } = this.state
    let index = agencies.findIndex(ele => ele === list)
    agencies[index].isSelected = false

    let filterAgencies = _.filter(agencies, function(agency) {
      return agency.isSelected
    })

    const agenciesID = _.map(filterAgencies, 'id')

    _.remove(agencies_id, function(agency) {
      return agency == list.id
    })

    this.setState({ agencies: agencies })
    this.props.updateClientState('agency_ids', agenciesID)
  }
  render() {
    const { agencies } = this.state
    return (
      <LabelSelect
        ref="labelSelect"
        title="Agencies"
        enable={true}
        enableAddBtn={true}
        confirmText="Confirm"
        readOnly={false}
        cancelText="Cancel"
        onConfirm={list => this.selectConfirm(list)}
        customStyle={{ cancelText: { color: '#000' }, cancelButton: { backgroundColor: '#eee' } }}
      >
        {agencies
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

        {agencies
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
