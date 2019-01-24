import { Navigation } from 'react-native-navigation'
import { MAIN_COLOR } from '../constants/colors'
import Icon from 'react-native-vector-icons/MaterialIcons';

async function perpareIcon() {
  const icons = await Promise.all([
    Icon.getImageSource('person', 30),
    Icon.getImageSource('people', 30),
    Icon.getImageSource('assignment', 30),
    Icon.getImageSource('account-box', 30),
    Icon.getImageSource('web', 30)
  ])
  const [person, people, assignment, accountBox, web ] = icons
  return { person, people, assignment, accountBox, web }
}

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

export const startTabScreen = async () => {
  const icons = await perpareIcon()
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
                      }
                    }
                  }
                }
              }],
              options: {
                bottomTab: {
                  text: "Users",
                  testID: 'USERS_TAB_BAR_BUTTON',
                  icon: icons.accountBox,
                }
              }
            }
          },
          {
            component: {
              name: 'oscar.webView',
              options: {
                topBar: {
                  title: {
                    text: 'Web View'
                  }
                },
                bottomTab: {
                  text: 'Web View',
                  testID: 'WEB_TAB_BAR_BUTTON',
                  icon: icons.web,
                }
              }
            }
          }
        ]
      }
    }
  })
}
