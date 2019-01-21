import { Navigation } from 'react-native-navigation'

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

export const pushScreen = (componentId, { screen, title, props = {} }) => {
  Navigation.push(componentId, {
    component: {
      name: screen,
      passProps: props,
      options: {
        bottomTabs: {
          visible: false
        },
        topBar: {
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

export const startTabScreen = () => {

}
