import React, { Component } from 'react'
import { Text, View, Dimensions, Image } from 'react-native'
import Layout                             from '../../../components/Layout'
import Swiper from 'react-native-swiper'

import Step1 from './partials/getStarted'
import Step2 from './partials/LivingDetails'
import Step3 from './partials/OtherDetails'
import Step4 from './partials/SpecificPointReferalData'
import SwiperPagination from './partials/swiperPagination'

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
    flexDirection: 'row',
    padding: 10,
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  paginationText: {
    fontSize: 15,
  }
}

export default class index extends Component {
  handleGoToNextTab = () => {
    this.refs.swiper.scrollBy(1, true)
  }

  handleGoToPrivousTab = () => {
    this.refs.swiper.scrollBy(-1, true)
  }

  render() {
    return (
      <Layout>
        <Swiper
          ref="swiper"
          style={styles.wrapper}
          renderPagination={(index, total, context) => 
            <SwiperPagination
              index={index}
              total={total}
            />
          }
          loop={false}
        >
          <Step1 handleGoToNextTab={this.handleGoToNextTab}/>
          <Step2 
            handleGoToNextTab={this.handleGoToNextTab}
            handleGoToPrivousTab={this.handleGoToPrivousTab}
          />
          <Step3 
            handleGoToNextTab={this.handleGoToNextTab}
            handleGoToPrivousTab={this.handleGoToPrivousTab}
          />
          <Step4 
            handleGoToNextTab={this.handleGoToNextTab}
            handleGoToPrivousTab={this.handleGoToPrivousTab}
          />
        </Swiper>
      </Layout>
    )
  }
}
