import React, { Component } from 'react'
import { Text, View, Dimensions, Image } from 'react-native'
import Layout                             from '../../../components/Layout'
import Swiper from 'react-native-swiper'

import Step1 from './partials/getStarted'
import Step2 from './partials/LivingDetails'
import Step3 from './partials/OtherDetails'
import Step4 from './partials/SpecificPointReferalData'

const { width } = Dimensions.get('window')

const styles = {
  wrapper: {
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  paginationStyle: {
    position: 'absolute',
    height: 40,
    width: '100%',
    backgroundColor: 'green',
    flexDirection: 'row',
    padding: 10,
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  paginationText: {
    fontSize: 15,
  }
}

const renderPagination = (index, total, context) => {
  return (
    <View style={styles.paginationStyle}>
      <Text style={styles.paginationText}>Get Started</Text>

      <Text style={styles.paginationText}>
       {index + 1} / {total}
      </Text>
    </View>
  )
}

export default class index extends Component {
  render() {
    return (
      <Layout>
        <Swiper
          style={styles.wrapper}
          renderPagination={renderPagination}
          loop={false}
        >
          <Step1 />
          <Step2 />
          <Step3 />
          <Step4 />
        </Swiper>
      </Layout>
    )
  }
}
