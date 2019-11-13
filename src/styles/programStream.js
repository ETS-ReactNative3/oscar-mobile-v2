import { StyleSheet, Dimensions  } from 'react-native'
const programStreamStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    width: Dimensions.get("window").width - 40,
    backgroundColor: '#fff',
    margin: 20,
    elevation: 15,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowColor: '#000',
    borderRadius: 20,
    flexDirection: 'row'
  },
  leftSide: {
    flex: 1,
    flexDirection: 'column'
  },
  rightSide: {
    flexDirection: 'column',
    backgroundColor: '#009999',
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15
  },
  buttonWrapper: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  buttonWrapperTracking: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#fff'
  },
  buttonWrapperNotTracking: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#dedede'
  },
  buttonTitleTracking: {
    textAlign: 'center',
    color: '#97999c'
  },
  buttonTitle: {
    textAlign: 'center',
    color: '#fff'
  },
  leftSideWrapper: {
    flex: 1,
    padding: 20
  },
  statusWrapper: {
    width: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#009999',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 5,
    paddingRight: 5
  },
  statusTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 8
  },
  programStreamTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#888'
  },
  titleDivider: {
    marginTop: 8,
    width: '70%',
    backgroundColor: '#EDEFF1'
  },
  quantityWrapper: {
    marginTop: 8,
    flexDirection: 'row'
  },
  quantityKey: {
    color: '#009999',
    fontWeight: 'bold',
    fontSize: 11
  },
  quantityValue: {
    marginLeft: 5,
    color: '#97999c',
    fontSize: 11,
    fontWeight: 'bold'
  },
  domainWrapper: {
    marginTop: 5,
    flexDirection: 'column'
  },
  domainKey: {
    color: '#009999',
    fontWeight: 'bold',
    fontSize: 11
  },
  domainValue: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginTop: 5
  },
  domainValueButtonWrapper: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDEFF1',
    margin: 2,
    marginLeft: 0
  },
  domainValueButton: {
    padding: 3,
    paddingRight: 5,
    paddingLeft: 5,
    color: '#97999c',
    fontWeight: 'bold',
    fontSize: 10
  }
})

const programStreamDetail = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEFF1'
  },
  tableWrapper: {
    margin: 20,
    elevation: 15,
    backgroundColor: '#EDEFF1',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12
  },
  tableHeader: {
    backgroundColor: '#088',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6
  },
  tableDetailRow: {
    backgroundColor: '#ffffff',
    margin: 1
  },
  headerColumn: {
    flex: 1,
    alignItems: 'center'
  },
  headerLabel: {
    color: '#fff',
    fontWeight: 'bold'
  },
  detailLabel: {
    color: '#97999c',
    textAlign: 'center'
  },
  column: {
    flex: 1
  }
})

const enrollmentDetail = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEFF1'
  },
  contentWrapper: {
    margin: 20,
    elevation: 15,
    backgroundColor: '#fff',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6
  },
  headerContainer: {
    backgroundColor: '#009999',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    padding: 12,
    flexDirection: 'row'
  },
  headerLabel: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  fieldContainer: {
    paddingLeft: 12
  },
  iconWrapper: {
    marginRight: 12
  },
  label: {
    color: '#009999',
    fontWeight: 'bold',
    paddingBottom: 3,
    marginBottom: 3
  },
  labelMargin: {
    marginTop: 10
  },
  labelWrapper: {
    backgroundColor: '#dedede',
    padding: 6,
    margin: 2,
    borderRadius: 2
  },
  detailLabel: {},
  imageWrapper: {
    marginRight: 12,
    backgroundColor: '#dedede',
    padding: 8,
    borderRadius: 2,
    alignItems: 'center',
    marginBottom: 2
  },
  fileName: {
    flex: 1
  }
})

export const listTracking = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEFF1'
  },
  tableWrapper: {
    margin: 20,
    elevation: 15,
    backgroundColor: '#EDEFF1',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12
  },
  tableHeader: {
    backgroundColor: '#088',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6
  },
  tableDetailRow: {
    backgroundColor: '#ffffff',
    margin: 1
  },
  headerColumn: {
    flex: 1,
    alignItems: 'center'
  },
  headerLabel: {
    color: '#fff',
    fontWeight: 'bold'
  },
  detailLabel: {
    color: '#97999c',
    textAlign: 'center'
  },
  column: {
    flex: 1
  }
})

export { programStreamStyles, programStreamDetail, enrollmentDetail }
