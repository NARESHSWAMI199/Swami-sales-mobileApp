import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Avatar } from 'react-native-elements'
import { Searchbar, Text } from 'react-native-paper'
import { connect } from 'react-redux'
import ItemCard from '../components/ItemCard'
import { ApplicationState, Category, Item } from '../redux'
import { toTitleCase } from '../utils'
import { bodyColor, itemsUrl, themeColor } from '../utils/utils'
import { logError, logInfo } from '../utils/logger' // Import logger

const Items = (props : any) => {
    // Memoized styles
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
        },
        mainHeader : {
            height : 35,
            backgroundColor : bodyColor,
        }
    
    }),[])

    // State variables
    const [search,setSearch] = useState(false)
    const [items, setItems] = useState([])
    const [categories, setCategories] = useState([])
    const [query, setQuery] = useState("") 
    const [showCategory, setShowCategory] = useState(true)
    const {route, navigation} = props;
    const [loading, setLoading] = useState(true)
    const [data,setData] = useState({
        searchKey : query,
        categoryId : props.categoryId,
        subcategoryId : props.subcategoryId,
        pageSize : 51,
        pageNumber: 0,
        zipCode: props.location?.postalCode // Add zipCode from props
    })
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [totalElements, setTotalElements] = useState(0);

    // Effect to set showCategory based on props
    useEffect(()=>{
        if(props.showCategory == true || props.showCategory == false )
        setShowCategory(props.showCategory)
        logInfo(`ShowCategory set to ${props.showCategory}`)
    },[props.showCategory])

    // Effect to update data based on props
    useEffect(()=>{
        setData({
            ...data,
            categoryId : props.categoryId,
            pageSize : props.size,
            subcategoryId : props.subcategoryId,
            zipCode: props.location?.postalCode // Update zipCode from props
        })
        logInfo(`Data updated: ${JSON.stringify(data)}`)
    },[props.categoryId,props.subcategoryId,props.size, props.location?.postalCode])

    // Effect to set navigation options
    useEffect(()=>{
        navigation.setOptions({
            title: toTitleCase("All Items"),
        })
        logInfo(`Navigation options set`)
    },[])

    // Function to update search query
    const updateSearch = (search : any) => {
        setQuery(search);
        logInfo(`Search query updated: ${search}`)
    };

    // Effect to fetch items based on data and search query
    useEffect(() => {
        logInfo(`Fetching items with data: ${JSON.stringify(data)} and query: ${query}`)
        axios.post(itemsUrl+"all",{...data,pageNumber : 0,searchKey : query,orderBy : 'rating'})
        .then(res => {
                let item = res.data.content;
                setItems(item)
                setTotalElements(res.data.totalElements);
                setLoading(false)
                logInfo(`Items fetched successfully`)
            })
            .catch(err => {
                setLoading(false)
                logError(`Error fetching items: ${!!err.response?.data.message ? err.response.data.message : err.message}`)
            })
    }, [search])

    // Effect to fetch categories
    useEffect(() => {
        const getCategories = async () => {
            logInfo(`Fetching categories`)
            await axios.post(itemsUrl+"categories",{orderBy : 'id',order : 'desc'})
                .then(res => {
                    let categories = res.data;
                    setCategories(categories)
                    logInfo(`Categories fetched successfully`)
                })
                .catch(err => {
                    logError(`Error fetching categories: ${!!err.response?.data.message ? err.response.data.message : err.message}`)
                })
        }
        getCategories()
    }, [])

    // Function to handle navigation to item detail
    const handleNavigation = (item : Item) => {
        logInfo(`Navigating to item detail: ${item.id}`)
        props.navigation.navigate('itemDetail',item);
    };

    // Function to fetch more items on scroll end
    const fetchMoreItems = () => {
        if (items.length >= totalElements) return;
        setIsFetchingMore(true);
        axios.post(itemsUrl + "all", { ...data, searchKey: query, orderBy: 'rating', pageNumber: data.pageNumber + 1 })
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

    // Render component
    return (<>  
    <ScrollView 
        style={style.body}
        onScroll={({ nativeEvent }) => {
            if (nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height - 20) {
                fetchMoreItems();
            }
        }}
        scrollEventThrottle={400}
    >
        {!!showCategory && 
        <>
            <View  style={style.mainHeader}></View>
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
                        logInfo(`Search query cleared`)
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
                    onPress={(e)=> {
                        setData({
                            ...data,
                            categoryId : category.id
                        })
                        logInfo(`Category selected: ${category.id}`)
                    }}
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
            {loading ? (
                <ActivityIndicator size="large" color={themeColor} />
            ) : (
                items.map((item:Item , i) =>{
                    return(<TouchableOpacity key={i} style={style.innerView} onPress={(e) => handleNavigation(item)}> 
                        <ItemCard  item={item}/>
                    </TouchableOpacity>)
                })
            )}
            {isFetchingMore && <ActivityIndicator size="large" color={themeColor} />}
        </View>
    </ScrollView>
    </>)
}

const mapStateToProps = (state: ApplicationState) => ({
    location: state.userReducer.location
})

export default connect(mapStateToProps)(Items)