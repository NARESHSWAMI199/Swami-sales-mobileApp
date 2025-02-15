import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Category } from '../redux';
import { toTitleCase } from '../utils';
import { itemsUrl } from '../utils/utils';
import ItemSubcategories from './ItemSubcategories';
import { logError, logInfo } from '../utils/logger'; // Import logger

function ItemCategories(props:any) {

    // State variables
    const [categories,setCategories] = useState([]);

    // Effect to fetch categories
    useEffect(()=>{
        logInfo(`Fetching categories`);
        axios.post(itemsUrl +"categories",{pageSize : !!props.size ? props.size  : 6})
        .then(res=>{
            let data = res.data;
            setCategories(data);
            logInfo(`Categories fetched successfully`);
        }).catch(err => {
            logError(`Error fetching categories: ${!!err.response?.data.message ? err.response.data.message : err.message}`);
        })
    },[])
    
    // Function to handle navigation to categorized items
    const handleNavigation = (category : Category) => {
        logInfo(`Navigating to categorized items: ${category.id}`);
        props.navigation.navigate('categrizedItems',category);
      };

    // Render component
  return (
    <View>
        {categories.map((category:Category,i)=>{
            return <View key={i}>
                    <View>
                        <Text style={style.titleHeadings}>
                            {toTitleCase(category.category)}
                        </Text>
                        <ItemSubcategories 
                        {...props} 
                        categoryId = {category.id}
                        />
                    </View>
                    <TouchableOpacity style={style.paginate} onPress={()=>handleNavigation(category)} > 
                        <Text style={style.paginateText}>See all products</Text>
                        <Icon name='chevron-small-right' color={'#001475'}  type="entypo" />
                    </TouchableOpacity>
                </View>
        })}
    </View>
  )
}

// Styles
const style = StyleSheet.create({
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
    },    titleHeadings : {
        marginHorizontal : 10,
        fontWeight : 'bold',
        fontSize : 16,
        marginVertical : 20,
    },

})

export default ItemCategories