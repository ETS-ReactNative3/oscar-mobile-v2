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

export const pushScreen = (componentId, { screen, title, props = {}, topBar = true }) => {
  Navigation.push(componentId, {
    component: {
      name: screen,
      passProps: props,
      options: {
        bottomTabs: {
          visible: false
        },
        topBar: {
          visible: topBar,
          title: {
            text: title
          },
          backButton: {
            showTitle: false
          }
        }
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
            name: 'oscar.ngo',
            options: {
              topBar: {
                title: {
                  fontFamily: '.SFUIDisplay-Bold',
                  text: 'Choose Your NGO',
                  fontSize: 25,
                  color: '#fff',
                  alignment: 'center'
                },
                background: {
                  color: MAIN_COLOR,
                  translucent: false
                }
              }
            }
          }
        }]
      }
    }
  })

  Navigation.setDefaultOptions({
    statusBar: {
      style: 'light'
    }
  })
}

export const startTabScreen = () => {

}
