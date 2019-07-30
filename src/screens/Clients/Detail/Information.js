import React, { Component }         from 'react'
import { connect }                  from 'react-redux'
import call                         from 'react-native-phone-call'
import FastImage                    from 'react-native-fast-image'
import moment                       from 'moment'
import { map, upperCase, find, chain, filter, values }     from 'lodash'
import Card                         from '../../../components/Card'
import i18n                         from '../../../i18n'
import Field                        from '../../../components/Field'
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'

class ClientInformation extends Component {
  calculateAge = () => {
    const { client } = this.props

    if (!client.date_of_birth) return ''

    const years = moment().diff(client.date_of_birth, 'years')
    const months = moment().diff(client.date_of_birth, 'months') % 12
    return this.pluralize('year', years) + ' ' + this.pluralize('month', months)
  }

  pluralize = (title, unit) => {
    if (unit === 0)
      return ''
    else if (unit === 1)
      return unit + ' ' + title
    else
      return unit + ' ' + title + 's'
  }

  serializeAddress = (field, value) => {
    return value ? `${field} ${value}`.trim() : null
  }

  address = () => {
    const { client, provinces, districts, communes, villages, setting } = this.props
    
    const village   = chain(villages).find({ id: client.village_id }).get('name')
    const commune   = chain(communes).find({ id: client.commune_id }).get('name')
    const district  = chain(districts).find({ id: client.district_id }).get('name')
    const province  = chain(provinces).find({ id: client.current_province_id }).get('name')
    const country   = setting && upperCase(setting.country_name)
    const house     = this.serializeAddress(i18n.t('client.form.house_number'), client.house_number)
    const street    = this.serializeAddress(i18n.t('client.form.street_number'), client.street_number)

    return [house, street, village, commune, district, province, country].filter(Boolean).join(', ')
  }

  referralSource = () => {
    const { referralSourceCategories, client, language } = this.props
    const referralSourceCategory      = find(referralSourceCategories, { id: client.referral_source_category_id })

    if (referralSourceCategory === undefined)
      return {}

    const referralSourceCategoryName  = language === 'km'
                                          ? referralSourceCategory.name
                                          : referralSourceCategory.name_en
    const referralSource = find(referralSourceCategory.children, { id: client.referral_source_id })



    return {
      category: referralSourceCategoryName || '',
      name: referralSource ? referralSource.name : ''
    }
  }

  birthProvinceName = () => {
    const { birthProvinces, setting, client } = this.props

    if (!client.birth_province_id)
      return ''

    const country_name  = upperCase(setting.country_name)
    const country       = find(birthProvinces, { country: country_name })
    const provinces     = country ? country.provinces : []
    const province      = find(provinces, { id: client.birth_province_id })

    return get(province, 'name')
  }

  getUserName = user =>
    user ? [user.first_name, user.last_name].filter(Boolean).join(' ') : ''

  render() {
    const { client, setting, users, donors, agencies, provinces } = this.props

    const age               = this.calculateAge()
    const address           = this.address()
    const referralSource    = this.referralSource()
    const birthProvinceName = this.birthProvinceName()
    const followedUpByName  = this.getUserName(find(users, { id: followed_up_by_id }))
    const recievedByName    = this.getUserName(find(users, { id: received_by_id }))

    // const currentProvince   = chain(provinces)
    //                             .find({ id: client.current_province_id })
    //                             .get('name')
    const currentProvince = 'hello'
    const caseWorkers       = chain(users)
                                .filter(user => client.user_ids.includes(user.id))
                                .map(this.getUserName)
    const clientDonors      = chain(donors)
                                .filter(donor => client.donor_ids.includes(donor.id))
                                .map('name')
    const clientAgencies    = chain(agencies)
                                .filter(agency => client.agency_ids.includes(agency.id))
                                .map('name')

    return (
      <View style={styles.container}>
        <Card title={i18n.t('client.about_client')}>
          {
            client.profile &&
              <FastImage
                style={styles.profile}
                source={{ uri: client.profile.uri }}
                resizeMode="contain"
              />
          }
          <Field name={i18n.t('client.form.given_name')}        value={client.given_name} />
          <Field name={i18n.t('client.form.family_name')}       value={client.family_name} />
          <Field name={i18n.t('client.form.age')}               value={age} />
          <Field name={i18n.t('client.form.date_of_birth')}     value={client.date_of_birth} />
          <Field name={i18n.t('client.form.current_province')}  value={current_province} />
          <Field name={i18n.t('client.form.code')}              value={client.code} />
          <Field name={i18n.t('client.form.kid_id')}            value={client.kid_id} />
          <Field name={i18n.t('client.form.donor')}             value={clientDonors.join(', ')} />
          <Field name={i18n.t('client.form.address')}           value={address} />
          <Field name={i18n.t('client.form.what3words')}        value={client.what3words} />
          <Field name={i18n.t('client.form.birth_province')}    value={birthProvinces} />
          <Field name={i18n.t('client.form.name_of_referee')}   value={client.name_of_referee} />
          <Field name={i18n.t('client.form.time_in_care')}      value={client.time_in_care} />
          <Field name={i18n.t('client.form.follow_up_by')}      value={followedUpByName}/>
          <Field name={i18n.t('client.form.follow_up_date')}    value={followedUpByName} />
          <Field name={i18n.t('client.form.referral_source_category_id')} value={referralSource.category} />
          <Field name={i18n.t('client.form.referral_source')}   value={referralSource.name} />
          <Field name={i18n.t('client.form.referral_phone')}>
            {
              client.referral_phone && (
                <TouchableWithoutFeedback onPress={() => call({ number: client.referral_phone, prompt: false }) }>
                  <Text style={{fontSize: 18, textDecorationLine: 'underline'}}>
                    {client.referral_phone}
                  </Text>
                </TouchableWithoutFeedback>
              )
            }
          </Field>
          <Field name={i18n.t('client.form.who_live_with')} value={client.live_with} />
          <Field name={i18n.t('client.form.telephone_number')}>
            {
              client.telephone_number && (
                <TouchableWithoutFeedback onPress={() => call({ number: client.telephone_number, prompt: false }) }>
                  <Text style={{fontSize: 18, textDecorationLine: 'underline'}}>
                    {client.telephone_number}
                  </Text>
                </TouchableWithoutFeedback>
              )
            }
          </Field>
          {
            setting.country_name === 'cambodia' &&
            <Field name={i18n.t('client.form.rated_for_id_poor')} value={client.rated_for_id_poor} />
          }
          <Field name={i18n.t('client.form.received_by')}           value={recievedByName} />
          <Field name={i18n.t('client.form.initial_referral_date')} value={client.initial_referral_date} />
          <Field name={i18n.t('client.form.school_name')}           value={client.school_name} />
          <Field name={i18n.t('client.form.school_grade')}          value={client.school_grade} />
          <Field name={i18n.t('client.form.main_school_contact')}   value={client.main_school_contact} />
          <Field name={i18n.t('client.form.has_been_orphanage')}    value={client.has_been_in_orphanage ? 'Yes' : 'No'} />
          <Field name={i18n.t('client.form.has_goverment_care')}    value={client.has_been_in_government_care ? 'Yes' : 'No'} />
          <Field name={i18n.t('client.form.relevant_referral_information')} value={client.relevant_referral_information} />
          <Field name={i18n.t('client.form.case_worker')}           value={caseWorkers.join(', ')} />
          <Field name={i18n.t('client.form.agencies_involved')}     value={clientAgencies.join(', ')} />
          {client.quantitative_cases.map((qc, index) => {
            return (
              <Field name={qc.quantitative_type} key={index}>
                <View style={styles.qcWrapper}>
                  {qc.client_quantitative_cases.map((cqc, index) => (
                    <View key={index} style={styles.qcLabel}>
                      <Text>{cqc}</Text>
                    </View>
                  ))}
                </View>
              </Field>
            )
          })}
        </Card>
      </View>
    )
  }
}

const mapState = state => ({
  clients: state.clients.data,
  users: state.users.data,
  donors: state.donors.data,
  agencies: state.agencies.data,
  villages: state.villages.data,
  communes: state.communes.data,
  districts: state.districts.data,
  provinces: state.provinces.data,
  birthProvinces: state.birthProvinces.data,
})

export default connect(mapState)(ClientInformation)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingLeft: 20,
    paddingRight: 20
  },
  editButton: {
    color: '#fff',
    backgroundColor: '#1c84c6',
    padding: 6,
    paddingLeft: 35,
    paddingRight: 35
  },
  profile: {
    alignSelf: 'center',
    height: 200,
    width: 200,
    marginTop: 15,
    marginBottom: 15
  },
  qcWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10
  },
  qcLabel: {
    backgroundColor: '#EDEFF1',
    padding: 5,
    paddingLeft: 10,
    marginTop: 5
  }
})
