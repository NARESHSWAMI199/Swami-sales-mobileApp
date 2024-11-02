import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { Item } from '../redux';
import { itemImageUrl,itemsUrl, storeImageUrl, storeUrl } from '../utils/utils';
import { toTitleCase } from '../utils';

const ItemSubCategoryCard = (props : any) =>  {


    const [subcategory,setSubcategory] = useState({
        id : 0,
        subcategory : ''
    });
    const [items, setItems] = useState([]);

    useEffect(()=>{
        if(subcategory != undefined){
            setSubcategory(props.subcategory)
        }
    },[props.subcategory])


    useEffect(()=>{
        axios.post(itemsUrl +"all",{pageSize : 4,subcategoryId : subcategory.id})
        .then(res=>{
            let data = res.data.content;
            setItems(data)
        }).catch(err => {
            console.log(err)
        })
    },[subcategory])

  return (
    <View style={style.main}>
        <View style={style.container}>
            {items.map((item : Item, index)=> {
            const avtar = itemImageUrl+item.slug+"/"+item.avatar
            return  <View key={index} style={style.subcategory}>
                        <Avatar key={index} avatarStyle={{borderRadius : 5}} size={40}
                            source={{uri : avtar}}
                        />
                    </View>
            })}        
        </View>
            <Text style={{
                fontWeight : 'bold',
                fontSize : 12
            }}>
                {!!subcategory ? toTitleCase(subcategory.subcategory).split(' ')[0] : ""+subcategory} 
            </Text>
    </View>
  )

}





const StoreSubCategoryCard = (props : any) =>  {


    const [subcategory,setSubcategory] = useState({
        id : 0,
        subcategory : ''
    });
    const [items, setItems] = useState([]);

    useEffect(()=>{
        if(subcategory != undefined){
            setSubcategory(props.subcategory)
        }
    },[props.subcategory])


    useEffect(()=>{
        axios.post(storeUrl +"all",{pageSize : 4,subcategoryId : subcategory.id})
        .then(res=>{
            let data = res.data.content;
            setItems(data)
        }).catch(err => {
            console.log(err)
        })
    },[subcategory])

  return (<View style={style.main}>
        <View style={style.container}>
            {items.map((item : Item, index)=> {
            const avtar = storeImageUrl+item.slug+"/"+item.avatar
            return  <View key={index} style={style.subcategory}>
                        <Avatar key={index} avatarStyle={{borderRadius : 5}} size={40}
                            source={{uri : avtar}}
                        />
                    </View>
            })}        
        </View>
            <Text style={{
                fontWeight : 'bold',
                fontSize : 12
            }}>
                {!!subcategory ? toTitleCase(subcategory.subcategory).split(' ')[0] : ""+subcategory} 
            </Text>
    </View>
  )

}


const style = StyleSheet.create({
    container : {
        display : 'flex',
        flexWrap : 'wrap',
        height : 100,
        width  : 100,
        alignContent : 'center',
        backgroundColor : '#fff',
        justifyContent : 'center',
        borderRadius : 5,
        borderBottomColor : '#000',
    },
    subcategory : {
        padding : 2,
    },
    main : {
        alignItems :'center',
        width  : '100%',
        padding : 5,
        marginTop : 10,
        alignContent : 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        backgroundColor : 'white',
        shadowOpacity: 0.25,
        shadowRadius: 4.84,
        elevation: 1,
        borderRadius : 5
    }
  })

export { ItemSubCategoryCard, StoreSubCategoryCard};
