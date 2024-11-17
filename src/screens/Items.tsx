import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Avatar } from 'react-native-elements'
import Spinner from 'react-native-loading-spinner-overlay'
import { Searchbar, Text } from 'react-native-paper'
import ItemCard from '../components/ItemCard'
import { Category, Item } from '../redux'
import { toTitleCase } from '../utils'
import { bodyColor, itemsUrl } from '../utils/utils'

const Items = (props : any) => {

    const style = useMemo(() =>StyleSheet.create({
        body : {
            display : 'flex',
            paddingHorizontal :  props.selfPadding != undefined && !props.selfPadding ? 0 : 5,
            backgroundColor : bodyColor,
            flexDirection : 'column',
        },
        outerView : {
            display : 'flex',
            flexDirection : 'row',
            backgroundColor : bodyColor,
            flexWrap : 'wrap',
            justifyContent : 'center',
            alignItems : 'flex-start'
        },
        innerView : {
            width : '32.33%',
            paddingHorizontal : 1
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
    
    }),[])
    

    const [search,setSearch] = useState(false)
    const [items, setItems] = useState([])
    const [categories, setCategories] = useState([])
    const [query, setQuery] = useState("") 
    const [showCategory, setShowCategory] = useState(true)
    const {route, navigation} = props;
    // TODO : change false to true if you want show spinners
    const [showSpinner,setShowSpinner] = useState(true)
    const [data,setData] = useState({
        searchKey : query,
        categoryId : props.categoryId,
        subcategoryId : props.subcategoryId,
        pageSize : 51
    })
  

    useEffect(()=>{
        if(props.showCategory == true || props.showCategory == false )
        setShowCategory(props.showCategory)
    },[props.showCategory])

    useEffect(()=>{
        setData({
            ...data,
            categoryId : props.categoryId,
            pageSize : props.size,
            subcategoryId : props.subcategoryId
        })
    },[props.categoryId,props.subcategoryId,props.size])


    useEffect(()=>{
        navigation.setOptions({
            title: toTitleCase("All Items"),
        })
    },[])

    const updateSearch = (search : any) => {
        setQuery(search);
    };
  
      useEffect(() => {
        axios.post(itemsUrl+"all",{...data,searchKey : query,orderBy : 'rating'})
        .then(res => {
                let item = res.data.content;
                setItems(item)
                setShowSpinner(false)
            })
            .catch(err => {
                setShowSpinner(false)
                console.log("Items.tsx : ",err.message)
            })
    }, [search,data])


    useEffect(() => {
        const getCategories = async () => {
            await axios.post(itemsUrl+"categories",{orderBy : 'id',order : 'desc'})
                .then(res => {
                    let categories = res.data;
                    setCategories(categories)
                })
                .catch(err => {
                    console.log("Items.tsx : ",err.message)
                })
        }
        getCategories()
    }, [])

    const handleNavigation = (item : Item) => {
        props.navigation.navigate('itemDetail',item);
      };


    

  return (<ScrollView style={style.body}>
    
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
 
        <ScrollView 
            showsHorizontalScrollIndicator={false} 
            horizontal={true} 
            style={style.category}>

            {categories.map((category:Category, i)=> (
                <TouchableOpacity key={i}  style={style.categoryParent} 
                onPress={(e)=> setData({
                    ...data,
                    categoryId : category.id
                })}
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
        <View 
        style={style.outerView}
        >
        <Spinner
          visible={showSpinner}
          textContent={'Loading...'}
          textStyle={{color : 'white'}}
        />
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