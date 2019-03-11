import { StyleSheet } from 'react-native'
import { MAIN_COLOR } from '../../../constants/colors'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd'
  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    elevation: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#000',
    shadowOpacity: 0.4
  },
  header: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: MAIN_COLOR,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold'
  },
  content: {
    padding: 20
  },
  inputWrapper: {
    marginBottom: 15
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  datePicker: {
    width: -1,
    borderColor: '#00BCD4'
  },
  datePickerBorder: {
    borderColor: '#c7cdd3'
  },
  datePickerIcon: {
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#c7cdd3',
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textarea: {
    height: 100,
    borderColor: MAIN_COLOR,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  buttonWrapper: {
    marginTop: 15,
    marginLeft: -15,
    marginRight: -15
  },
  listAttachments: {
    marginLeft: 10,
    flex: 1
  },
  attachmentWrapper: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#dedede',
  },
  taskArisingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    padding: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#009999'
  },
  arisingLabel: {
    flex: 1,
    flexWrap: 'wrap'
  },
  checkBoxWrapper: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderColor: 'rgba(0,0,0,0)',
    margin: 0,
    marginBottom: 5,
    marginLeft: 0,
    padding: 0
  }
})