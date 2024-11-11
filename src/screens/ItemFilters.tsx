import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Searchbar } from 'react-native-paper'
import ItemCard from '../components/ItemCard'
import { Item } from '../redux'
import { itemsUrl, themeColor } from '../utils/utils'
import RecentItems from './RecentItems'

const ItemFilters = (props : any) => {

    const [search,setSearch] = useState(false)
    const [items, setItems] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(-1)
    const [query, setQuery] = useState("") 
    const [showPopular, setShowPuplar] = useState(true) 
    const [searchResult , setSearchResult] = useState("New Products")


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
                    if(query != ""){
                        if(item.length < 1) {
                            setSearchResult("Currently not aviable this kind of products.")
                        }else{
                            setSearchResult("Search Results.")
                        }
                        setShowPuplar(false)
                    }else{
                        setShowPuplar(true)
                        setSearchResult("New Products")
                    }
                    setItems(item)
              
                   
                })
                .catch(err => {
                    console.log(err.message)
                })
    }, [search,selectedCategory])

    const handleNavigation = (item : Item) => {
        props.navigation.navigate('itemDetail',item);
    };

  return (<View style={style.body}>
    <StatusBar backgroundColor={themeColor}  barStyle="dark-content" />
   
            <View 
                style={{
                    display : 'flex',
                    flexDirection : 'row',
                    paddingTop : 30,
                    paddingBottom : 15,
                    marginTop : 20,
                    paddingHorizontal : 10,
                    backgroundColor : themeColor
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
                autoFocus = {true}
                onSubmitEditing={() => setSearch(search ? false : true)}
                style={{
                    backgroundColor:'white',
                    width : '100%',
                    textAlign : 'center',
                }}
                />
            </View>
        

            <ScrollView style={{backgroundColor : 'white'}}>
            {showPopular &&
                <View>
                    <Text style={style.titleHeadings}>
                        Popular Items
                </Text>

                    <ScrollView 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false}
                        style={{ flexGrow : 1,height : 130}}
                    >
                        <RecentItems size={10}/>
                    </ScrollView>
                </View>
            }

            <View>
                <Text style={style.titleHeadings}>
                    {searchResult}
                </Text>
                <View style={style.outerView}>
                {items.map((item:Item , i) =>{
                        return(<TouchableOpacity key={i} style={style.innerView} onPress={(e) => handleNavigation(item)}> 
                            <ItemCard  item={item}/>
                        </TouchableOpacity>)
                    })}
                </View>
            </View>
    </ScrollView>
   </View>
  )
}


const style = StyleSheet.create({
    body : {
        display : 'flex',
        flex : 1,
        paddingHorizontal :10,
        backgroundColor : '#d4defc',
    },
    outerView : {
        display : 'flex',
        flex : 1,
        flexDirection : 'row',
        flexWrap: 'wrap',
        width:'100%',
        backgroundColor : 'white'
    },
    innerView : {
        width : '32%',
        margin : 2,
    },
    titleHeadings : {
        fontWeight : 'bold',
        fontSize : 16,
        marginVertical : 15,
    },

})

export default ItemFilters