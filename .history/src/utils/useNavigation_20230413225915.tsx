import React ,{ useContext } from "react";
import { NavigationScreenProp,NavigationRoute,NavigationContext, NavigationParams } from "react-navigation";

export const useNavigation() => {
    return useContext(NavigationContext) as NavigationScreenProp<NavigationRoute,NavigationParams>
}