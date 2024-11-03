import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { itemsUrl, themeColor } from '../utils/utils';
import axios from 'axios';
import SubCategirzedItemsCard from '../components/SubcategrizedItemsCard';
import { Icon } from 'react-native-elements';
import { Subcategory } from '../redux';

function AllSubcategories(props:any) {

    const [subcategories,setSubcategories] = useState([]);

    useEffect(()=>{
        axios.post(itemsUrl +"subcategory",{pageSize : !!props.size ? props.size  : 6 ,categoryId : props.categoryId})
        .then(res=>{
            let data = res.data;
            setSubcategories(data)
        }).catch(err => {
            console.log("subcategory : " ,err)
        })
    },[])
    



    const handleNavigation = (subcategory : Subcategory) => {
        props.navigation.navigate('subCategrizedItems',subcategory);
      };


  return (
    <View>
        {subcategories.map((subcategory,i)=>{
            return <View key={i}>
                    <SubCategirzedItemsCard {...props} subcategory={subcategory} />
                    <TouchableOpacity style={style.paginate} onPress={()=>handleNavigation(subcategory)} > 
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
    }
})

export default AllSubcategories