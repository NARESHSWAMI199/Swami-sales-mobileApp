import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Items from './Items'
import { Subcategory } from '../redux';
import { bodyColor } from '../utils/utils';
import { toTitleCase } from '../utils';

function SubCategirzedItems(props:any) {
    const {route, navigation} = props;
    const subcategory : Subcategory = route.params;

    useEffect(()=>{
        navigation.setOptions({
            title: toTitleCase(subcategory.subcategory),
        })
    },[])

  return (
    <View style={{backgroundColor : bodyColor}}>
        <Items {...props} size={10} showCategory={false} subcategoryId = {subcategory.id} />
    </View>
  )
}

const style = StyleSheet.create({

    titleHeadings : {
        marginHorizontal : 10,
        fontWeight : 'bold',
        fontSize : 16,
        marginVertical : 20,
        color : 'black',
    },

})

export default SubCategirzedItems