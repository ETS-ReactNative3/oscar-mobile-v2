import React, { Component }         from 'react'
import { View, Text, ScrollView }   from 'react-native'
import { connect }                  from 'react-redux'
import Swiper                       from 'react-native-swiper'
import { Navigation }               from 'react-native-navigation'
import DropdownAlert                from 'react-native-dropdownalert'
import { some }                     from 'lodash'
import moment from 'moment'
import i18n                         from '../../../i18n'
import appIcons                     from '../../../utils/Icon'
import { pushScreen }               from '../../../navigation/config'
import { acceptClient, rejectClient } from '../../../redux/actions/clients'
import Layout                       from '../../../components/Layout'
import Menu                         from './Menu'
import ClientInformation            from './Information'
import styles                       from './styles'

class ClientDetail extends Component {
  componentDidMount() {
    Navigation.events().bindComponent(this)
  }

  componentWillReceiveProps(nextProps) {
    const { given_name, family_name } = nextProps.client
    const clientName = [given_name, family_name].filter(Boolean).join(' ') || '(No Name)'

    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: clientName
        }
      }
    })
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

  onAcceptClient = client => {
    this.props.acceptClient(client)
  }

  onRejectClient = client => {
    Navigation.showModal({
      component: {
        name: 'oscar.exitNgo',
        passProps: {
          rejectClient: params => this.props.rejectClient(client, params),
        }
      }
    })
  }

  taskCount = () => {
    const { tasks } = this.props.client

    const upcoming = tasks.filter(task => moment(task.completion_date).isAfter(Date.now(), 'day'))
    const today    = tasks.filter(task => moment(task.completion_date).isSame(Date.now(), 'day'))
    const overdue  = tasks.filter(task => moment(task.completion_date).isBefore(Date.now(), 'day'))

    return {
      today: today.length,
      overdue: overdue.length,
      upcoming: upcoming.length
    }
}

  render() {
    const { client, setting, referralSourceCategories, language } = this.props
    const enableAssessment = setting.enable_custom_assessment || setting.enable_default_assessment
    // const enrolledProgramStreamCount = client.program_streams.filter(program_stream => some(program_stream.enrollments, { status: 'Active' })).length

    // const inactiveProgramStreams = client.inactive_program_streams.length
    // const activeProgramStreams = client.program_streams.length
    // const allProgramStreams = this.props.programStreams.length
    // const availableProgramStreams = allProgramStreams - inactiveProgramStreams - activeProgramStreams
    // const programStreams = `${inactiveProgramStreams} / ${availableProgramStreams}`
    const taskCount = this.taskCount()
    const referred = client.status == 'Referred'
    const accepted = client.status == 'Accepted' || client.status == 'Active'

    return (
      <Layout>
        <View style={{ flex: 1, backgroundColor: '#EDEFF1' }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {
              referred &&
                <View style={styles.widgetContainer}>
                  <View style={styles.widgetRow}>
                    <Menu
                      value={i18n.t('client.form.accepted')}
                      color="#1c84c6"
                      onPress={() => this.onAcceptClient(client)}
                    />
                    <Menu
                      value={i18n.t('client.form.rejected')}
                      color="#ED5565"
                      onPress={() => this.onRejectClient(client)}
                    />
                  </View>
                </View>
            }
            {
              !referred &&
                <React.Fragment>
                  <Swiper activeDotColor="#23c6c8" loop={false} height={250}>
                    <View style={styles.widgetContainer}>
                      <View style={styles.widgetRow}>
                        <Menu
                          title={i18n.t('client.assessments')}
                          value={client.assessments.length}
                          color="#23c6c8"
                          onPress={() => this.navigateToAssessments(client)}
                          disabled={!accepted || !enableAssessment}
                        />
                        <Menu
                          title={i18n.t('client.case_notes')}
                          value={client.case_notes.length}
                          color="#23c6c8"
                          onPress={() => this.navigateToCaseNotes(client)}
                          disabled={!accepted}
                        />
                      </View>
                      <View style={[styles.widgetRow, { marginBottom: 30 }]}>
                        <Menu
                          title={i18n.t('client.tasks')}
                          value={`${taskCount.overdue} / ${taskCount.today} / ${taskCount.upcoming}`}
                          color="#23c6c8"
                          onPress={() => this.navigateToTasks(client)}
                          disabled={!accepted}
                        />
                      </View>
                    </View>
                    { /*
                      <View style={styles.widgetContainer}>
                        <View style={styles.widgetRow}>
                          <Menu
                            title={i18n.t('client.enrolled_program_streams')}
                            value={enrolledProgramStreamCount}
                            color="#1ab394"
                            onPress={() => this.navigateToEnrollProgramStreams(client)}
                            disabled={!accepted || enrolledProgramStreamCount == 0}
                          />
                          <Menu
                            title={i18n.t('client.program_stream')}
                            value={programStreams}
                            color="#1ab394"
                            loading={this.props.programStreamsLoading}
                            onPress={() => this.navigateToActiveProgramStreams(client)}
                            disabled={!accepted}
                          />
                        </View>
                        <View style={[styles.widgetRow, { marginBottom: 30 }]}>
                          <Menu
                            title={i18n.t('client.additional_form')}
                            value={client.additional_form.length}
                            color="#1c84c6"
                            onPress={() => this.navigateToAdditionalForms(client)}
                            disabled={!accepted || client.additional_form.length == 0}
                          />
                          <Menu
                            title={i18n.t('client.add_form')}
                            value={client.add_forms.length}
                            color="#1c84c6"
                            onPress={() => this.navigateToAddForms(client)}
                            disabled={!accepted}
                          />
                        </View>
                      </View>
                    */ }
                  </Swiper>

                  <View style={styles.absoluteContainer}>
                    <View style={styles.statusContainer}>
                      <Text style={styles.status}>{client.status}</Text>
                    </View>
                  </View>
                </React.Fragment>
            }

            <ClientInformation client={client} setting={setting} referralSourceCategories={referralSourceCategories} language={language}/>
          </ScrollView>
          <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
        </View>
      </Layout>
    )
  }
}

const mapState = (state, ownProps) => ({
  programStreams: state.programStreams.data,
  programStreamsLoading: state.programStreams.loading,
  referralSourceCategories: state.referralSourceCategories.data,
  client: state.clients.data[ownProps.clientId],
  message: state.clients.message,
  language: state.language.language,
})

const mapDispatch = {
  acceptClient,
  rejectClient
}

export default connect(mapState, mapDispatch)(ClientDetail)
