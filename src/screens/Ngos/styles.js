import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEFF1'
  },
  bodyContainer: {
    flex: 1,
    paddingTop: 10,
  },
  ngoWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageWrapper: {
    backgroundColor: '#fff',
    width: width / 2 - 20,
    height: width / 2 - 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    elevation: 10,
    borderRadius: 10
  },
  shareElement: {
    width: width / 2 - 40,
    height: width / 2 - 40,
    borderRadius: 15
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: '100%',
    height: '100%'
  },
  breaker: {
    marginTop: 0,
    elevation: 0 
  }
})

export default styles
