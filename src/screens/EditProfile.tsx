import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, StatusBar } from 'react-native';
import { bodyColor, themeColor } from '../utils/utils';
import { Container } from 'react-bootstrap';

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
            source={{ uri: 'https://images.pexels.com/photos/158658/bokeh-blur-blue-white-158658.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' }}
            style={styles.image}
        >
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

        <View style={styles.container}>
            <View style={styles.heading}>
                <Text style={styles.textHeading} >
                    Edit Profile
                </Text>
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

            <Text style={styles.label}>Bio:</Text>
            <TextInput
                placeholder='Bio'
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
     </ImageBackground>
    );
};


const styles = StyleSheet.create({
    container : {
        paddingHorizontal : 15,
        height : '100%',
        justifyContent : 'center',
        // background: "url('https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Ffreebackground%2Fblurred-background---store-of-shopping-mall-blur-background-with-bokeh-vintage-filtered-image-photo_3420631.html&psig=AOvVaw0laCBwtO2slVzrXNSz3Bne&ust=1733336093429000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJC_taOajIoDFQAAAAAdAAAAABAE')"
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
        fontSize : 22,
        marginVertical : 20
    },
    image : {

    }
});


export default EditProfile