import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, StatusBar, Image } from 'react-native';
import { bodyColor, defaultAvtar, themeColor } from '../utils/utils';



const EditProfile = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        bio: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        bio: '',
    });

    const handleChange = (key:string, value:string) => {
        setUserData({ ...userData, [key]: value });
    };

    const handleSubmit = () => {
        
    };

    return (
        <ImageBackground
            source={require('../images/bg.png')}
            style={styles.image}
            resizeMode = 'cover'
        >
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <View style={styles.container}>

        <View style={styles.backSupport}>

        </View>
        <View style={{position : 'absolute', left : 40 , right : 40}}>
            <View style={styles.heading}>
                <Text style={styles.textHeading} >
                    Edit Profile
                </Text>
                <Image source={{uri : defaultAvtar}} style={styles.avatar} />
            </View>
            <Text style={styles.label}>Name:</Text>
            <TextInput
                placeholder='Name'
                style={[styles.input, errors.name ? styles.errorInput : null]}
                value={userData.name}
                onChangeText={(text) => handleChange('name', text)}
                placeholderTextColor ={bodyColor}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

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
                style={[styles.input, errors.bio ? styles.errorInput : null]}
                multiline
                numberOfLines={4}
                value={userData.bio}
                onChangeText={(text) => handleChange('bio', text)}
                placeholderTextColor={bodyColor}
            />
            {errors.bio && <Text style={styles.errorText}>{errors.bio}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
        </View>
    </View>


     </ImageBackground>
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
    heading : {

    },
    textHeading : {
        fontWeight :'bold',
        color : bodyColor,
        fontSize : 18,
        marginVertical : 20
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
        backgroundColor : bodyColor,
        opacity : 0.4,
        top : 20,
        height: 450,
        position : 'relative',
        width : '90%',
        alignSelf : 'center',
        borderRadius : 20
    }
});


export default EditProfile