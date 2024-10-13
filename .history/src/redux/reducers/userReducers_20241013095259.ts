
import { LocationGeocodedAddress } from "expo-location"
import { UserAction } from "../actions/userActions"
import { UserState,UserModel } from "../models"

const initialState : UserState = {
    user : {} as UserModel,
    error : undefined
}
//location : {} as LocationGeocodedAddress,
const userReducer = (state: UserState = initialState, action  : UserAction) => {

    switch(action.type){
        case 'ON_UPDATE_LOCATION' :
            return {
                ...state,
                location : action.payload
        }
        default :
            return state
         
    }

}


export { userReducer }