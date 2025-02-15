import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Card, Text } from 'react-native-paper'
import { Item } from '../redux'
import { toTitleCase } from '../utils'
import { itemImageUrl, itemsUrl } from '../utils/utils'
import { logError, logInfo } from '../utils/logger' // Import logger

const RecentItems = (props : any) => {

    // Styles
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
            width : '80%',
            height: 60,
            overflow: 'visible',
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

    // State variables
    const [items, setItems] = useState([])
  
    // Effect to fetch recent items
    useEffect(() => {
        logInfo(`Fetching recent items`)
        axios.post(itemsUrl+"all",{pageSize : !!props.size ? props.size : 8,orderBy : 'createdAt'})
        .then(res => {
            let item = res.data.content;
            setItems(item)
            logInfo(`Recent items fetched successfully`)
        }).catch(err => {
            logError(`Error fetching recent items: ${!!err.response?.data.message ? err.response.data.message : err.message}`)
        })
    }, [])

    // Function to handle navigation to item detail
    const handleNavigation = (item : Item) => {
        logInfo(`Navigating to item detail: ${item.id}`)
        props.navigation.navigate('itemDetail',item);
    };

    // Render component
    return (
        <View style={style.container}>
        {items.map((item:Item , i) =>{
                const avtar = itemImageUrl+item.slug+"/"+item.avatars?.split(',')[0]
                return(
                <TouchableOpacity style={style.recentItems} key={i} onPress={(e) => handleNavigation(item)}> 
                    < Card.Cover 
                        style={style.cardCover}
                        resizeMode='contain'
                        source = {{ uri: !!item.avatars ? avtar : props.url}} 
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