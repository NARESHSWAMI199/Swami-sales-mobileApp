import React, { useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import { StyleSheet, View } from 'react-native'
import ItemCard from '../components/ItemCard'
import axios from 'axios'
import { ItemsUrl } from '../utils/utils'
import { Item, onUpdateLocation } from '../redux'
import { Avatar, SearchBar } from 'react-native-elements';
import {Searchbar, Text} from 'react-native-paper';

// import ItemDetail from './ItemDetail'


const style = StyleSheet.create({
    outerView : {
        display : 'flex',
        flex : 1,
        flexDirection : 'row',
        flexWrap: 'wrap',
        width:'98%',
        // justifyContent:'center',
        // alignContent:'center',
        // alignItems :'center',
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
    const [category ,setCategory] = useState([1,2,3,4])

    const [search,setSearch] = useState("")

          
    const [items, setItems] = useState([])

    const updateSearch = (search : any) => {
        setSearch(search);
    };
  
      /** Get wholesale using user slug. */
      useEffect(() => {
        const getItems = async () => {
            await axios.post(ItemsUrl+"all",{searchKey : search})
                .then(res => {
                    let item = res.data.content;
                    setItems(item)
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
        getItems()
    }, [search])


    const handleNavigation = (item : Item) => {
        // Replace 'YourDestinationScreen' with the actual name of your target screen
        props.navigation.navigate('itemDetail',item);
      };


    

  return (
    <ScrollView style={{backgroundColor : 'white'}}>
   <Searchbar
      placeholder="Search"
      onChangeText={updateSearch}
      value={search}
      style={{backgroundColor:'white'}}
    />
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={style.category}>

            {category.map((item , i)=> (
                <View key={i} style={style.categoryParent} >
                <Avatar  rounded
                    size={50}
                source={{
                    uri:'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg'
                }} />
                <Text variant='titleLarge' style={style.categoryTitle}>
                    {'Grocerry'}
                </Text>
                </View>

            ))}
         

        </ScrollView>
        <View style={style.outerView}>
        {items.map((item:Item , i) =>{
                return(<TouchableOpacity key={i} style={style.innerView} onPress={(e) => handleNavigation(item)}> 
                    <ItemCard  item={item}  url='https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg'/>
                </TouchableOpacity>)
            })}
            </View>
   </ScrollView>
  )




}

export default Items