import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView, TouchableOpacity } from 'react-native'
import { StyleSheet, View } from 'react-native'
import ItemCard from '../components/ItemCard'
import axios from 'axios'
import { itemImageUrl, ItemsUrl } from '../utils/utils'
import { Item } from '../redux'
import { Button, Card, Text } from 'react-native-paper';
import { toTitleCase } from '../utils';

// import ItemDetail from './ItemDetail'



const style = StyleSheet.create({
    price : {
      fontSize : 12,
      fontWeight : 'bold',
      color : 'green',
    },
    cardCover : {
        width : 60,
        height: 50,
        overflow: 'hidden'
    },
    itemTitle : {
        fontSize : 12,
        fontWeight : 'bold',
    }
  
,
    recentItemsParent : {
        display : 'flex',
        flexDirection  : 'row',
        flexWrap : 'wrap',
        flex : 1
    },
    recentItems : {
        width : '22%',
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
        display : 'flex',
        alignItems : 'center',
        paddingBottom : 8,
        marginVertical : 8,
        marginHorizontal : 5
    }
  
  })


const RecentItems = (props : any) => {

    const [items, setItems] = useState([])
  
      useEffect(() => {
        const getItems = async () => {
            await axios.post(ItemsUrl+"all",{pageSize : 16})
                .then(res => {
                    let item = res.data.content;
                    setItems(item)
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
        getItems()
    }, [])


    const handleNavigation = (item : Item) => {
        // Replace 'YourDestinationScreen' with the actual name of your target screen
        props.navigation.navigate('itemDetail',item);
      };

  return (
        <View style={style.recentItemsParent}>
        {items.map((item:Item , i) =>{
                const avtar = itemImageUrl+item.slug+"/"+item.avatar
                return(<TouchableOpacity style={style.recentItems} key={i} onPress={(e) => handleNavigation(item)}> 
                    < Card.Cover 
                        style={style.cardCover}
                        resizeMode='cover' source = {{ uri: !!item.avatar ? avtar : props.url}} />
                        <Text variant="titleLarge" style={style.itemTitle} >
                            { toTitleCase(item.name.substring(0,10))}
                            </Text>
                            <Text style={style.price} > {item.price +" \u20B9"} </Text>
                </TouchableOpacity>)
            })}
            </View>
  )




}

export default RecentItems