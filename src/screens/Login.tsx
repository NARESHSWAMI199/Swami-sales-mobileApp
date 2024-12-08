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
      if (!!authToken) navigation.navigate('tab')
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


  const handleSingup = () =>{
    navigation.navigate("signUp")
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
            <View style={style.backSupport}></View>
        <View style={style.container}>

          <Text style={style.headerText}>
              Already have an account ?
          </Text>
          <View>
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

          <View>
            <Text style={style.forgotPassword}>
              Forgot Password ?
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            accessibilityLabel="Learn more about this purple button"
            style={style.button}
            >
                <Text style={{
                    fontSize : 14, 
                    fontWeight : 'bold',
                    color : 'white'
                    }} >
                    Login
                </Text>
            </TouchableOpacity> 

            <TouchableOpacity
              onPress={handleSingup}
              accessibilityLabel="Learn more about this purple button"
              style={style.button}
              >
                  <Text style={{
                      fontSize : 14, 
                      fontWeight : 'bold',
                      color : 'white'
                      }} >
                    Don't have any account ?
                  </Text>
              </TouchableOpacity> 


        {!!error && <Text style={style.error}>{error}</Text>}
        </View>
    </View>
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
        marginVertical : 5,
        color : 'white'
    },
    body : {
      display : 'flex',
      justifyContent : 'center',
      height : '100%',
    },
    container : {
      display : 'flex',
      position : 'absolute',
      left : 35,
      right : 35,
    },
    button : {
        borderRadius : 10,
        height : 45,
        width : '100%',
        backgroundColor : themeColor,
        alignItems  : 'center',
        justifyContent : 'center',
        color : 'white',
        marginTop: 10,
    },
    headerText : {
        fontWeight : 'bold',
        fontSize : 28,
        color : bodyColor,
        width : 180,
        marginBottom : 40
    },
    error : {
      color : 'red'
    },
    logout : {
      display : 'flex',
      flexDirection : 'column',
      justifyContent : 'center',
      alignItems : 'center',
      height : '100%',
      position : 'absolute'
    },
    image: {
      height: '100%',
      width: '100%'
    },
    backSupport : {
      backgroundColor : 'gray',
      opacity : 0.2,
      height: 260,
      position : 'relative',
      width : '94%',
      alignSelf : 'center',
      borderRadius : 10,
      top : 40
  },
  forgotPassword : {
    color : 'gray',
    alignSelf : 'flex-end',
    marginVertical : 5,
    fontWeight : 'bold'
  }

})

const mapToStateProps = (state:ApplicationState) =>{
    return {
        token : state.userReducer?.token,
        error : state.userReducer?.error
    }
}

export default connect(mapToStateProps) (Login);