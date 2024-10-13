import { LocationGeocodedAddress } from "expo-location"



//category 
export interface Category {
    title  : string,
    icon  : String
}

// Food Model
export interface FoodModel {
    _id : string,
    name : string
    description : string,
    category : string,
    price : number,
    readTime : number,
    image : [string]
}

// Restaurant Model
export interface RestaurantModel {
    _id : string,
    name : string,
    foodType : string,
    address : string,
    phone : string,
    images : string,
    foods : [FoodModel]
}

// Food Avalibilty 
export interface FoodAvailability {
    categories : [Category]
    restaurants : [RestaurantModel]
    foods : [FoodModel]
}


// User Model 
export interface UserModel {
    firstName : string,
    lastName  : string,
    contactNumber : string,
    token : string
}


export interface UserState {
    user : UserModel,
    //location : LocationGeocodedAddress 
    error : string | undefined
}


export interface ShoppingState {
    availabilty : FoodAvailability 
}