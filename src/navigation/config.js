import { Navigation } from 'react-native-navigation'
import { MAIN_COLOR } from '../constants/colors'
import i18n           from '../i18n'
import appIcon        from '../utils/Icon'

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
          visible: options.topBar == undefined ? true : options.topBar,
          drawBehind: options.drawBehind,
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
                  text: i18n.t('choose_ngo')
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

export const startTabScreen = async () => {
  const icons = await appIcon()
  Navigation.setRoot({
    root: {
      bottomTabs: {
        id: "BottomTabsId",
        children: [
          {
            stack: {
              children: [{
                component: {
                  name: 'oscar.clients',
                  options: {
                    topBar: {
                      title: {
                        text: 'Clients',
                      }
                    }
                  }
                }
              }],
              options: {
                bottomTab: {
                  text: "Clients",
                  testID: 'CLIENTS_TAB_BAR_BUTTON',
                  icon: icons.person,
                  selectedIconColor: MAIN_COLOR,
                  selectedTextColor: MAIN_COLOR
                }
              }
            }
          },
          {
            stack: {
              children: [{
                component: {
                  name: 'oscar.tasks',
                  options: {
                    topBar: {
                      title: {
                        text: 'Tasks'
                      }
                    }
                  }
                }
              }],
              options: {
                bottomTab: {
                  text: "Tasks",
                  testID: 'TASKS_TAB_BAR_BUTTON',
                  icon: icons.assignment,
                  selectedIconColor: MAIN_COLOR,
                  selectedTextColor: MAIN_COLOR
                }
              }
            }
          },
          {
            stack: {
              children: [{
                component: {
                  name: 'oscar.families',
                  options: {
                    topBar: {
                      title: {
                        text: 'Familes'
                      }
                    }
                  }
                }
              }],
              options: {
                bottomTab: {
                  text: "Familes",
                  testID: 'FAMILIES_TAB_BAR_BUTTON',
                  icon: icons.people,
                  selectedIconColor: MAIN_COLOR,
                  selectedTextColor: MAIN_COLOR
                }
              }
            }
          },
          {
            stack: {
              children: [{
                component: {
                  name: 'oscar.users',
                  options: {
                    topBar: {
                      title: {
                        text: 'Users'
                      },
                      rightButtons: [
                        {
                          id: 'TRANSLATION',
                          icon: icons.translation
                        }
                      ]
                    },
                  }
                }
              }],
              options: {
                bottomTab: {
                  text: "Users",
                  testID: 'USERS_TAB_BAR_BUTTON',
                  icon: icons.accountBox,
                  selectedIconColor: MAIN_COLOR,
                  selectedTextColor: MAIN_COLOR
                }
              }
            }
          },
          {
            stack: {
              children: [{
                component: {
                  name: 'oscar.webView',
                  options: {
                    topBar: {
                      title: {
                        text: 'Oscar'
                      }
                    }
                  }
                }
              }],
              options: {
                bottomTab: {
                  text: "Oscar",
                  testID: 'WEB_TAB_BAR_BUTTON',
                  icon: icons.web,
                  selectedIconColor: MAIN_COLOR,
                  selectedTextColor: MAIN_COLOR
                }
              }
            }
          }
        ]
      }
    }
  })
}
