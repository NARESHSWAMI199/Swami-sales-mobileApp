import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Category } from '../redux';
import { toTitleCase } from '../utils';
import { itemsUrl } from '../utils/utils';
import ItemSubcategories from './ItemSubcategories';

function ItemCategories(props:any) {

    const [categories,setCategories] = useState([]);

    useEffect(()=>{
        axios.post(itemsUrl +"categories",{pageSize : !!props.size ? props.size  : 6})
        .then(res=>{
            let data = res.data;
            setCategories(data)
        }).catch(err => {
            console.log("ItemCategories.tsx : " ,err)
        })
    },[])
    



    const handleNavigation = (category : Category) => {
        props.navigation.navigate('categrizedItems',category);
      };


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