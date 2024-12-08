import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { ApplicationState, UserModel } from '../redux';
import { authUrl, bodyColor, defaultAvtar, themeColor } from '../utils/utils';
import { toTitleCase } from '../utils';



const EditProfile = (props:any) => {
    const [userData, setUserData] = useState({
        username : '',
        email: '',
        contact: '',
        userType : 'Retailer'
    });

    const [errors, setErrors] = useState({
        username: '',
        email: '',
        contact: '',
        userType : ''
    });

    const handleChange = (key:string, value:string) => {
        setUserData({ ...userData, [key]: value });
    };

    const [user,setUser] = useState<UserModel>()
    const [token,setToken] = useState()
    const [message,setMessage] = useState()


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
            setUserData({...res.data,userType : 'Retailer'})
        }).catch(err=>console.log("Edit Profile get : "+err.message))
    },[user,token])



    const handleSubmit = () => {
        axios.defaults.headers['Authorization'] = token
        axios.post(authUrl + "update",userData)
        .then(res=>{
            alert(toTitleCase(res.data.message))
        }).
        catch(err=>console.log("Edit Profile get : "+err.message))
    };

    return (<>
        <ImageBackground
            source={require('../images/bg1.png')}
            style={styles.image}
            resizeMode = 'cover'
        >
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <View style={styles.container}>

        <View style={styles.backSupport}></View>
    
        <View style={styles.main}>
            <Text style={styles.textHeading} >
                Want update your profile ?
            </Text>

            <Image source={{uri : defaultAvtar}} style={styles.avatar} />
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
            {errors.contact && <Text style={styles.errorText}>{errors.contact}</Text>}


            <Text style={styles.label}>User Type:</Text>
            <TextInput
                placeholder='User Type'
                style={[styles.input, errors.userType ? styles.errorInput : null]}
                multiline
                numberOfLines={4}
                value={userData.userType}
                placeholderTextColor={bodyColor}
            />
            {errors.contact && <Text style={styles.errorText}>{errors.contact}</Text>}


            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
        </View>
    </View>


     </ImageBackground>
     </>
    );
};


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
        borderRadius :10
    },
    buttonText : {
        color : bodyColor
    },
    main : {
        position : 'absolute',
        left : 35 , 
        right : 35
    },
    textHeading : {
        fontWeight :'bold',
        color : bodyColor,
        fontSize : 28,
        width : 180,
        marginBottom : 20
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
        top : 60,
        height: 340,
        position : 'relative',
        width : '92%',
        alignSelf : 'center',
        borderRadius : 10
    }
});


const mapToStateProps = (state : ApplicationState) => {
    return {
        token : state.userReducer.token,
        user : state.userReducer.user
    }
}

export default connect(mapToStateProps)(EditProfile)