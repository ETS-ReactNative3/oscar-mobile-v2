import { Navigation } from 'react-native-navigation'
import { MAIN_COLOR } from '../constants/colors'

export const startScreen = (screen, props = {}) => {
  Navigation.setRoot({
    root: {
      component: {
        name: screen,
        passProps: props,
      }
    }
  })
}

export const pushScreen = (componentId, options = {}) => {
  Navigation.push(componentId, {
    component: {
      name: options.screen,
      passProps: options.props,
      options: {
        bottomTabs: {
          visible: false
        },
        topBar: {
          visible: options.topBar || true,
          title: {
            text: options.title
          },
          backButton: {
            showTitle: false
          }
        },
        customTransition: options.customTransition
      }
    }
  })
}

export const startNgoScreen = () => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [{
          component: {
            name: 'oscar.ngos',
            options: {
              topBar: {
                title: {
                  fontFamily: '.SFUIDisplay-Bold',
                  fontSize: 25,
                  text: 'Choose Your NGO'
                }
              }
            }
          }
        }]
      }
    }
  })
}

export const setDefaultOptions = () => {
  Navigation.setDefaultOptions({
    statusBar: {
      style: 'light'
    },
    topBar: {
      title: {
        color: '#fff',
        alignment: 'center'
      },
      background: {
        color: MAIN_COLOR,
        translucent: false
      },
      backButton: {
        color: '#fff'
      }
    }
  })
}

export const startTabScreen = () => {

}
