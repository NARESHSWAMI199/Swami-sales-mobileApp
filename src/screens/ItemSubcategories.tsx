import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import SingleSubcategoryCard from '../components/SingleSubcategoryCard';
import { Subcategory } from '../redux';
import { itemsUrl } from '../utils/utils';
import { logError, logInfo } from '../utils/logger'; // Import logger

function ItemSubcategories(props:any) {

    const {
        categoryId
    } = props

    // State variables
    const [subcategories,setSubcategories] = useState([]);
  
    // Effect to fetch subcategories based on categoryId
    useEffect(()=>{
        logInfo(`Fetching subcategories for categoryId: ${categoryId}`)
        axios.post(itemsUrl +"subcategory",{
            pageSize : 6 ,
            categoryId : categoryId, 
            orderBy : 'updatedAt'
        })
        .then(res=>{
            let data = res.data;
            setSubcategories(data)
            logInfo(`Subcategories fetched successfully`)
        }).catch(err => {
            logError(`Error fetching subcategories: ${!!err.response?.data.message ? err.response.data.message : err.message}`)
        })
    },[categoryId])
    
    // Function to handle navigation to subcategorized items
    const handleNavigation = (subcategory : Subcategory) => {
        logInfo(`Navigating to subcategorized items: ${subcategory.id}`)
        props.navigation.navigate('subCategrizedItems',subcategory);
      };

    // Render component
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

// Styles
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

export default ItemSubcategories