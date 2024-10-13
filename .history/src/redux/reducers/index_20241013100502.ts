import { combineReducers } from "redux";
//import { shoppingReducer } from "./shoppingReducers";
import { userReducer } from "./userReducers";

const rootReducer = combineReducers({
   // shoppingReducer : shoppingReducer,
    userReducer : userReducer
})

export type ApplicationState = ReturnType<typeof rootReducer>
export  {rootReducer}