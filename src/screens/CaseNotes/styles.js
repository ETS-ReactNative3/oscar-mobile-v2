import { StyleSheet } from 'react-native'
import { MAIN_COLOR } from '../../constants/colors'

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  caseNoteWrapper: {
    backgroundColor: MAIN_COLOR,
    borderRadius: 8,
    elevation: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: '#000',
    shadowOpacity: 0.5,
    borderWidth: 2,
    borderColor: '#fff',
    margin: 8,
    padding: 10
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#fff',
  },
  meetingDate: {
    color: '#fff'
  }
})

export default styles