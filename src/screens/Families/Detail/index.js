import React, { Component }       from 'react'
import { connect }                from 'react-redux'
import { View, ScrollView }       from 'react-native'
import { Navigation }             from 'react-native-navigation'
import { pushScreen }             from '../../../navigation/config'
import { upperCase }              from 'lodash'
import moment                     from 'moment'
import i18n                       from '../../../i18n'
import appIcon                    from '../../../utils/Icon'
import styles                     from '../../Clients/Detail/styles'
import Menu                       from '../../Clients/Detail/Menu'
import Card                       from '../../../components/Card'
import Field                      from '../../../components/Field'
import DropdownAlert              from 'react-native-dropdownalert'
class FamilyDetail extends Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
  }

  async navigationButtonPressed({ buttonId }) {
    if (buttonId === 'EDIT_FAMILY') {
      const { family } = this.props
      const icons = await appIcon()
      pushScreen(this.props.componentId, {
        screen: 'oscar.editFamily',
        title: 'EDIT FAMILY',
        props: {
          family,
          familyDetailComponentId: this.props.componentId,
          alertMessage: () => this.alertMessage('Family has been successfully updated.')
        },
        rightButtons: [
          {
            id: 'SAVE_FAMILY',
            icon: icons.save,
            color: '#fff'
          }
        ]
      })
    }
  }

  alertMessage = message => {
    this.refs.dropdown.alertWithType('success', 'Success', message)
  }

  navigateToAdditionalForms = family => {
    pushScreen(this.props.componentId, {
      screen: 'oscar.additionalForms',
      title: 'Additional Form',
      props: {
        entityId: family.id,
        type: 'family'
      }
    })
  }

  navigateToAddForms = family => {
    pushScreen(this.props.componentId, {
      screen: 'oscar.addForms',
      title: 'Add Form',
      props: {
        entityId: family.id,
        entityDetailComponentId: this.props.componentId,
        type: 'family',
        alertMessage: () => this.alertMessage('Custom Field Properties has been successfully created.')
      }
    })
  }

  serializeAddress = (field, value) => {
    return value ? `${field} ${value}`.trim() : null
  }

  address = () => {
    const { family, setting } = this.props
    const villageName = family.village && `${family.village.name_en} / ${family.village.name_kh}`
    const communeName = family.commune && `${family.commune.name_en} / ${family.commune.name_kh}`
    const districtName = family.district && family.district.name
    const provinceName = family.province && family.province.name
    const countryName = setting && upperCase(setting.country_name)

    const house = this.serializeAddress(i18n.t('family.house'), family.house)
    const street = this.serializeAddress(i18n.t('family.street'), family.street)

    return [house, street, villageName, communeName, districtName, provinceName, countryName].filter(Boolean).join(', ')
  }

  render() {
    const { family } = this.props
    const memberCount = family.female_children_count + family.male_children_count + family.female_adult_count + family.male_adult_count

    return (
      <View style={{ flex: 1, backgroundColor: '#EDEFF1' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.widgetContainer}>
            <View style={styles.widgetRow}>
              <Menu
                title={i18n.t('family.additional_form')}
                value={family.additional_form.length}
                color="#1c84c6"
                onPress={() => this.navigateToAdditionalForms(family)}
                disabled={family.additional_form.length == 0}
              />
              <Menu
                title={i18n.t('family.add_form')}
                value={family.add_forms.length}
                color="#1c84c6"
                onPress={() => this.navigateToAddForms(family)}
              />
            </View>
          </View>
          <Card style={{ paddingTop: 30, paddingLeft: 20, paddingRight: 20 }} title={i18n.t('family.about_family')}>
            <Field name={i18n.t('family.code')} value={family.code} />
            <Field name={i18n.t('family.case_history')} value={family.case_history} />
            <Field name={i18n.t('family.address')} value={this.address()} />
            <Field name={i18n.t('family.member_count')} value={`${memberCount} People` || '0'} />
            <Field name={i18n.t('family.caregiver_information')} value={family.caregiver_information} />
            <Field name={i18n.t('family.significant_family_member_count')} value={family.significant_family_member_count} />
            <Field name={i18n.t('family.household_income')} value={`$${parseFloat(family.household_income).toFixed(2)}`} />
            <Field name={i18n.t('family.dependable_income')} value={family.dependable_income == false ? i18n.t('family.no') : i18n.t('family.yes')} />
            <Field name={i18n.t('family.female_children_count')} value={family.female_children_count} />
            <Field name={i18n.t('family.male_children_count')} value={family.male_children_count} />
            <Field name={i18n.t('family.female_adult_count')} value={family.female_adult_count} />
            <Field name={i18n.t('family.male_adult_count')} value={family.male_adult_count} />
            <Field name={i18n.t('family.contract_date')} value={moment(family.contract_date).format('DD MMMM, YYYY')} />
            <Field name={i18n.t('family.family_type')} value={family.family_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} />
            <Field name={i18n.t('family.status')} value={family.status} />
          </Card>
        </ScrollView>
        <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
      </View>
    )
  }
}

const mapState = (state, ownProps) => ({
  family: state.families.data[ownProps.familyId],
  setting: state.setting.data,
  message: state.families.message
})

export default connect(mapState)(FamilyDetail)
