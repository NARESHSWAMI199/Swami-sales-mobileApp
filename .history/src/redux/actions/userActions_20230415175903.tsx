
import axios from "axios";
import { Dispatch } from "react";
import { BASE_URL } from "../../utils";
import { LocationGeocodedAddress } from "expo-location";



export interface UpdataLocationAction {
    readonly type : 'ON_UPDATE_LOCATION',
    payload : LocationGeocodedAddress
} 