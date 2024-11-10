import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Items from './Items'
import { Subcategory } from '../redux';
import { bodyColor } from '../utils/utils';
import { toTitleCase } from '../utils';
import Stores from './Stores';

function SubCategirzedItems(props:any) {
    const {route, navigation} = props;
    const {
        subcategory,
        id
    }= route.params

    useEffect(()=>{
        navigation.setOptions({
            title: toTitleCase(subcategory),
        })
    },[])

  return (
    <View style={style.body}>
        <Stores {...props} 
            size={10} 
            showCategory={false} 
            subcategoryId = {id}
         />
    </View>
  )
}

const style = StyleSheet.create({

    body : {
        paddingHorizontal : 10,
        backgroundColor : bodyColor,
        height : '100%'
    },
    titleHeadings : {
        marginHorizontal : 10,
        fontWeight : 'bold',
        fontSize : 16,
        marginVertical : 20,
        color : 'black',
    }

})

export default SubCategirzedItems