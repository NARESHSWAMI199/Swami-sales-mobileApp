import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { ApplicationState, onSignIn, UserModel } from '../redux';
import { authUrl, bodyColor, defaultAvtar, themeColor } from '../utils/utils';
import { toTitleCase } from '../utils';
import { Icon } from 'react-native-elements'

const SingUp = (props:any) => {

    const {
        navigation
    } = props

    const dispatch = useDispatch()

    const [userData, setUserData] = useState({
        username : '',
        email: '',
        contact: '',
        password: '',
        confirm : ''

    });

    const [errors, setErrors] = useState({
        username: '',
        email: '',
        contact: '',
        password: '',
        confirm : ''
    });

    const handleChange = (key:string, value:string) => {
        setUserData({ ...userData, [key]: value });
    };

    const [user,setUser] = useState<UserModel>()
    const [token,setToken] = useState()

    useEffect(()=>{
        const getData = async () =>{
            let user = await props.user
            let token = await props.token
            setUser(JSON.parse(user))
            setToken(token)
        }
        getData()
    },[props.user,props.token])

    useEffect(()=>{
        if(!!user && !!token)
        axios.defaults.headers['Authorization'] = token
        axios.get(authUrl+user?.slug)
        .then(res=>{
            setUserData(res.data)
        }).catch(err=>console.log("Edit Profile get : "+err.message))
    },[user,token])

    const handleGoBack = () => {
        props.navigation.goBack();
    };

    const handleSubmit = async() => {

        if(userData.confirm != userData.password){
            setErrors({
                ...errors,
                confirm : "Password and confrim password doesn't match."
            })
            return false;
        }

        axios.defaults.headers['Authorization'] = token
        axios.post(authUrl + "register",userData)
        .then(res=>{
            alert(toTitleCase(res.data.message))
            dispatch(onSignIn(userData.email,userData.password))
            navigation.navigate("Settings")           
        }).
        catch(err=>console.log("Edit Profile get : "+err.message))
    };

    const handleLogin = () => {
        navigation.navigate('login')
    }

    return (<>
        <ImageBackground
            source={require('../images/bg1.png')}
            style={styles.image}
            resizeMode = 'cover'
        >
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <View style={styles.container}>
            <View style={styles.backSupport}></View>
            <View style={{position : 'absolute', left : 35 , right :35}}>
                <View style={styles.heading}>
                <TouchableOpacity style={styles.goBack} onPress={handleGoBack}>
                    <Icon name="arrow-back" type="material" size={24} color="white" />
                    <Text style={styles.goBackText}>Back</Text>
                </TouchableOpacity>
                    <Text style={styles.textHeading} >
                        Create a new account?
                    </Text>
                    <Image source={{uri : defaultAvtar}} style={styles.avatar} />
                </View>
                <Text style={styles.label}>Name:</Text>
                <TextInput
                    placeholder='Name'
                    style={[styles.input, errors.username ? styles.errorInput : null]}
                    value={userData.username}
                    onChangeText={(username) => handleChange('username', username)}
                    placeholderTextColor ={bodyColor}
                />
                {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

                <Text style={styles.label}>Email:</Text>
                <TextInput
                    placeholder='Email'
                    style={[styles.input, errors.email ? styles.errorInput : null]}
                    value={userData.email}
                    onChangeText={(text) => handleChange('email', text)}
                    placeholderTextColor={bodyColor}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                <Text style={styles.label}>Mobile:</Text>
                <TextInput
                    placeholder='Mobile'
                    style={[styles.input, errors.contact ? styles.errorInput : null]}
                    multiline
                    numberOfLines={4}
                    value={userData.contact}
                    onChangeText={(text) => handleChange('contact', text)}
                    placeholderTextColor={bodyColor}
                />


            <Text style={styles.label}>Password :</Text>
                <TextInput
                    placeholder='Password'
                    style={[styles.input, errors.password ? styles.errorInput : null]}
                    multiline
                    numberOfLines={4}
                    value={userData.password}
                    onChangeText={(text) => handleChange('password', text)}
                    placeholderTextColor={bodyColor}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}



                <Text style={styles.label}>Confirm:</Text>
                <TextInput
                    placeholder='Confirm'
                    style={[styles.input, errors.confirm ? styles.errorInput : null]}
                    multiline
                    numberOfLines={4}
                    value={userData.confirm}
                    onChangeText={(text) => handleChange('confirm', text)}
                    placeholderTextColor={bodyColor}
                />
                {errors.confirm && <Text style={styles.errorText}>{errors.confirm}</Text>}

                <TouchableOpacity onPress={handleLogin}>
                    <Text style={styles.loginText}>
                        Already have an account?
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
     </ImageBackground>
     </>
    );
}

const styles = StyleSheet.create({
    container : {
        // paddingHorizontal : 40,
        height : '100%',
        justifyContent : 'center'
    },
    errorInput: {
        borderColor: 'red',
        borderWidth: 1,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
    },
    label : {
        fontSize : 14,
        fontWeight :'bold',
        color : bodyColor,
        display : 'none'
    },
    input : {
        borderWidth : 1,
        height : 50,
        borderRadius : 10,
        marginVertical : 5,
        paddingHorizontal : 10,
        borderColor : bodyColor,
        color : bodyColor
    },
    button : {
        backgroundColor : themeColor,
        height : 45,
        justifyContent :'center',
        alignItems : 'center',
        width : '100%',
        marginVertical : 10,
        borderRadius : 10
    },
    buttonText : {
        color : bodyColor
    },
    heading : {

    },
    textHeading : {
        fontWeight :'bold',
        color : bodyColor,
        fontSize : 28,
        marginVertical : 20,
        width : 180
    },
    image : {
        height : '100%',
        width : '100%'
    },
    avatar : {
        height : 90,
        width : 90,
        borderRadius : 50,
        alignSelf : 'center',
        marginVertical : 10,
        borderWidth : 1,
        borderColor : 'white'
    },
    backSupport : {
        backgroundColor : 'gray',
        opacity : 0.3,
        top : 70,
        height: 420,
        position : 'relative',
        width : '92%',
        alignSelf : 'center',
        borderRadius : 10
    },
    loginText : {
        color : 'gray',
        alignSelf : 'flex-end',
        marginVertical : 3,
        fontWeight :'bold'
    },
    goBack: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 40,
        marginLeft: 10,
    },
    goBackText: {
        color: 'white',
        marginLeft: 5,
    },
});


const mapToStateProps = (state : ApplicationState) => {
    return {
        token : state.userReducer.token,
        user : state.userReducer.user
    }
}

export default connect(mapToStateProps)(SingUp)