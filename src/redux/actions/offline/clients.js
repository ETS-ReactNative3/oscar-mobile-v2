import { Navigation }     from 'react-native-navigation'
import { size }           from 'lodash'
import { CLIENT_TYPES }   from '../../types'
import { loadingScreen }  from '../../../navigation/config'
import Database           from '../../../config/Database'

import {
  requestClients,
  requestClientsSuccess,
  requestClientsFailed,
  updateClient
} from '../clients'

export const updateClientQueue = client => ({
  type: CLIENT_TYPES.UPDATE_CLIENT_QUEUE,
  client
})

export function updateClientOffline(client, actions) {
  return (dispatch, getState) => {
    loadingScreen()
    dispatch(requestClients())

    const users             = getState().users.data
    const donors            = getState().provinces.data
    const clients           = getState().clients.data
    const agencies          = getState().agencies.data
    const villages          = getState().villages.data
    const communes          = getState().communes.data
    const districts         = getState().districts.data
    const provinces         = getState().provinces.data
    const quantitativeTypes = getState().quantitativeTypes.data

    const clientQuantitativeCases = quantitativeTypes.map(qtype => ({
      quantitative_type: qtype.name,
      client_quantitative_cases: qtype.quantitative_cases.filter(qcase => client.quantitative_case_ids.includes(qcase.id)).map(qcase => qcase.value)
    }))

    const clientBirthProvince   = client.birth_province_id      ? provinces.find(province => province.id === client.birth_province_id) : null
    const clientCurrentProvince = client.province_id            ? provinces.find(province => province.id === client.province_id) : null
    const clientDistrict        = client.district_id            ? districts.find(district => district.id === client.district_id) : null
    const clientCommune         = client.commune_id             ? communes.find(commune => commune.id === client.commune_id) : null
    const clientVillage         = client.village_id             ? villages.find(village => village.id === client.village_id) : null

    const clientFollowedUpBy    = client.followed_up_by_id      ? users[client.followed_up_by_id] : null
    const clientRecievedBy      = client.received_by_id         ? users[client.received_by_id] : null
    const clientCaseWorkers     = client.user_ids.length > 0    ? Object.values(users).filter(user => client.user_ids.includes(user.id)) : null
    const clientDonors          = client.donor_ids.length > 0   ? donors.filter(donor => client.donor_ids.includes(donor.id)) : null
    const clientAgencies        = client.agency_ids.length > 0  ? agencies.filter(agency => client.agency_ids.includes(agency.id)) : null

    const updatedClient         = {
      ...client,
      donors: clientDonors,
      village: clientVillage,
      commune: clientCommune,
      district: clientDistrict,
      agencies: clientAgencies,
      received_by: clientRecievedBy,
      case_workers: clientCaseWorkers,
      followed_up_by: clientFollowedUpBy,
      birth_province: clientBirthProvince,
      current_province: clientCurrentProvince,
      quantitative_cases: clientQuantitativeCases,
    }

    dispatch(updateClientQueue(updatedClient))
    dispatch(updateClient(updatedClient))
    Navigation.dismissOverlay('LOADING_SCREEN')
    Navigation.popTo(actions.clientDetailComponentId)
    actions.alertMessage()
  }
}
