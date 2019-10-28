import { Navigation }         from 'react-native-navigation'
import { loadingScreen }      from '../../../navigation/config'
import i18n                   from '../../../i18n'

import {
  requestFamilies,
  requestFamiliesSuccess,
  requestFamiliesFailed,
  updateFamilySuccess
} from '../families'

export function updateFamilyOffline(family, actions) {
  return dispatch => {
    // loadingScreen()
    // dispatch(requestFamilies())

    // const params = {
    //   id: parseInt(family.id),
    //   family: JSON.stringify(family),
    //   type: 'updateFamilyProfile'
    // }

    // let currentFamily = Database.objects('FamilyProfile').filtered('id == $0 AND type == $1', parseInt(family.id), 'updateFamilyProfile')

    // Database.write(() => {
    //   if (currentFamily.length == 1) {
    //     currentFamily[0].family = JSON.stringify(family)
    //   } else {
    //     Database.create('FamilyProfile', params);
    //   }
    // })

    // dispatch(updateFamilySuccess(family))
    // Navigation.dismissOverlay('LOADING_SCREEN')
    // Navigation.popTo(actions.familyDetailComponentId)
    // actions.alertMessage()
  }
}
