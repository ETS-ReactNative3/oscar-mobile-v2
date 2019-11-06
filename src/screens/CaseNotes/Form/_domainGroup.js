import React, { Component } from 'react'
import _                    from 'lodash'
import { CheckBox }         from 'react-native-elements'
import Collapsible          from 'react-native-collapsible'
import Icon                 from 'react-native-vector-icons/MaterialIcons'
import { 
  Text, 
  View, 
  TouchableOpacity, 
  TouchableWithoutFeedback } from 'react-native'

import i18n   from '../../../i18n'
import Card   from './_card'
import styles from './styles'

export default class DomainGroup extends Component {
  render() {
    
    const { 
      collapsibles, 
      onGoingTasks, 
      arisingTasks, 
      caseNoteDomainGroups, 
      selectedDomainGroups, 
    } = this.props

    return (
      caseNoteDomainGroups.map(
        (caseNote, index) => {
          const domainGroupId   = caseNote.domain_group_id
          const collapsed       = collapsibles[domainGroupId]
          if(_.includes(selectedDomainGroups, parseInt(domainGroupId)))
            return (
              <DomainGroupCard 
                key={index} 
                title={caseNote.domain_group_identities} 
                toggleExpanded={() => this.props.toggleExpanded(domainGroupId, collapsed)} 
                collapsed={collapsed}
              > 
                <GoingTasks
                  caseNote={caseNote}
                  onGoingTasks={onGoingTasks}
                  handleTaskCheck={this.props.handleTaskCheck}
                />
                
                <TasksAdded
                  arisingTasks={arisingTasks}
                  deleteTask={this.props.deleteTask}
                />
              </DomainGroupCard>
            )
        }
      )
    )
  }
}

const GoingTasks = props => {
  let { caseNote, onGoingTasks } = props

  return (
    <View style={{ marginTop: 10 }}>
      {
        caseNote.domains.map((domain, index) => {
          const tasks = onGoingTasks.filter(task => task.domain.id === domain.id)

          if (tasks.length === 0)
            return
          
          return (
            <Card key={index} title={`${i18n.t('task.domain')} ${domain.name}`} style={{ marginLeft: 0, marginRight: 0 }}>
              <Text style={styles.label}>
                {i18n.t('client.case_note_form.on_going')}
              </Text>
              {
                tasks.map(task => (
                  <CheckBox
                    key={task.id}
                    title={task.name}
                    checked={caseNote.task_ids.includes(task.id)}
                    iconType="material"
                    checkedIcon="check-box"
                    uncheckedIcon="check-box-outline-blank"
                    checkedColor="#009999"
                    uncheckedColor="#009999"
                    textStyle={styles.checkBox}
                    containerStyle={styles.checkBoxWrapper}
                    onPress={() => props.handleTaskCheck(caseNote, task.id)}
                  />
                ))
              }
            </Card>  
          )
        })
      }
    </View>          
  )
}

const TasksAdded = props =>
  <View style={{ marginTop: 15 }}>
    <Text style={styles.label}>{i18n.t('client.assessment_form.task_arising')}:</Text>
    {
      props.arisingTasks.map((task, index) => (
        <View key={index} style={styles.attachmentWrapper}>
          <Text style={styles.listAttachments}>
            {index + 1}. {task.name}
          </Text>
          <TouchableWithoutFeedback onPress={() => props.deleteTask(task)}>
            <Icon color="red" name="delete" size={25}/>
          </TouchableWithoutFeedback>
        </View>
      ))
    }
  </View>

const DomainGroupCard = props => {
  const iconName = props.collapsed ? 'arrow-drop-down' :  'arrow-drop-up'
  return (
    <View style={[styles.card, props.style]}>
      <View style={[styles.header, {flexDirection: 'row', justifyContent: 'space-between'}]}>
        <View style={{width: '95%'}}>
          <Text style={styles.headerTitle}>
            { props.title }
          </Text>
        </View>
        <TouchableOpacity onPress={props.toggleExpanded}>
          <Icon name={iconName} size={30} style={{marginRight: 5, color: '#ffffff'}}/>
        </TouchableOpacity>
      </View>
      <Collapsible collapsed={props.collapsed}>
        <View style={styles.content}>
          { props.children }
        </View>
      </Collapsible>
    </View>
  )
}

