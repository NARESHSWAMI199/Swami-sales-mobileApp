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

const [categories, setCategories] = useState([])


/** Get wholesale using user slug. */
useEffect(() => {
    const getCategories = async () => {
        await axios.get(storeUrl+"categories")
            .then(res => {
                let categories = res.data;
                setCategories(categories)
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    getCategories()
}, [])
 return (<View style={style.container}>

    <View style={style.body}>
      
    <ScrollView
    showsHorizontalScrollIndicator={false}
        style={style.scrollView}
    >

     <CustomSearch />
     <View style={{
        // shadowColor: "#fff",
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // backgroundColor : '#4E003A',
        // shadowOpacity: 0.25,
        // shadowRadius: 4.84,
        // borderRadius : 10,
        // elevation: 5,
        // marginVertical : 1
     }}>


        <Text style={{
            marginHorizontal : 10,
            fontWeight : 'bold',
            fontSize : 16,
            marginVertical : 5,
            color : 'white'
        }}>
            {"Store Categories"}
        </Text>
        <View style={style.storeCategoryParent}>
            {categories.map((category,i)=>{
                return <View style={style.storeCategory}>
                        <StoreCategoryCard key={i} category = {category} />
                    </View>
            })}
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
        // marginHorizontal: 20,
        flexGrow: 1,
        width:'100%',
        height : '100%',
    },
    storeCategoryParent : {
        display : 'flex',
        flexDirection : 'row',
        flexWrap : 'wrap',
        flex : 1,
        marginBottom : 10
    }, 
    storeCategory : {
        width : '30%',
        padding : 5
    },
   
 
})

