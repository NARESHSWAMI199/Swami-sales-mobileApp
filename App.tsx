import { StyleSheet, Image } from 'react-native';
import { LandingScreen } from './src/screens/LandingPage';


import { Provider } from 'react-redux';
import { store } from './src/redux';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { HomeScreen } from './src/screens/HomeScreen';
import Items from './src/screens/Items';




const switchNavigator = createSwitchNavigator({
  landingStack: {
    screen: createStackNavigator({
      // search address screen
      Landing: LandingScreen,
    },
      {
        defaultNavigationOptions: {
          headerShown: false
        }
      })
  },
   homeStack: createBottomTabNavigator({

    // home icon
    home: {
      screen: createStackNavigator({
        HomePage: HomeScreen
      }),
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          let icon = focused == true ? require("./src/images/home_red.png") :
            require("./src/images/home.png")
          return <Image source={icon} style={styles.tabIcon} />
        }
      }
    },
    // home icon
    Items: {
      screen: createStackNavigator({
        Items : Items
      }),
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          let icon = focused == true ? require("./src/images/offer_red.png") :
            require("./src/images/offer.png")
          return <Image source={icon} style={styles.tabIcon} />
        }
      }
    },
    // home icon
    Cart : {
      screen: createStackNavigator({
       Cart : HomeScreen
      }),
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          let icon = focused == true ? require("./src/images/red_cart.jpeg") :
            require("./src/images/cart.png")
          return <Image source={icon} style={styles.tabIcon} />
        }
      }
    },
    // home icon
    Profile : {
      screen: createStackNavigator({
        Profile : HomeScreen
      }),
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          let icon = focused == true ? require("./src/images/user_red.png") :
            require("./src/images/profile.png")
          return <Image source={icon} style={styles.tabIcon} />
        }
      }
    }

  })


})


const AppNavigation = createAppContainer(switchNavigator)



export default function App() {

  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    width: 30,
    height: 30
  }
});

