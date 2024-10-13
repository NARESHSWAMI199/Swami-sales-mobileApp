import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { LandingPage } from './src/screens/LandingPage';



import { createAppContainer,createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { HomeScreen } from './src/screens/HomeScreen';




const switchNavigator = createSwitchNavigator({
  landingStack : {
  screen : createStackNavigator({
    // search address screen
    LandingPage: LandingPage,
  },
  {
    defaultNavigationOptions : {
      headerShown : false
  }
  })
},homeStack : createBottomTabNavigator({

  home : {
    screen : createStackNavigator({
      HomePage : HomeScreen
    }),
    navigationOptions : {
      tabBarIcon : ({focused,tintColor}) =>{
        let icon = focused  == true ? require("./src/images/location.png") :
          require("./src/images/location.png")
          return <Image source={icon} style={styles.tabIcon}/>
      } 
    }
  }

})


})






export default function App() {

  return (
    <LandingPage />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon : {
    width : 30,
    height : 30
  }
});
