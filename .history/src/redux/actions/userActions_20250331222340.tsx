
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { LocationGeocodedAddress } from "expo-location";
import { userUrl } from "../../utils/utils";
import { tokens } from 'react-native-paper/lib/typescript/styles/themes/v3/tokens';
import { logError, logInfo } from '../../utils/logger';

export interface UpdateLocationAction {
    readonly type : 'ON_UPDATE_LOCATION',
    payload : LocationGeocodedAddress
} 


export interface UserErrorAction  {
    readonly type: 'ON_USER_ERROR',
    payload: any
} 

export interface UserAuthErorrAction  {
    readonly type: 'ON_AUTH_ERROR',
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


export type UserAction = UpdateLocationAction | UserErrorAction | UserLoginAction | UserLogoutAction | UserAuthErorrAction

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

const  onLogoutAction = () => {
    const removeToken = async() =>{
        axios.defaults.headers['Authorization'] = null
        await AsyncStorage.removeItem('token')
        await AsyncStorage.removeItem('user')
    }
    removeToken()
    return {  
        type : "ON_AUTH_LOGOUT",
        payload : {
            token : null,
            user : null
        }
    }
}


const onAuthFailed = (error:string) =>{
    return {
        type: 'ON_AUTH_ERROR',
        payload : {
            error: error
        }
    }
}



const  onSingInAction = (payload:any) => {
    return {
        type : "ON_AUTH_LOGIN",
        payload : {
            ...payload
        }
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
            let response = res.data;
            let authToken = response.token;
            let user = response.user;
            axios.defaults.headers['Authorization'] = authToken
            await AsyncStorage.setItem('token',authToken)
            await AsyncStorage.setItem('user', JSON.stringify(user))
            let payload = {
                token : authToken,
                user : user,
                error : null
            }
            dispatch(onSingInAction(payload));
            dispatch(checkAuthTimeout(72 * 60 * 60 * 60));
        })
        .catch(err => {
            logError(err.message)
            // logError("Auth login : "+err.response?.data.message)
            // dispatch(onAuthFailed(!!err.response ? err.response.data.message : err.message))
        })
    }
}


export const onLogout : any = () => {
    return async(dispatch:any) => {
        dispatch(onLogoutAction())
    }
}


export const checkAuthTimeout = expirationTime => {
    return dispatch => {
        setTimeout(() => {
            dispatch(onLogoutAction());
        }, expirationTime)
    }
}

export const authCheckState = () => {
    return async (dispatch : any) => {
        const token = await AsyncStorage.getItem('token');
        console.log(token)
        if (token === undefined || token === null) {
            dispatch(onLogoutAction());
        } else {
            dispatch(onSingInAction(token));
        }
    }
}