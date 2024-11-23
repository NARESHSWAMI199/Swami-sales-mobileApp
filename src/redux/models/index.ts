import { LocationGeocodedAddress } from "expo-location"
import { Float } from "react-native/Libraries/Types/CodegenTypes"



//category 
// export interface Category {
//     title  : string,
//     icon  : String
// }

// Food Model
// export interface FoodModel {
//     _id : string,
//     name : string
//     description : string,
//     category : string,
//     price : number,
//     readTime : number,
//     image : [string]
// }

// Restaurant Model
// export interface RestaurantModel {
//     _id : string,
//     name : string,
//     foodType : string,
//     address : string,
//     phone : string,
//     images : string,
//     foods : [FoodModel]
// }

// Food Avalibilty 
// export interface FoodAvailability {
//     categories : [Category]
//     restaurants : [RestaurantModel]
//     foods : [FoodModel]
// }


// User Model 
export interface UserModel {
    // firstName : string,
    // lastName  : string,
    // contactNumber : string,
    // slug : string,
    token : any
}


export interface UserState {
    user : UserModel,
    location : LocationGeocodedAddress ,
    error : string | undefined
}


// export interface ShoppingState {
//     availabilty : FoodAvailability 
// }


export interface Item {
    id: number,
    name: String,
    label: string,
    price: Float,
    discount: Float,
    description: string,
    avatars: string,
    rating: Float,
    slug : string
}

export interface Store {
    id: number,
    name: String,
    label: string,
    price: Float,
    discount: Float,
    description: string,
    avatar: string,
    rating: Float,
    slug : string,
    storeCategory : Category,
    storeSubCategory : Subcategory
}





export interface Category {
    id: number,
    category: string,
    icon: string
}

export interface Subcategory {
    id: number,
    categoryId: number,
    subcategory : string,
    icon: string
}


