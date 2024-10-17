import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView, TouchableOpacity } from 'react-native'
import { StyleSheet, View } from 'react-native'
import ItemCard from '../components/ItemCard'
import axios from 'axios'
import { ItemsUrl } from '../utils/utils'
import { Category, Item } from '../redux'
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

    const [search,setSearch] = useState(false)
    const [items, setItems] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategories] = useState(-1)
    const [query, setQuery] = useState("")


    const updateSearch = (search : any) => {
        setQuery(search);
    };
  
      /** Get wholesale using user slug. */
      useEffect(() => {
        const getItems = async () => {
            await axios.post(ItemsUrl+"all",{searchKey : query,category : selectedCategory})
                .then(res => {
                    let item = res.data.content;
                    setItems(item)
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
        getItems()
    }, [search,selectedCategory])


    /** Get wholesale using user slug. */
    useEffect(() => {
        const getCategories = async () => {
            await axios.get(ItemsUrl+"categories")
                .then(res => {
                    let categories = res.data;
                    setCategories(categories)
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
        getCategories()
    }, [])

    const handleNavigation = (item : Item) => {
        // Replace 'YourDestinationScreen' with the actual name of your target screen
        props.navigation.navigate('itemDetail',item);
      };


    

  return (
    <ScrollView style={{backgroundColor : 'white'}}>
        <View 
            style={{
                display : 'flex',
                flexDirection : 'row',
                marginTop : 5
            }}
        >
        <Searchbar
            placeholder="Search"
            onChangeText={updateSearch}
            value={query}
            onClearIconPress={()=>{
                setQuery("")
                setSearch(search ? false : true)
            }}
            onSubmitEditing={() => setSearch(search ? false : true)}
            style={{
                backgroundColor:'white',
                 width : '100%'}}
            />
        </View>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={style.category}>

            {categories.map((category:Category, i)=> (
                <TouchableOpacity key={i}  style={style.categoryParent} 
                onPress={(e)=> setSelectedCategories(category.id)}
                >
                    <Avatar  rounded
                        size={50}
                    source={{
                        uri:category.icon
                    }} />
                    <Text variant='titleLarge' style={style.categoryTitle}>
                        {category.category}
                    </Text>
                </TouchableOpacity>
            ))}
         

        </ScrollView>
        <View style={style.outerView}>
        {items.map((item:Item , i) =>{
                return(<TouchableOpacity key={i} style={style.innerView} onPress={(e) => handleNavigation(item)}> 
                    <ItemCard  item={item}/>
                </TouchableOpacity>)
            })}
            </View>
   </ScrollView>
  )




}

export default Items