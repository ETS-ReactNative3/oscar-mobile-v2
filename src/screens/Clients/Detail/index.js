import React, { Component }                 from 'react'
import i18n                                 from '../../../i18n'
import Menu                                 from './Menu'
import styles                               from './styles'
import Swiper                               from 'react-native-swiper'
import appIcons                             from '../../../utils/Icon'
import DropdownAlert                        from 'react-native-dropdownalert'
import ClientInformation                    from './Information'
import { some }                             from 'lodash'
import { connect }                          from 'react-redux'
import { pushScreen }                       from '../../../navigation/config'
import { Navigation }                       from 'react-native-navigation'
import { View, Text, ScrollView }           from 'react-native'
class ClientDetail extends Component {
  constructor(props) {
    super(props)
    Navigation.events().bindComponent(this)
  }

  alertMessage = message => {
    this.refs.dropdown.alertWithType('success', 'Success', message)
  }

  async navigationButtonPressed({ buttonId }) {
    if (buttonId === 'EDIT_CLIENT') {
      const { client } = this.props
      const icons = await appIcons()
      pushScreen(this.props.componentId, {
        screen: 'oscar.editClient',
        title: 'EDIT CLIENT',
        props: {
          client,
          clientDetailComponentId: this.props.componentId,
          alertMessage: () => this.alertMessage('Client has been successfully updated.')
        },
        rightButtons: [
          {
            id: 'SAVE_CLIENT',
            icon: icons.save,
            color: '#fff'
          }
        ]
      })
    }
  }

  navigateToAssessments = client => {
    pushScreen(this.props.componentId, {
      screen: 'oscar.assessments',
      title: i18n.t('client.assessments'),
      props: {
        clientId: client.id,
        setting: this.props.setting
      }
    })
  }

  navigateToCaseNotes = async client => {
    const icons = await appIcons()
    pushScreen(this.props.componentId, {
      screen: 'oscar.caseNotes',
      title: i18n.t('client.case_notes'),
      props: { clientId: client.id },
      rightButtons: [
        {
          id: 'ADD_CASE_NOTE',
          icon: icons.add,
          color: '#fff'
        }
      ]
    })
  }

  navigateToTasks = client => {
    pushScreen(this.props.componentId, {
      screen: 'oscar.tasks',
      title: i18n.t('task.title'),
      props: { clientId: client.id }
    })
  }

  navigateToEnrollProgramStreams = client => {
    pushScreen(this.props.componentId, {
      screen: 'oscar.enrolledProgramStreams',
      title: 'Active Program Streams',
      props: {
        clientId: client.id,
        clientDetailComponentId: this.props.componentId,
        alertMessage: () => this.alertMessage('Leave Program has been successfully created.')
      }
    })
  }

  navigateToActiveProgramStreams = client => {
    pushScreen(this.props.componentId, {
      screen: 'oscar.activeProgramStreams',
      title: 'Active Program Streams',
      props: {
        clientId: client.id,
        clientDetailComponentId: this.props.componentId,
        alertMessage: () => this.alertMessage('Enrollment has been successfully created.')
      }
    })
  }

  navigateToAdditionalForms = client => {
    pushScreen(this.props.componentId, {
      screen: 'oscar.additionalForms',
      title: 'Additional Form',
      props: {
        entityId: client.id,
        type: 'client'
      }
    })
  }

  navigateToAddForms = client => {
    pushScreen(this.props.componentId, {
      screen: 'oscar.addForms',
      title: 'Add Form',
      props: {
        entityId: client.id,
        entityDetailComponentId: this.props.componentId,
        type: 'client',
        alertMessage: () => this.alertMessage('Custom Field Properties has been successfully created.')
      }
    })
  }

  render() {
    const { client, setting } = this.props
    const enableAssessment = setting.enable_custom_assessment || setting.enable_default_assessment

    const enrolledProgramStreamCount = client.program_streams.filter(program_stream => some(program_stream.enrollments, { status: 'Active' }))
      .length

    const inactiveProgramStreams = client.inactive_program_streams.length
    const activeProgramStreams = client.program_streams.length
    const allProgramStreams = this.props.programStreams.length
    const availableProgramStreams = allProgramStreams - inactiveProgramStreams - activeProgramStreams
    const programStreams = `${inactiveProgramStreams} / ${availableProgramStreams}`

    const overdue = client.tasks.overdue.length
    const today = client.tasks.today.length
    const upcoming = client.tasks.upcoming.length
    const referred = client.status == 'Referred'

    return (
      <View style={{ flex: 1, backgroundColor: '#EDEFF1' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Swiper activeDotColor="#23c6c8" loop={false} height={250}>
            <View style={styles.widgetContainer}>
              <View style={styles.widgetRow}>
                <Menu
                  title={i18n.t('client.assessments')}
                  value={client.assessments.length}
                  color="#23c6c8"
                  onPress={() => this.navigateToAssessments(client)}
                  disabled={referred || !enableAssessment}
                />
                <Menu
                  title={i18n.t('client.case_notes')}
                  value={client.case_notes.length}
                  color="#23c6c8"
                  onPress={() => this.navigateToCaseNotes(client)}
                  disabled={referred}
                />
              </View>
              <View style={[styles.widgetRow, { marginBottom: 30 }]}>
                <Menu
                  title={i18n.t('client.tasks')}
                  value={`${overdue} / ${today} / ${upcoming}`}
                  color="#23c6c8"
                  onPress={() => this.navigateToTasks(client)}
                  disabled={referred}
                />
              </View>
            </View>
            <View style={styles.widgetContainer}>
              <View style={styles.widgetRow}>
                <Menu
                  title={i18n.t('client.enrolled_program_streams')}
                  value={enrolledProgramStreamCount}
                  color="#1ab394"
                  onPress={() => this.navigateToEnrollProgramStreams(client)}
                  disabled={referred || enrolledProgramStreamCount == 0}
                />
                <Menu
                  title={i18n.t('client.program_stream')}
                  value={programStreams}
                  color="#1ab394"
                  loading={this.props.programStreamsLoading}
                  onPress={() => this.navigateToActiveProgramStreams(client)}
                  disabled={referred}
                />
              </View>
              <View style={[styles.widgetRow, { marginBottom: 30 }]}>
                <Menu
                  title={i18n.t('client.additional_form')}
                  value={client.additional_form.length}
                  color="#1c84c6"
                  onPress={() => this.navigateToAdditionalForms(client)}
                  disabled={referred || client.additional_form.length == 0}
                />
                <Menu
                  title={i18n.t('client.add_form')}
                  value={client.add_forms.length}
                  color="#1c84c6"
                  onPress={() => this.navigateToAddForms(client)}
                  disabled={referred}
                />
              </View>
            </View>
          </Swiper>

          <View style={styles.absoluteContainer}>
            <View style={styles.statusContainer}>
              <Text style={styles.status}>{client.status}</Text>
            </View>
          </View>

          <ClientInformation client={client} setting={setting} />
        </ScrollView>
        <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
      </View>
    )
  }
}

const mapState = (state, ownProps) => ({
  programStreams: state.programStreams.data,
  programStreamsLoading: state.programStreams.loading,
  client: state.clients.data[ownProps.clientId],
})

export default connect(mapState)(ClientDetail)
