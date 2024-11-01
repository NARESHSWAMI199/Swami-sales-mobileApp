import React, { Component, useEffect, useState } from 'react'
import { StyleSheet,View,Button,Text,Image } from 'react-native'
import Store from './Store'
import CustomCard from '../components/StoreCard'
import { ScrollView } from 'react-native'
import { storeUrl } from '../utils/utils'
import axios from 'axios'
import StoreCategoryCard from '../components/StoreCategory'
import { SearchBar } from 'react-native-elements'
import CustomSearch from '../components/Search'
import Items from './Items'
import RecentItems from './RecentItems'

export const  HomeScreen = (props : any) => {
    const { navigation } = props;
    const hideTabBar = () => {
        navigation.setOptions({
          tabBarStyle: { display: 'none' },
        });
      };
        const showTabBar = () => {
        navigation.setOptions({
          tabBarStyle: { height : 60, display: 'flex' },
        });
      };
    

const onScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const dif = currentOffset - (props.offset || 0);  
    if (dif < 100) {
         showTabBar()
    } else {
        hideTabBar()
    }



    props.offset = currentOffset;
      
}

 return (<View style={style.container}>

    <View style={style.body}>
      
    <ScrollView
    onScroll={onScroll}
    showsHorizontalScrollIndicator={false}
        style={style.scrollView}
    >

     <CustomSearch />
     <View>
        <Text style={{
            marginHorizontal : 10,
            fontWeight : 'bold',
            fontSize : 16,
            marginVertical : 5,
            color : 'white'
        }}>
            {"Store Categories"}
        </Text>
        <View>
            <StoreCategoryCard />
        </View>
   
        </View>
 

        <View style={{
            // backgroundColor : '#720D5D',
            borderRadius : 10,
            padding : 2
        }} >
            <Text style={{
                marginHorizontal : 10,
                fontWeight : 'bold',
                fontSize : 16,
                marginVertical : 10,
                color :'white'
            }}>
                {"Popular Items"}
            </Text>
            <View>
                <RecentItems {...props}/>
            </View>
        </View>

    
    <View>
        <Text style={{
            marginHorizontal : 10,
            fontWeight : 'bold',
            fontSize : 16,
            marginVertical : 10,
            color : 'white'
        }}>
            {"Popular Stores"}
        </Text>
        <Store/>
     </View>

    </ScrollView>

</View>



</View>
 )
}


const style = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#4E003A',
        margin : 0,
        borderRadius : 10
    },
    body : {
        flex : 1,
        justifyContent:'center',
        alignItems : 'center',
        margin : 0,
        padding : 0
    },
    scrollView: {
        flexGrow: 1,
        width:'100%',
        height : '100%',
    }
   
 
})

