import React, { useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { StyleSheet, View } from 'react-native'
import ItemCard from '../components/ItemCard'
import axios from 'axios'
import { ItemsUrl } from '../utils/utils'
import { Item } from '../redux'
import { Avatar } from 'react-native-elements';
import {Text} from 'react-native-paper';

// import ItemDetail from './ItemDetail'


const style = StyleSheet.create({
    outerView : {
        display : 'flex',
        flex : 1,
        flexDirection : 'row',
        flexWrap: 'wrap',
        width:'98%',
        justifyContent:'center',
        alignContent:'center',
        alignItems :'center',
        backgroundColor : 'white'
    },
    innerView : {
        width : '50%'
    },
    category : {
        display : 'flex',
        width : '100%',
        height : 100,
        backgroundColor : 'white'
    },
    categoryTitle : {
        fontSize : 12
    },
    categoryParent : {
        textAlign : 'center',
        width : 100,
        alignContent : 'center',
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : 'white'
    }

})

const Items = (props : any) => {

    const handleNavigation = () => {
        // Replace 'YourDestinationScreen' with the actual name of your target screen
        props.navigation.navigate('itemDetail');
      };
        const [items, setItems] = useState([])
        /** Get wholesale using user slug. */
        useEffect(() => {
            const getItems = async () => {
                await axios.post(ItemsUrl+"all",{})
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
    

  return (
    <ScrollView>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={style.category}>

            <View style={style.categoryParent} >
                <Avatar  rounded
                    size={50}
                source={{
                    uri:'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg'
                }} />
                <Text variant='titleLarge' style={style.categoryTitle}>
                    {'Grocerry'}
                </Text>
            </View>

            <View style={style.categoryParent} >
                <Avatar  rounded
                    size={50}
                source={{
                    uri:'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg'
                }} />
                <Text variant='titleLarge' style={style.categoryTitle}>
                    {'Grocerry'}
                </Text>
            </View>
 
            <View style={style.categoryParent} >
                <Avatar  rounded
                    size={50}
                source={{
                    uri:'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg'
                }} />
                <Text variant='titleLarge' style={style.categoryTitle}>
                    {'Grocerry'}
                </Text>
            </View>
 
            <View style={style.categoryParent} >
                <Avatar  rounded
                    size={50}
                source={{
                    uri:'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg'
                }} />
                <Text variant='titleLarge' style={style.categoryTitle}>
                    {'Grocerry'}
                </Text>
            </View>
 
            <View style={style.categoryParent} >
                <Avatar  rounded
                    size={50}
                source={{
                    uri:'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg'
                }} />
                <Text variant='titleLarge' style={style.categoryTitle}>
                    {'Grocerry'}
                </Text>
            </View>
 

        </ScrollView>
        <View style={style.outerView}>
        {items.map((item:Item , i) =>{
                return(<>
                <TouchableOpacity style={style.innerView} onPress={handleNavigation}> 
                    <ItemCard key={i} item={item}  url='https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg'/>
                </TouchableOpacity>
                </>)
            })}
            </View>
   </ScrollView>
  )




}

export default Items