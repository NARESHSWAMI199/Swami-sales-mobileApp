import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { LandingPage } from './src/screens/LandingPage';



import { createAppContainer,createSwitchNavigator } from 'react-navigation';




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
});
