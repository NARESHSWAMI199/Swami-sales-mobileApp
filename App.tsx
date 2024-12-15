import { Image, StatusBar, StyleSheet } from 'react-native';
import { LandingScreen } from './src/screens/LandingPage';


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './src/redux';
import HomeScreen from './src/screens/HomeScreen';
import ItemDetail from './src/screens/ItemDetail';
import Items from './src/screens/Items';
import { themeColor } from './src/utils/utils';
import StoreDetail from './src/screens/StoreDetail';
import ItemFilters from './src/screens/ItemFilters';
import SubCategirzedItems from './src/screens/SubCategirzedItems';
import Stores from './src/screens/Stores';
import CategirzedItems from './src/screens/CategirzedItems';
import SubCategirzedStores from './src/screens/SubCategirzedStores';
import Login from './src/screens/Login';
import EditProfile from './src/screens/EditProfile';
import Settings from './src/screens/Settings';
import SignUp from './src/screens/Signup';
import Slips from './src/screens/Slips';
import SlipItems from './src/screens/SlipItems';

const {Navigator, Screen} = createStackNavigator();



const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (<Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarStyle: {height : 60 }
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title : 'Swami Sales',
            headerTintColor: 'white',
            headerTitleAlign : 'left',
            headerStyle: {
              backgroundColor: themeColor,
              elevation: 0,
              shadowOpacity: 0,
              borderWidth: 0,   
            },
            header:  ()=> null,
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
            header : ()=>null,
            tabBarLabel: 'Items',
            tabBarIcon:  ({ focused, color }) => {
              let icon = focused == true ? require("./src/images/offer_red.png") :
                require("./src/images/offer.png")
              return <Image source={icon} style={styles.tabIcon} />
            },
          }}
        />


  <Tab.Screen 
          name="Stores"
          component={Stores}
          options={{
            header : ()=>null,
            tabBarLabel: 'Stores',
            tabBarIcon:  ({ focused, color }) => {
              let icon = focused == true ? require("./src/images/red_store.png") :
                require("./src/images/store.png")
              return <Image source={icon} style={styles.tabIcon} />
            },
          }}
        />

      <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            header : ()=> null,
            tabBarLabel: 'Settings',
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

  return (<Provider store={store}>
      <NavigationContainer >
        <Navigator>
        <Screen name="landing" component={LandingScreen}  options={{header : ()=>null}}/>
        <Screen name="tab" component={BottomTabNavigator} options={{ 
            header : ()=> null,
        }}
        
        

        />
        <Screen name="home" component={HomeScreen}  />
        <Screen name="items" component={Items} 
          options={{
            headerTitle : 'All Items',
            header : ()=>null
          }}
        />

        <Screen name="stores" component={Stores} 
            options={{
              headerTitle : 'All Stores',
              header : ()=>null
            }}
          />

        <Screen name="subCategrizedItems" component={SubCategirzedItems}/> 
        <Screen name="subCategrizedStores" component={SubCategirzedStores}/> 
        <Screen name="categrizedItems" component={CategirzedItems}/>       
        <Screen name="itemFilter" component={ItemFilters} 
          options={{
            title : "Searched Items",
            header:  () => null 
          }}
        />
        <Screen name="itemDetail" component={ItemDetail} 
        options={{
          title : "Item Detail",
          headerTitleAlign:'center',
          headerStyle: {
          },
          header : () => null
          }} />

          <Screen name="storeDetail" component={StoreDetail}
              options={{
              title : "Item Detail",
              headerTitleAlign:'center',
              headerStyle: {
              },
              header : () => null
              }}
          />

          <Screen
            name='editProfile'
            component={EditProfile}
            options={{
              title : "Edit Profile",
              headerTitleAlign: 'center',
              headerStyle: {
              },
              header: () => null
            }}
          
          />

          <Screen
            name='login'
            component={Login}
            options={{
              title : "Edit Profile",
              headerTitleAlign: 'center',
              headerStyle: {
              },
              header: () => null
            }}
          />

        <Screen
            name='signUp'
            component={SignUp}
            options={{
              title : "Edit Profile",
              headerTitleAlign: 'center',
              headerStyle: {
              },
              header: () => null
            }}
          
          />    

        <Screen
            name='slips'
            component={Slips}
            options={{
              title : "Slips",
              headerTitleAlign: 'center',
              headerStyle: {
              },
              header: () => null
            }}
          />    



        <Screen
            name='slipItems'
            component={SlipItems}
            options={{
              title : "Slip Items",
              headerTitleAlign: 'center',
              headerStyle: {
              },
              header: () => null
            }}
          />    


      </Navigator>
      
    </NavigationContainer>
  </Provider>);
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

