
import { LocationGeocodedAddress } from "expo-location"
import { UserAction } from "../actions/userActions"
import { UserState,UserModel } from "../models"
import { getToken } from "../../utils/utils"

const initialState : UserState = {
    user : {
        token : getToken(),
    } as UserModel,
    location : {} as LocationGeocodedAddress,
    error : undefined
}

const userReducer = (state: UserState = initialState, action  : UserAction) => {
    switch(action.type){
        case 'ON_UPDATE_LOCATION' :
            return {
                ...state,
                location : action.payload
            }
        case  'ON_AUTH_LOGIN': 
            return {
                ...state,
                user : action.payload
        }
        case  'ON_AUTH_LOGOUT': 
            return {
                ...state,
                user : action.payload
            }
        default :
            return state
         
    }

}


export { userReducer }