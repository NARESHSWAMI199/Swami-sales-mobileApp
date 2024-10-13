// import { useContext } from "react";
import React from "react";
import { NavigationScreenProp,NavigationRoute,NavigationContext, NavigationParams } from "react-navigation";

export function useNavigation() {
    return React.useContext(NavigationContext) as NavigationScreenProp<NavigationRoute,NavigationParams>
}