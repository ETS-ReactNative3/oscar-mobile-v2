import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#EDEFF1',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  task: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginBottom: 10,
    marginTop: 10,
    elevation: 15,
    shadowOffset:{  width: 5,  height: 5 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    paddingLeft: 5,
    color: 'white'
  },
  number: {
    color: 'white',
    fontSize: 40
  }
})

export default styles
