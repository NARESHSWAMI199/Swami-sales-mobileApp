import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Pressable } from 'react-native';
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import { bodyColor, themeColor } from '../utils/utils';
import { ApplicationState, onLogout, onSignIn } from '../redux';
import { connect, useDispatch } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = (props : any) => {

    const {
        token
    } = props

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch()

  useEffect(()=>{
    const getData = async()=>{
        alert(await props.token)
    }
    getData()
  },[])

  const handleLogin = () => {
    console.log('Logging in with email:', email, 'and password:', password); 
    try {
        // onLogout()
        dispatch(onSignIn(email,password))
    }catch(err){
        setError(err)
    }
  };

  return (
    <View style={style.body}>
        <Text style={style.header}>
            Login
        </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={style.textInput}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={style.textInput}
      />
        <TouchableOpacity
        onPress={handleLogin}
        style={style.button}
        accessibilityLabel="Learn more about this purple button"
        >
            <Text style={{
                fontSize : 14, 
                fontWeight : 'bold',
                color : 'white'
                }} >
            LOGIN
            </Text>
        </TouchableOpacity>
      {error && <Text>{error}</Text>}
    </View>
  );
};


const style = StyleSheet.create({
    textInput : {
        height : 60,
        width : '100%',
    },
    body : {
      marginHorizontal : 10,  
      display : 'flex',
      flexDirection : 'column',
      justifyContent : 'center',
      alignItems : 'center',
      backgroundColor : bodyColor,
      height : '100%'
    },
    button : {
        borderRadius : 5,
        height : 45,
        width : '100%',
        backgroundColor : themeColor,
        alignItems  : 'center',
        justifyContent : 'center',
        color : 'white',
        marginVertical : 20
    },
    header : {
        fontWeight : 'bold',
        fontSize : 18
    }

})

const mapToStateProps = (state:ApplicationState) =>{
    return {
        token : state.userReducer.user.token
    }
}

export default connect(mapToStateProps) (Login);