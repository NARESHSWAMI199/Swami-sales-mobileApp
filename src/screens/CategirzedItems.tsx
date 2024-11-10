import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Items from './Items'
import { Category, Subcategory } from '../redux';
import { bodyColor } from '../utils/utils';
import { toTitleCase } from '../utils';

function CategirzedItems(props:any) {
    const {route, navigation} = props;
    const category : Category = route.params;

    useEffect(()=>{
        navigation.setOptions({
            title: toTitleCase(category.category),
        })
    },[])

  return (
    <View style={style.body}>
        <Items {...props} size={10} showCategory={false} categoryId = {category.id} />
    </View>
  )
}

const style = StyleSheet.create({
    body : {
        paddingHorizontal : 5,
        backgroundColor : bodyColor,
        height : '100%'
    },
    titleHeadings : {
        marginHorizontal : 10,
        fontWeight : 'bold',
        fontSize : 16,
        marginVertical : 20,
        color : 'black',
    },

})

export default CategirzedItems