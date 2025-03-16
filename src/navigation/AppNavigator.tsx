import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import ItemDetail from '../screens/ItemDetail';
import AddReview from '../screens/AddItemReview';

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        title: 'Home',
      },
    },
    ItemDetail: {
      screen: ItemDetail,
      navigationOptions: {
        title: 'Item Detail',
      },
    },
    AddReview: {
      screen: AddReview,
      navigationOptions: {
        title: 'Add Review',
      },
    },
  },
  {
    initialRouteName: 'Home',
  }
);

export default createAppContainer(AppNavigator);