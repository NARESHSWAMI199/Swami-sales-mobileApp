
import axios from "axios";
import { Dispatch } from "react";
import { BASE_URL } from "../../utils";
import { LocationGeocodedAddress } from "expo-location";


export interface UpdataLocationAction {
    readonly type : 'ON_UPDATE_LOCATION',
    payload : LocationGeocodedAddress
} 


export interface UserErrorAction  {
    readonly type: 'ON_USER_ERROR',
    payload: any
} 

export type UserAction = UpdataLocationAction | UserErrorAction 

export const onUpdateLocation = (location : LocationGeocodedAddress)=> {

    return async(dispatch : Dispatch<UserAction>) => {

        try {
            // save our location in storage
            dispatch({
                type: 'ON_UPDATE_LOCATION',
                payload: location
            })
        } catch (error) {

            dispatch({
                type: 'ON_USER_ERROR',
                payload: location
            })
        }
    }
  
}