import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
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
        setToken(await props.token)
    }
    getData();
    setError(props.error)
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
                Login
            </Text>
        </TouchableOpacity> 
      {!!error && <Text style={style.error}>{error}</Text>}
    </View>
    }
    
  
  </>
  );
};


const style = StyleSheet.create({
    textInput : {
        height : 50,
        width : '100%',
        borderWidth : 0.2,
        borderColor : 'gray',
        paddingHorizontal : 15,
        borderRadius : 5,
        marginVertical : 5
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
        width : 340,
        backgroundColor : themeColor,
        alignItems  : 'center',
        justifyContent : 'center',
        color : 'white',
        marginVertical : 20
    },
    header : {
        fontWeight : 'bold',
        fontSize : 18,
        marginVertical : 10,
        alignSelf : 'flex-start'
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
    }

})

const mapToStateProps = (state:ApplicationState) =>{
    return {
        token : state.userReducer.user?.token,
        error : state.userReducer.user?.error
    }
}

export default connect(mapToStateProps) (Login);