
/** import { FoodAvailability, ShoppingState } from "../models"
import { ShoppingAction } from "../actions/shoppingActions"



const initialState  : ShoppingState =  {
    availabilty : {} as FoodAvailability
}

const shoppingReducer = (state : ShoppingState = initialState  , action : ShoppingAction) =>{

    switch (action.type){
        case 'ON_AVAILABILITY':
            return {
                ...state,
                availability : action.payload
            }
        default :
            return state 
    }

}


export {shoppingReducer }
*/