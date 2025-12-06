import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'

function NetworkError(props:any) {
  const { route, navigation } = props;
  const { message, onRetry } = route.params;

  return (
   <View style={style.main}>
        <Image
            style={{ width: 150, height: 150, alignSelf: 'center' }}
            source={require('../../assets/network_error.png')}
        />
        <Text>{message}</Text>
        <TouchableOpacity style={style.button}  onPress={onRetry} > 
            <Text >Retry</Text>
        </TouchableOpacity>
   </View>
  )
}

const style =  StyleSheet.create({
  main : {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'white'
  },
  button : {
    marginTop: 20,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: '#001475',
    borderWidth: 1
  }
})

export default NetworkError