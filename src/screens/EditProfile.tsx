import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { ApplicationState, UserModel } from '../redux';
import { authUrl, bodyColor, defaultAvtar, themeColor } from '../utils/utils';
import { toTitleCase } from '../utils';
import { Icon } from 'react-native-elements'
import { logError, logInfo } from '../utils/logger' // Import logger

const EditProfile = (props:any) => {
    // State variables
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
        userType : '',
        other : ''
    });

    const [user,setUser] = useState<UserModel>()
    const [token,setToken] = useState()
    const [message,setMessage] = useState()

    // Function to handle input change
    const handleChange = (key:string, value:string) => {
        setUserData({ ...userData, [key]: value });
    };

    // Function to handle go back action
    const handleGoBack = () => {
        props.navigation.goBack();
    };

    // Effect to get user and token from props
    useEffect(()=>{
        const getData = async () =>{
            let user = await props.user
            let token = await props.token
            setUser(JSON.parse(user))
            setToken(token)
            logInfo(`User and token set`)
        }
        getData()
    },[props.user,props.token])

    // Effect to fetch user data
    useEffect(()=>{
        if(!!user && !!token) {
            axios.defaults.headers['Authorization'] = token
            axios.get(authUrl+user?.slug)
            .then(res=>{
                setUserData({...res.data,userType : 'Retailer'})
                logInfo(`User data fetched successfully`)
            }).catch(err=>{
                logError(`Error fetching user data: ${err.message}`)
            })
        }
    },[user,token])

    // Function to handle form submission
    const handleSubmit = () => {
        axios.defaults.headers['Authorization'] = token
        axios.post(authUrl + "update",userData)
        .then(res=>{
            alert(toTitleCase(res.data.message))
            logInfo(`Profile updated successfully`)
        }).
        catch(err=>{
            let error = !!err.response ? err.response.data.message : err.message
            setErrors({...errors, other : error})
            logError(`Error updating profile: ${err.message}`)
        })
    };

    // Render component
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
            <TouchableOpacity style={styles.goBack} onPress={handleGoBack}>
                <Icon name="arrow-back" type="material" size={24} color="white" />
                <Text style={styles.goBackText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.textHeading} >
                Want to update your profile?
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
        <View style={styles.errorBlock}>
            {errors.other && <Text style={styles.errorText}>{errors.other}</Text>}
        </View>
        </View>
  
    </View>
     </ImageBackground>
     </>
    );
};

// Styles
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
        top : 65,
        height: 340,
        position : 'relative',
        width : '92%',
        alignSelf : 'center',
        borderRadius : 10
    },
    errorBlock : {
        marginVertical : 10,
        height : 40
    },
    goBack: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
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

export default connect(mapToStateProps)(EditProfile)