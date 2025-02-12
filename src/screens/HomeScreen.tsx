import { Tab, TabView } from '@rneui/themed'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BackHandler, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Avatar, Icon } from 'react-native-elements'
import { Searchbar } from 'react-native-paper'
import { connect } from 'react-redux'
import { ItemSubCategories, StoreSubCategories } from '../components/Subcategories'
import { authCheckState, Category } from '../redux'
import { bodyColor, itemsUrl, themeColor } from '../utils/utils'
import ItemCategories from './ItemCategories'
import PopularStores from './PopularStores'
import RecentItems from './RecentItems'
import TabItems from './TabItems'

const  HomeScreen = (props : any) => {
    const { navigation } = props;

    const hideTabBar = () => {
        navigation.setOptions({
          tabBarStyle: { display: 'none' },
        });
      };
        const showTabBar = () => {
        navigation.setOptions({
          tabBarStyle: { height : 60, display: 'flex' },
        });
      };
    

const onScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const dif = currentOffset - (props.offset || 0);  
    if (dif < 100) {
         showTabBar()
    } else {
        hideTabBar()
    }
    props.offset = currentOffset;   
}

useEffect(() => {
    navigation.addListener("beforeRemove", (e:any) => {
        e.preventDefault();
        BackHandler.exitApp();
    })
}, []);

const [index, setIndex] = useState(0);
const [categories, setCategories] = useState([])

useEffect(() => {
      axios.post(itemsUrl+"categories", {orderBy : 'id'})
            .then(res => {
                let categories = res.data;
                setCategories(categories)
            })
            .catch(err => {
                console.log(err.message)
            })
            // authcheck
            authCheckState();
    }, [])


    const handleFilter = () => {
        navigation.navigate('itemFilter',{});
    }



    const handleNavigationItems = () => {
        props.navigation.navigate('items');
      };

    const handleNavigationStore =() => {
        props.navigation.navigate('stores');
      };


 return (<>
  <StatusBar translucent backgroundColor='transparent' barStyle="dark-content" />
    <View  style={style.mainHeader}>
        <Text style={style.headerText} >
            Swami Sales
        </Text>
    </View>
    <View
        style={style.container}
    >
        <View style={{backgroundColor : themeColor}}>
        <View style={{
            paddingHorizontal : 10
        }}>
            <Searchbar
                placeholder="Search"
                value={''}
                onPressOut={handleFilter}
                autoFocus={false}
                style={{
                    width : '100%',
                    alignSelf : 'center',
                    marginVertical : 10,
                }}
                />
        </View>    
       
    
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}> 
                <Tab  value={index} onChange={setIndex} dense>
                    <Tab.Item 
                        titleStyle={{ fontSize: 14, color : 'white', minWidth : 40}}
                        >
                        <Avatar 
                            rounded
                            size={20}
                            source={{
                                uri:'https://cdn-icons-png.freepik.com/512/7835/7835563.png'
                            }} 
                     
                                />
                        {"All"}
                    </Tab.Item>
                    {categories.map((category:Category,i)=> {
                        return <Tab.Item 
                        key={i}
                        titleStyle={{ 
                            fontSize: 14, 
                            color : 'white', 
                            minWidth : 40
                        }}
                        >
                        <Avatar  
                        rounded
                        size={20}
                        source={{
                            uri:category.icon
                        }} 
                        />
                        {category.category}
                        </Tab.Item>
                    })}
                
                </Tab>
            </ScrollView>
        </View>

        <TabView disableSwipe value={index} onChange={(e) => setIndex(e)} animationType="spring">

            <TabView.Item
             style={{
                width: '100%',
            }}
            >
            <ScrollView 
                onScroll={onScroll}
                style={style.scrollView}>
          
                    <View 
                        style={{backgroundColor : themeColor}}
                    >
                            <View>
                                <Text style={{...style.titleHeadings, color : 'white',marginVertical : 12}}>
                                    Popular Items
                                </Text>
                                
                                <ScrollView 
                                    style={{
                                        paddingBottom : 20
                                    }} 
                                    horizontal 
                                    showsHorizontalScrollIndicator={false}
                                >
                                    <RecentItems {...props} marginHorizontal = {5}/>
                                </ScrollView>
                            </View>

                     
                    </View>   


                    <View style={style.parentView}>
                        <Text style={{...style.titleHeadings,marginVertical : 12}}>
                            Item Categories
                        </Text>
                        <ItemSubCategories {...props} />
                    </View>
            
                   <View style={style.parentView}>
                         <ItemCategories  {...props} />
                    </View>                     

            

                    <View style={style.parentView}>
                        <Text style={style.titleHeadings}>
                            Popular Stores
                        </Text>
                        <ScrollView horizontal>
                            <PopularStores
                             width = {120} 
                            {...props} 
                            showCategory={false}
                             />
                        </ScrollView>
                    </View>
                    <View style={style.parentView}>
                        <Text style={{...style.titleHeadings,marginVertical : 12}}>
                            Store Categories
                        </Text>
                        <StoreSubCategories {...props} />
                    </View>
               
                


                {/* Most populer items block started  */}
                    <View style={{
                        ...style.mostPopularItems,
                        ...style.parentView
                    }}>
                        <Text style={style.titleHeadings}>
                            Most Populer Items
                        </Text>
                        <TabItems showCategory={false}  
                            {...props} 
                            size = {51}
                            selfPadding ={false}
                        />

                        <TouchableOpacity style={style.paginate} onPress={()=>handleNavigationItems()} > 
                            <Text style={style.paginateText}>See all items</Text>
                            <Icon name='chevron-small-right' color={'#001475'}  type="entypo" />
                        </TouchableOpacity>
                    </View>

                {/* ! Most populer items block ended  */}
                    
                    <View style={{
                            ...style.mostPopularStores,
                            ...style.parentView
                            }}>
                        <Text style={style.titleHeadings} >
                            Most Populer Stores
                        </Text>
                        <TabItems 
                            {...props} 
                            size = {100} 
                            showCategory={false}
                            selfPadding={false}
                            />
                        <TouchableOpacity style={style.paginate} onPress={()=>handleNavigationStore()} > 
                            <Text style={style.paginateText}>See all stores</Text>
                            <Icon name='chevron-small-right' color={'#001475'}  type="entypo" />
                        </TouchableOpacity>
                    </View>




              </ScrollView>  
            
            
            </TabView.Item>  
            {categories.map((category:Category,i)=> {
                return <TabView.Item key= {i} style={{width: '100%' }}>
                    <ScrollView 
                            onScroll={onScroll}
                            style={{...style.scrollView , ...style.parentView}}>
                        <View>
                            <Text style={style.titleHeadings}>
                                Related Categoires
                            </Text>
                            <ItemSubCategories {...props} categoryId={category.id} size={6} />
                        </View>
                        <View style={{flex : 1}}>
                            <Text style={style.titleHeadings}>
                                Related Items
                            </Text>
                            <TabItems {...props} showCategory={false} categoryId = {category.id} />
                        </View>
                    </ScrollView>
                </TabView.Item>  
            })}

    </TabView>
    </View>
    </>)
}


const style = StyleSheet.create({
    container: {
        flex: 1,
        margin: 0,
        borderRadius: 10,
        backgroundColor: themeColor,
        position: 'relative',
        top: 0
    },
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flexGrow: 1,
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    titleHeadings: {
        paddingHorizontal: 10,
        fontWeight: 'bold',
        fontSize: 16,
        marginVertical: 20,
    },
    mostPopularItems: {
        flex: 1
    },
    mostPopularStores: {
        flex: 1
    },
    paginate: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white',
        width: '100%',
        height: 40,
        justifyContent: 'center',
        borderRadius: 20,
        paddingVertical: 10,
        marginVertical: 10,
    },
    paginateText: {
        textAlign: 'center',
        fontWeight: '500',
        color: '#001475',
        fontSize: 16
    },
    parentView: {
        backgroundColor: bodyColor,
        width: '100%',
        paddingHorizontal: 5
    },
    mainHeader: {
        paddingBottom: 10,
        height: 90,
        justifyContent: 'flex-end',
        backgroundColor: themeColor,
        paddingHorizontal: 10
    },
    headerText: {
        fontSize: 18,
        fontWeight: '800',
        color: bodyColor
    }
})

const mapToStateProps = (state : any) =>{
    return {
        token : state.userReducer?.token
    }
}

export default connect(mapToStateProps)(HomeScreen)