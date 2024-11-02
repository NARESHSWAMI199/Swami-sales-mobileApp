import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Card, Text } from 'react-native-paper'
import { Item } from '../redux'
import { toTitleCase } from '../utils'
import { itemImageUrl, itemsUrl } from '../utils/utils'



const RecentItems = (props : any) => {



    const style = StyleSheet.create({
        price : {
        fontSize : 12,
        fontWeight : 'bold',
        color : 'black',
        },
        discount : {
            fontSize : 12,
            fontWeight : 'bold',
            color : 'green'
        },
        cardCover : {
            width : '70%',
            height: 50,
            overflow: 'hidden'
        },
        itemTitle : {
            fontSize : 12,
            fontWeight : 'bold',
        },
        container : {
            display : 'flex',
            flexDirection : 'row',
            flexWrap : 'wrap',
            alignSelf :'center',
            flex : 1,
        },
        recentItems : {
            width :  !!props.width ? props.width : 100,
            shadowColor: "#000",
            shadowOffset: {
                width: 1,
                height: 2,
            },
            backgroundColor : 'white',
            shadowOpacity: 0.25,
            shadowRadius: 4.84,
            borderRadius : 20,
            elevation: 1,
            alignItems : 'center',
            paddingBottom : 8,
            marginHorizontal : !!props.marginHorizontal ? props.marginHorizontal : 2,
            marginTop : 8
        }
    
    })


    const [items, setItems] = useState([])
  
      useEffect(() => {
        axios.post(itemsUrl+"all",{pageSize : !!props.size ? props.size : 8,orderBy : 'rating'})
        .then(res => {
            let item = res.data.content;
            setItems(item)
        }).catch(err => {
            console.log(err.message)
        })
    }, [])


    const handleNavigation = (item : Item) => {
        props.navigation.navigate('itemDetail',item);
      };

  return (
        <View style={style.container}>
        {items.map((item:Item , i) =>{
                const avtar = itemImageUrl+item.slug+"/"+item.avatar
                return(
                <TouchableOpacity style={style.recentItems} key={i} onPress={(e) => handleNavigation(item)}> 
                    < Card.Cover 
                        style={style.cardCover}
                        resizeMode='cover'
                        source = {{ uri: !!item.avatar ? avtar : props.url}} 
                    />
                    <Text variant="titleLarge" style={style.itemTitle} >
                        { toTitleCase(item.name.substring(0,10))}
                    </Text>
                    <Text style={style.discount} >{Math.floor((item.discount/item.price)*100) +"% OFF"} </Text>
                    <Text style={style.price} >{"\u20B9 " +item.price} </Text>
                </TouchableOpacity>
                )
            })}
            </View>
  )
}






export default RecentItems