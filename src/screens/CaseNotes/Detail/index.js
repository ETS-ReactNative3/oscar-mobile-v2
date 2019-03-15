import React, { Component } from 'react'
import { Navigation } from 'react-native-navigation'
import { View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native'
import DropdownAlert from 'react-native-dropdownalert'
import moment from 'moment'
import _ from 'lodash'
import { pushScreen } from '../../../navigation/config'
import appIcons from '../../../utils/Icon'
import styles from './styles'
import i18n from '../../../i18n'
import Card from '../../../components/Card'

class CaseNoteDetail extends Component {
  state = {
    client: this.props.client,
    caseNote: this.props.caseNote
  }

  componentDidMount() {
    Navigation.events().bindComponent(this)
  }

  navigationButtonPressed = async () => {
    const icons = await appIcons()
    const { caseNote, client} = this.state

    pushScreen(this.props.componentId, {
      screen: 'oscar.caseNoteForm',
      title: i18n.t('client.case_note_form.edit_title'),
      props: {
        client,
        caseNote,
        action: 'update',
        custom: caseNote.custom,
        previousComponentId: this.props.componentId,
        onSaveSuccess: this.onSaveSuccess
      },
      rightButtons: [{
        id: 'SAVE_CASE_NOTE',
        icon: icons.save,
        color: '#fff'
      }]
    })
  }

  onSaveSuccess = client => {
    const { caseNote } = this.props
    const updatedCaseNote = client.case_notes.find(case_note => case_note.id === caseNote.id)

    this.refs.dropdown.alertWithType('success', 'Success', 'Client has been successfully updated.')
    this.setState({ caseNote: updatedCaseNote, client })
  }

  renderNotes = case_note => (
    <View style={styles.fieldDataWrapper}>
      <Text style={styles.label}>{i18n.t('client.case_note_form.note')} : </Text>
      <Text style={styles.textData}>{case_note.note}</Text>
    </View>
  )

  renderGoals = case_note => {
    const { assessments } = this.props.client

    if (assessments.length === 0) return

    const assessment = assessments.find(assessment => assessment.id === this.props.caseNote.assessment_id)
    const assessmentDomainsWithGoal = assessment.assessment_domain.filter(ad => Boolean(ad.goal))
    const caseNoteDomainIds = case_note.domain_scores.map(ds => ds.domain_id)
    const availableAssessmentDomains = assessmentDomainsWithGoal.filter(ad => caseNoteDomainIds.includes(ad.domain_id))

    if (availableAssessmentDomains.length === 0) return

      return (
        <View style={styles.fieldDataWrapper}>
          <View>
            <Text style={styles.label}>{i18n.t('client.assessment_form.goal')} : </Text>
            {
              availableAssessmentDomains.map((ad, index) => (
                <View key={index}>
                  <Text style={styles.listAttachments}>
                    {index + 1}. {ad.goal}
                  </Text>
                </View>
              ))
            }
          </View>
        </View>
      )
  }

  renderTasks = case_note => (
    <View style={styles.fieldDataWrapper}>
      <View>
        <Text style={styles.label}>{i18n.t('client.case_note_form.completed_tasks')}: </Text>

        {case_note.completed_tasks.map((task, index) => {
          return (
            <View key={index}>
              <Text style={styles.listAttachments}>
                {index + 1}. <Text>{task.name}</Text>
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )

  renderAttachments = case_note => (
    <View style={styles.fieldDataWrapper}>
      <View>
        <Text style={styles.label}>{i18n.t('client.assessment_form.attachments')}: </Text>
        {
          case_note.attachments.map((attachment, index) => {
            const url = attachment.url || attachment.name
            const filename = url.substring(url.lastIndexOf('/') + 1)
            return (
              <View key={index}>
                <Text style={styles.listAttachments}>
                  {index + 1}. {filename}
                </Text>
              </View>
            )
          }
        )
      }
      </View>
    </View>
  )

  render() {
    const { caseNote } = this.state

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.attendeeTitle}>
              {caseNote.attendee}{' '}
              {caseNote.interaction_type != '' && `( ${caseNote.interaction_type} )`}
          </Text>
          <Text style={styles.meetingDate}>
            {moment(caseNote.meeting_date).format('MMMM Do YYYY')}
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 20 }}>
          {
            caseNote.case_note_domain_group.filter(cndg => !!cndg.note).map((case_note, index) => {
              const tasks = case_note.tasks || case_note.completed_tasks
              const attachments = case_note.attachments || []

              return (
                <View key={index} style={styles.fieldContainer}>
                  <View style={styles.field}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                      {case_note.domain_group_identities}
                    </Text>
                  </View>

                  <View style={styles.contentWrapper}>
                    { this.renderNotes(case_note) }
                    { this.renderGoals(case_note) }
                    { tasks.length > 0 && this.renderTasks(case_note) }
                    { attachments.length > 0 && this.renderAttachments(case_note) }
                  </View>
                </View>
              )
            })
          }
        </ScrollView>
        <DropdownAlert ref="dropdown" updateStatusBar={false} useNativeDriver={true} />
      </View>
    )
  }
}

export default CaseNoteDetail