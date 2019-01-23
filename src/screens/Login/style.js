import { StyleSheet }	from 'react-native';

const styles = StyleSheet.create({
	container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
    paddingTop: 0
  },
  imageWrapper: {
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: 'center'
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center'
  },
  input: {
    marginBottom: 20,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#009999'
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: '#009999',
    borderWidth: 0,
    elevation: 3
  },
  error: {
  	textAlign: 'center',
  	marginTop: 18
  },
  icon: {
    position: 'absolute',
    top: 33,
    right: 0
  }
});

export default styles;
