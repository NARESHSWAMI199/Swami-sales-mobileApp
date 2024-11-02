import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Avatar } from 'react-native-elements'
import { Searchbar, Text } from 'react-native-paper'
import ItemCard from '../components/ItemCard'
import { Category, Item } from '../redux'
import { itemsUrl } from '../utils/utils'

const Items = (props : any) => {

    const [search,setSearch] = useState(false)
    const [items, setItems] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(-1)
    const [query, setQuery] = useState("") 
    const [showCategory, setShowCategory] = useState(true)

    useEffect(()=>{
        if(props.showCategory == true || props.showCategory == false )
        setShowCategory(props.showCategory)
    },[props.showCategory])

    useEffect(()=>{
        setSelectedCategory(props.categoryId)
    },[props.categoryId])

    const updateSearch = (search : any) => {
        setQuery(search);
    };
  
      useEffect(() => {
            axios.post(itemsUrl+"all",{
                searchKey : query,
                categoryId : selectedCategory,
                subcategoryId : !!props.subcategory ? props.subcategory : null,
                pageSize : 50 
            })
            .then(res => {
                    let item = res.data.content;
                    setItems(item)
                })
                .catch(err => {
                    console.log(err.message)
                })
    }, [search,selectedCategory])


    useEffect(() => {
        const getCategories = async () => {
            await axios.post(itemsUrl+"categories",{orderBy : 'id',order : 'desc'})
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
        props.navigation.navigate('itemDetail',item);
      };


    

  return (
    <ScrollView style={{backgroundColor : 'white'}}>
    {!!showCategory && 
    <>
        <View 
            style={{
                display : 'flex',
                flexDirection : 'row',
                marginTop : 5
            }}
        >
            
        <Searchbar
            autoFocus={true}
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
                onPress={(e)=> setSelectedCategory(category.id)}
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
        </>
        }
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
        width : '32%',
        margin : 2
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

export default Items