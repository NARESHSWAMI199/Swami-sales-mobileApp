
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { LocationGeocodedAddress } from "expo-location";
import { userUrl } from "../../utils/utils";

export interface UpdataLocationAction {
    readonly type : 'ON_UPDATE_LOCATION',
    payload : LocationGeocodedAddress
} 


export interface UserErrorAction  {
    readonly type: 'ON_USER_ERROR',
    payload: any
} 

export interface UserErrorAction  {
    readonly type: 'ON_USER_ERROR',
    payload: any
} 

export interface UserLogoutAction  {
    readonly type: 'ON_AUTH_LOGOUT',
    payload: any
} 


export interface UserLoginAction  {
    readonly type: 'ON_AUTH_LOGIN',
    payload: any
} 


export type UserAction = UpdataLocationAction | UserErrorAction | UserLoginAction | UserLogoutAction

export const onUpdateLocation:any = (location : LocationGeocodedAddress)=> {
    return (dispatch : any) => {
        try {
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

const  onLogoutAction = async () => {
    await AsyncStorage.removeItem('token')
    return (dispatch : any) => {
        dispatch({
            type : "ON_AUTH_LOGOUT",
            payload : {
                token : null
            }
        })
    }
}

const  onSinginAction = (token:string) => {
    return (dispatch : any) => {
        dispatch({
            type : "ON_AUTH_LOGIN",
            payload : {
                token : token
            }
        })
    }
}



export const onSignIn :any = (email : string, password : string) => {
    return async(dispatch : any)=>{
        let data = {
            email : email,
            password : password
        }
        await axios.post(userUrl+"login",data)
        .then(async(res)=>{
            let authToken = res.data.token;
            await AsyncStorage.setItem('token',authToken)
            dispatch(onSinginAction(authToken));
        })
        .catch(err => {
            console.log("Auth login : ",err.message)
            throw new Error(err.message)
        })
    }
}


export const onLogout = () => {
    onLogoutAction()
}
