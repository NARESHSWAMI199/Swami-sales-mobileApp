import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Searchbar } from 'react-native-paper'
import ItemCard from '../components/ItemCard'
import { Item } from '../redux'
import { bodyColor, itemsUrl, themeColor } from '../utils/utils'
import RecentItems from './RecentItems'
import { logError, logInfo } from '../utils/logger' // Import logger

const ItemFilters = (props : any) => {
    // State variables
    const [search,setSearch] = useState(false)
    const [items, setItems] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(-1)
    const [query, setQuery] = useState("") 
    const [showPopular, setShowPuplar] = useState(true) 
    const [searchResult , setSearchResult] = useState("New Products")
    const [loading, setLoading] = useState(true)
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [totalElements, setTotalElements] = useState(0);
    const [data, setData] = useState({
        searchKey: query,
        categoryId: props.categoryId,
        subcategoryId: props.subcategoryId,
        pageSize: 51,
        pageNumber: 0
    });

    // Effect to set selected category based on props
    useEffect(()=>{
        setSelectedCategory(props.categoryId)
        logInfo(`Selected category set to ${props.categoryId}`)
    },[props.categoryId])

    // Function to update search query
    const updateSearch = (search : any) => {
        setQuery(search);
        logInfo(`Search query updated: ${search}`)
    };

    // Effect to fetch items based on data and search query
    useEffect(() => {
        logInfo(`Fetching items with query: ${query} and category: ${selectedCategory}`)
        axios.post(itemsUrl+"all",{...data, searchKey: query, categoryId: selectedCategory})
        .then(res => {
            let item = res.data.content;
            if(query != ""){
                if(item.length < 1) {
                    setSearchResult("Currently not available this kind of products.")
                }else{
                    setSearchResult("Search Results.")
                }
                setShowPuplar(false)
                setLoading(false)
            }else{
                setShowPuplar(true)
                setSearchResult("New Products")
                setLoading(false)
            }
            setItems(item)
            setTotalElements(res.data.totalElements);
            logInfo(`Items fetched successfully`)
        })
        .catch(err => {
            setLoading(false)
            logError(`Error fetching items: ${!!err.response?.data.message ? err.response.data.message : err.message}`)
        })
    }, [search,selectedCategory])

    // Function to fetch more items on scroll end
    const fetchMoreItems = () => {
        if (items.length >= totalElements) return;
        setIsFetchingMore(true);
        axios.post(itemsUrl + "all", { ...data, searchKey: query, categoryId: selectedCategory, pageNumber: data.pageNumber + 1 })
            .then(res => {
                let newItems = res.data.content;
                setItems([...items, ...newItems]);
                setData({ ...data, pageNumber: data.pageNumber + 1 });
                setIsFetchingMore(false);
                logInfo(`More items fetched successfully`)
            })
            .catch(err => {
                setIsFetchingMore(false);
                logError(`Error fetching more items: ${!!err.response?.data.message ? err.response.data.message : err.message}`)
            })
    };

    // Function to handle navigation to item detail
    const handleNavigation = (item : Item) => {
        logInfo(`Navigating to item detail: ${item.id}`)
        props.navigation.navigate('itemDetail',item);
    };

    // Render component
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
                    logInfo(`Search query cleared`)
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
        <ScrollView 
            style={style.main}
            onScroll={({ nativeEvent }) => {
                if (nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height - 20) {
                    fetchMoreItems();
                }
            }}
            scrollEventThrottle={400}
        >
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
                        <RecentItems {...props} size={10}/>
                    </ScrollView>
                </View>
            }
            <View>
                {loading ? (
                    <ActivityIndicator size="large" color={themeColor} />
                ) : (
                    <>
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
                    </>
                )}
                {isFetchingMore && <ActivityIndicator size="large" color={themeColor} />}
            </View>
        </ScrollView>
    </View>)
}

// Styles
const style = StyleSheet.create({
    body : {
        display : 'flex',
        flex : 1,
        backgroundColor : '#d4defc',
    },
    main : {
        backgroundColor : bodyColor,
        paddingHorizontal : 10
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