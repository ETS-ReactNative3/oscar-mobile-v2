import { StyleSheet } from 'react-native'
import { MAIN_COLOR } from '../../../constants/colors'

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#EDEFF1',
  },
  titleContainer: {
    padding: 20,
    backgroundColor: MAIN_COLOR,
    elevation: 15,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#000',
    shadowOpacity: 0.3,
    margin: 20,
    marginBottom: 10
  },
  attendeeTitle: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 18
  },
  meetingDate: {
    color: "#fff",
    fontSize: 12,
    paddingTop: 4
  },
  fieldContainer: {
    marginBottom: 20,
    elevation: 3,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#000',
    shadowOpacity: 0.2,
    borderRadius: 10,
    backgroundColor: '#fff',
  },

  field: {
    backgroundColor: MAIN_COLOR,
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },

  contentWrapper: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },

  fieldDataWrapper: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 7,
  },

  label: {
    fontWeight: 'bold'
  },

  textData: {
    flex: 1
  },

  listAttachments: {
    flex: 1,
    marginTop: 8,
    marginLeft: 10
  }
})

export default styles