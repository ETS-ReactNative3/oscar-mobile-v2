import React                  from 'react'
import Icon                   from 'react-native-vector-icons/MaterialIcons'
import { 
  Text, 
  View, 
  Image,
  TouchableWithoutFeedback }  from 'react-native'

import styles                 from './styles'
import i18n                   from '../../../i18n'

export default function Attachments(props) {
  const { attachments } = props

  return (
    attachments.length > 0 &&
      <View style={{ marginTop: 15 }}>
        <Text style={styles.label}>{i18n.t('client.assessment_form.attachments')}:</Text>
        {
          attachments.map((attachment, index) => {
            const name = (attachment.name || attachment.url.split('/').pop()).substring(0, 20)
            return (
              <View style={styles.attachmentWrapper} key={index}>
                <Image
                  style={{ width: 40, height: 40 }}
                  source={{ uri: attachment.uri || attachment.thumb.url }}
                />
                <Text style={styles.listAttachments}>{index + 1}. { name }...</Text>
                {
                  attachment.size &&
                    <TouchableWithoutFeedback
                      onPress={() => props.removeAttactment(index)}>
                      <View>
                        <Icon color="red" name="delete" size={25} />
                      </View>
                    </TouchableWithoutFeedback>
                }
              </View>
            )
          })
        }
      </View>
  )
}
