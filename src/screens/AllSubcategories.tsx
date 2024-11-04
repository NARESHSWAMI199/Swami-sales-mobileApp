import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { itemsUrl, themeColor } from '../utils/utils';
import axios from 'axios';
import SubCategirzedItemsCard from '../components/SubcategrizedItemsCard';
import { Icon } from 'react-native-elements';
import { Subcategory } from '../redux';
import SingleSubcategoryCard from '../components/SingleSubcategoryCard';

function AllSubcategories(props:any) {

    const [subcategories,setSubcategories] = useState([]);
    const [categoryId,setCategoryId] = useState()

    useEffect(()=>{
        setCategoryId(props.categoryId)
    },[props.categoryId])

    useEffect(()=>{
        axios.post(itemsUrl +"subcategory",{pageSize : !!props.size ? props.size  : 6 ,categoryId : categoryId, orderBy : 'updatedAt'})
        .then(res=>{
            let data = res.data;
            setSubcategories(data)
        }).catch(err => {
            console.log("subcategory : " ,err)
        })
    },[categoryId])
    



    const handleNavigation = (subcategory : Subcategory) => {
        props.navigation.navigate('subCategrizedItems',subcategory);
      };


  return (
    <View style={style.container}>
        {subcategories.map((subcategory,i)=>{
            return <TouchableOpacity key={i} style={style.subcategory} onPress={() => handleNavigation(subcategory)} >
                    <SingleSubcategoryCard {...props} subcategory={subcategory} />
                </TouchableOpacity>
        })}
    </View>
  )
}

const style = StyleSheet.create({
    container : {
        display  : 'flex',
        flexDirection : 'row',
        flexWrap : 'wrap'
    },
    subcategory : {
        width : '32%',
        marginVertical : 5,
        marginHorizontal : 2
    },
    paginate : {
        display : 'flex',
        flexDirection : 'row',
        backgroundColor : 'white',
        width : '100%',
        height : 40,
        justifyContent : 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4.84,
        borderRadius : 20,
        elevation: 1,
        paddingVertical : 10,
        marginVertical : 10,
    },paginateText : {
        textAlign : 'center',
        fontWeight : '500',
        color : '#001475',
        fontSize : 16
    }
})

export default AllSubcategories