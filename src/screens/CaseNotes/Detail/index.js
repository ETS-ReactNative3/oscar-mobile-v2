import React, { Component } from 'react'
import { connect }          from 'react-redux'
import { View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native'
import moment from 'moment'
import _ from 'lodash'
import styles from './styles'
import i18n from '../../../i18n'
import Card from '../../../components/Card'

class CaseNoteDetail extends Component {
  renderNotes = case_note => (
    <View style={styles.fieldDataWrapper}>
      <Text style={styles.label}>{i18n.t('client.case_note_form.note')} : </Text>
      <Text style={styles.textData}>{case_note.note}</Text>
    </View>
  )

  renderGoals = case_note => {
    const { assessments } = this.props.client

    if (assessments.length === 0) return

    const lastAssessment = assessments[assessments.length - 1]
    const assessmentDomainsWithGoal = lastAssessment.assessment_domain.filter(ad => Boolean(ad.goal))
    const domainScoreDomainIds = case_note.domain_scores.map(ds => ds.domain_id)
    const availableAssessmentDomains = assessmentDomainsWithGoal.filter(ad => domainScoreDomainIds.includes(ad.domain_id))

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
    const { caseNote } = this.props

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
            caseNote.case_note_domain_group.filter(cndg => !!cndg.note).map((case_note, index) => (
              <View key={index} style={styles.fieldContainer}>
                <View style={styles.field}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                    {case_note.domain_group_identities}
                  </Text>
                </View>

                <View style={styles.contentWrapper}>
                  { this.renderNotes(case_note) }
                  { this.renderGoals(case_note) }
                  { case_note.completed_tasks.length > 0 && this.renderTasks(case_note) }
                  { case_note.attachments.length > 0 && this.renderAttachments(case_note) }
                </View>
              </View>
            ))
          }
        </ScrollView>
      </View>
    )
  }
}

const mapState = (state, ownProps) => {
  const clients   = state.clients.data
  const client    = clients[ownProps.clientId]
  const caseNotes = client.case_notes
  const caseNote  = caseNotes.find(cn => cn.id === ownProps.caseNoteId)

  return { client, caseNote }
}

export default connect(mapState)(CaseNoteDetail)