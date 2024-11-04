import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Subcategory } from '../redux';
import Items from '../screens/Items';
import { toTitleCase } from '../utils';
import AllSubcategories from '../screens/AllSubcategories';

function CategirzedCard(props:any) {

    const [category,setCategory] = useState({
        id : 0,
        category : ''
    });

    useEffect(()=>{
        setCategory(props.category)
    },[props.category])

  return (
    <View>
        <Text style={style.titleHeadings}>
            {toTitleCase(category.category)}
        </Text>
        <AllSubcategories {...props} size={6} showCategory={false} categoryId = {category.id} />
    </View>
  )
}

const style = StyleSheet.create({

    titleHeadings : {
        marginHorizontal : 10,
        fontWeight : 'bold',
        fontSize : 16,
        marginVertical : 20,
    },

})

export default CategirzedCard