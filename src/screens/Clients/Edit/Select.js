import React                  from 'react'
import { View, Text }         from 'react-native'
import SectionedMultiSelect   from 'react-native-sectioned-multi-select'
import { MAIN_COLOR }         from '../../../constants/colors'
import i18n                   from '../../../i18n'
import styles                 from './styles'

export default props => (
  <View style={styles.inputContainer}>
    {
      props.required
        ? <View style={{flexDirection: 'row'}}>
            <Text style={[styles.label, {color: 'red'}]}>* </Text>
            <Text style={styles.label}>{ props.label }</Text>
          </View>
        : <Text style={styles.label}>{ props.label }</Text>
    }
    <SectionedMultiSelect
      items={props.items}
      uniqueKey="id"
      modalWithSafeAreaView
      selectText={i18n.t('select_option')}
      alwaysShowSelectText={true}
      searchPlaceholderText={i18n.t('search')}
      confirmText={i18n.t('confirm')}
      showDropDowns={true}
      readOnlyHeadings={!!props.readOnlyHeadings}
      expandDropDowns={!!props.expandDropDowns}
      hideSearch={false}
      single={!!props.single}
      showCancelButton={true}
      styles={{
        button: { backgroundColor: MAIN_COLOR },
        cancelButton: { width: 150 },
        chipText: { maxWidth: 280 },
        selectToggle: { marginTop: 5, marginBottom: 5, paddingHorizontal: 10, paddingVertical: 12, borderRadius: 4 }
      }}
      onSelectedItemsChange={props.onSelectedItemsChange}
      selectedItems={props.selectedItems}
      subKey={props.subKey}
    />
  </View>
)