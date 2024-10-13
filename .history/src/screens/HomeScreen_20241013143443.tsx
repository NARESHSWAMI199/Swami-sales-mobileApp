import React, { Component } from 'react'
import { StyleSheet,View,Button,Text,Image } from 'react-native'
import CustomCard from '../components/CustomCard'

export const  HomeScreen = () => {
 return (
    <>
<View style={style.container}>

    <View style={style.container}>
        <Text> Header </Text>
    </View>


    <View style={style.body}>
        <CustomCard/>
        {/* <Text> body </Text> */}
    </View>



    <View style={style.footer}>
        <Text> footer </Text>
    </View>




</View>

    </>
 )
}


const style = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : 'yellow'
    },
    navigation : {
        flex : 2,
        backgroundColor : 'red'
    },
    body : {
        flex : 9,
        justifyContent:'center',
        alignItems : 'center',
        backgroundColor :'yellow'
    },
    footer : {
        flex : 1,
        backgroundColor : 'cyan'
    }
})

