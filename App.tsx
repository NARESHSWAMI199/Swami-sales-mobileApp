import { StatusBar, StyleSheet } from 'react-native';
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
import { Ionicons } from '@expo/vector-icons';
import AddToSlip from './src/screens/AddToSlip';
import AddItemReview from './src/screens/AddItemReview';
import NetworkError from './src/screens/NetworkError';
import { useEffect, useState } from 'react';
import { logInfo } from './src/utils/logger';
import { useNetInfo } from '@react-native-community/netinfo';
import { handleNetworkError } from './src/utils/commonUtils';
import { log } from 'react-native-reanimated';

const { Navigator, Screen } = createStackNavigator();

const Tab = createBottomTabNavigator();

const BottomTabNavigator = (props) => {
  const {route, navigation} = props;
  const {retry} = route.params || {};
  const netInfo = useNetInfo();

  const tabScreensInitial = [
      {
        name: "Home",
        component: HomeScreen,
        options: {
          title: "Swami Sales",
          headerTintColor: "white",
          headerTitleAlign: "left",
          headerStyle: {
            backgroundColor: themeColor,
            elevation: 0,
            shadowOpacity: 0,
            borderWidth: 0,
          },
          header: () => null,
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        },
      },

      {
        name: "Items",
        component: Items,
        options: {
          header: () => null,
          tabBarLabel: "Items",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "pricetag-sharp" : "pricetag-outline"}
              size={24}
              color={color}
            />
          ),
        },
      },

      {
        name: "Stores",
        component: Stores,
        key: "stores",
        options: {
          header: () => null,
          tabBarLabel: "Stores",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "cart-sharp" : "cart-outline"}
              size={24}
              color={color}
            />
          ),
        },
      },

      {
        name: "Settings",
        component: Settings,
        options: {
          header: () => null,
          tabBarLabel: "Settings",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "settings-sharp" : "settings-outline"}
              size={24}
              color={color}
            />
          ),
        },
      },

    ]

  const [tabScreens, setTabScreens] = useState([...tabScreensInitial]);
  useEffect(()=>{
    if(netInfo.isConnected != null && netInfo.isConnected == false){
      handleNetworkError("Internet is not connected", navigation);
    }
    logInfo(`BottomTabNavigator detected retry param change: ${retry}`);
    setTabScreens([...tabScreens]);
  },[retry,netInfo.isConnected]);

  return (
    <Tab.Navigator
      key={retry}
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: { height: 60 },
        tabBarActiveTintColor: themeColor,
        tabBarInactiveTintColor: 'gray',
      }}
    >
    {tabScreens.map((screen) => (
      <Tab.Screen
        key={screen.name + '_' + retry}
        name={screen.name}
        component={screen.component}
        initialParams={{retry}}
        options={screen.options}
      />
    ))}
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Navigator>
          <Screen name="landing" component={LandingScreen} options={{ header: () => null }} />
          <Screen name="tab" component={BottomTabNavigator} options={{ header: () => null }} />
          <Screen name="home" component={HomeScreen} />
          <Screen name="items" component={Items} options={{ header: () => null }} />
          <Screen name="stores" component={Stores} options={{ header: () => null }} />
          <Screen name="subCategrizedItems" component={SubCategirzedItems} />
          <Screen name="subCategrizedStores" component={SubCategirzedStores} />
          <Screen name="categrizedItems" component={CategirzedItems} />
          <Screen name="itemFilter" component={ItemFilters} options={{ header: () => null }} />
          <Screen name="itemDetail" component={ItemDetail} options={{ header: () => null }} />
          <Screen name="storeDetail" component={StoreDetail} options={{ header: () => null }} />
          <Screen name="editProfile" component={EditProfile} options={{ header: () => null }} />
          <Screen name="login" component={Login} options={{ header: () => null }} />
          <Screen name="signUp" component={SignUp} options={{ header: () => null }} />
          <Screen name="slips" component={Slips} options={{ header: () => null }} />
          <Screen name="slipItems" component={SlipItems} options={{ header: () => null }} />
          <Screen name="AddToSlip" component={AddToSlip} options={{ header: () => null }} />
          <Screen name="addItemReview" component={AddItemReview} options={{ header: () => null }} />
          <Screen name="networkError" component={NetworkError} options={{ header: () => null }} />
        </Navigator>
      </NavigationContainer>
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
});

