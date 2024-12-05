import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, View, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect, useDispatch } from 'react-redux';
import { ApplicationState, onLogout, onSignIn } from '../redux';
import { bodyColor, themeColor } from '../utils/utils';


const Login = (props : any) => {
    const {
        navigation
    } = props

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch()
  const [token,setToken] = useState(null)

  useEffect(()=>{
    const getData =  async() =>{
      let authToken = await props.token
      if(!!authToken){
        navigation.navigate('editProfile');
      }
      setToken(authToken)
    }
    getData();
    setError(props.error);

  },[props.error,props.token])

  const handleLogin = () => {
      console.log('Logging in with email:', email, 'and password:', password); 
      if(!!email && !!password){
          dispatch(onSignIn(email,password))
      }else{
        alert(("Email and password both are required."))
      }
  };

  const handleLogout = () => {
    dispatch(onLogout())
  }

  return ( <>
    <ImageBackground
      source={require('../images/bg1.png')}
      style={style.image}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

  {token ?
    <View style={style.logout}>
      <TouchableOpacity style={style.button} onPress={handleLogout} >
      <Text 
        style={{
          fontSize : 14, 
          fontWeight : 'bold',
          color : 'white'
          }}> 
        Logout
        </Text>
      </TouchableOpacity>
    </View>
     : 
     <View style={style.body}>
        <Text style={style.header}>
            Sign In
        </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={style.textInput}
        placeholderTextColor={bodyColor}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={style.textInput}
        placeholderTextColor={bodyColor}

      />
      <View style={style.button}>
        <TouchableOpacity
        onPress={handleLogin}
        accessibilityLabel="Learn more about this purple button"
        >
            <Text style={{
                fontSize : 14, 
                fontWeight : 'bold',
                color : 'white'
                }} >
                Login
            </Text>
        </TouchableOpacity> 
      </View>
      {!!error && <Text style={style.error}>{error}</Text>}
    </View>
    }
    
  </ImageBackground>
  </>
  );
};


const style = StyleSheet.create({
    textInput : {
        height : 50,
        width : '100%',
        borderWidth : 1,
        borderColor : bodyColor,
        paddingHorizontal : 10,
        borderRadius : 10,
        marginVertical : 5
    },
    body : {
      paddingHorizontal : 40,  
      display : 'flex',
      flexDirection : 'column',
      justifyContent : 'center',
      alignItems : 'center',
      // backgroundColor : bodyColor,
      height : '100%'
    },
    button : {
        borderRadius : 10,
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
        fontSize : 20,
        marginVertical : 10,
        alignSelf : 'flex-start',
        color : bodyColor
    },
    error : {
      color : 'red'
    },
    logout : {
      display : 'flex',
      flexDirection : 'column',
      justifyContent : 'center',
      alignItems : 'center',
      height : '100%'
    },
    image: {
      height: '100%',
      width: '100%'
    }

})

const mapToStateProps = (state:ApplicationState) =>{
    return {
        token : state.userReducer.user?.token,
        error : state.userReducer.user?.error
    }
}

export default connect(mapToStateProps) (Login);