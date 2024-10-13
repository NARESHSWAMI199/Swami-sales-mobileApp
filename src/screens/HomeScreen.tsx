import React, { Component } from 'react'
import { StyleSheet,View,Button,Text,Image } from 'react-native'
import Store from './Store'
import CustomCard from '../components/StoreCard'
import { ScrollView } from 'react-native'

export const  HomeScreen = () => {
 return (
    <>
<View style={style.container}>

    <View style={style.body}>
      
    <ScrollView
    showsHorizontalScrollIndicator={false}
        style={style.scrollView}
    >
       <Store/>
        </ScrollView>

    </View>



    {/* <View style={style.footer}>
        <Text> footer </Text>
    </View> */}




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
        flex : 1,
        justifyContent:'center',
        alignItems : 'center',
        backgroundColor :'white'
    },
    footer : {
        flex : 1,
        backgroundColor : 'cyan'
    },
    scrollView: {
        // marginHorizontal: 20,
        flexGrow: 1,
        width:'100%',
        height : '100%'

      },
})

