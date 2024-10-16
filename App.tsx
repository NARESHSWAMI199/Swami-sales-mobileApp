import { StyleSheet, Image } from 'react-native';
import { LandingScreen } from './src/screens/LandingPage';


import { Provider } from 'react-redux';
import { store } from './src/redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from './src/screens/HomeScreen';
import Items from './src/screens/Items';
import {createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ItemDetail from './src/screens/ItemDetail';

const {Navigator, Screen} = createStackNavigator();



const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) => {
            let icon = focused == true ? require("./src/images/home_red.png") :
              require("./src/images/home.png")
            return <Image source={icon} style={styles.tabIcon} />
          },
        }}
      />
      <Tab.Screen 
        name="Items"
        component={Items}
        options={{
          tabBarLabel: 'Items',
          tabBarIcon:  ({ focused, color }) => {
            let icon = focused == true ? require("./src/images/offer_red.png") :
              require("./src/images/offer.png")
            return <Image source={icon} style={styles.tabIcon} />
          },
        }}
      />


<Tab.Screen 
        name="Slip"
        component={Items}
        options={{
          tabBarLabel: 'Slip',
          tabBarIcon:   ({ focused, color }) => {
            let icon = focused == true ? require("./src/images/red_cart.jpeg") :
              require("./src/images/cart.png")
            return <Image source={icon} style={styles.tabIcon} />
          },
        }}
      />



    <Tab.Screen
        name="User"
        component={HomeScreen}
        options={{
          tabBarLabel: 'User',
          tabBarIcon:   ({ focused, color }) => {
            let icon = focused == true ? require("./src/images/user_red.png") :
              require("./src/images/profile.png")
            return <Image source={icon} style={styles.tabIcon} />
          }
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {

  return (<>
  
  <Provider store={store}>
      <NavigationContainer >
        <Navigator>
        <Screen name="landing" component={LandingScreen} />
        <Screen name="tab" component={BottomTabNavigator} options={{title : 'Swami Sales',headerTitleAlign : 'center'}} />
        <Screen name="home" component={HomeScreen}  />
        <Screen name="items" component={Items}  />
        <Screen name="itemDetail" component={ItemDetail} options={{title : "Item Detail",headerTitleAlign:'center'}} />
      </Navigator>
    </NavigationContainer>
  </Provider>
  </>

    

  
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

