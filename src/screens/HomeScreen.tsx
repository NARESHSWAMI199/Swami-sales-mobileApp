import { Tab, TabView } from '@rneui/themed'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BackHandler, Dimensions, NativeModules, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Avatar } from 'react-native-elements'
import { Searchbar } from 'react-native-paper'
import { ItemSubCategories, StoreSubCategories } from '../components/Subcategories'
import { Category } from '../redux'
import { itemsUrl, themeColor } from '../utils/utils'
import Items from './Items'
import RecentItems from './RecentItems'
import Stores from './Store'

export const  HomeScreen = (props : any) => {
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
}, [navigation]);


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
    }, [])


    const handleFilter = () => {
        navigation.navigate('itemFilter',{});
    }


 return (<View
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
                                    {"Popular Items"}
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

                    <View style={{backgroundColor : 'white'}}>
                        <Text style={{...style.titleHeadings,marginVertical : 12}}>
                            {"Item Categories"}
                        </Text>
                        <ItemSubCategories />
                    </View>
            

                    <View style={{backgroundColor : 'white'}}>
                        <Text style={style.titleHeadings}>
                            {"Popular Stores"}
                        </Text>
                        <Stores {...props} />
                    </View>
                    <View style={{backgroundColor : 'white'}}>
                        <Text style={{...style.titleHeadings,marginVertical : 12}}>
                                {"Store Categories"}
                            </Text>
                        <StoreSubCategories />
                    </View>
               
                
                    <View style={style.mostPopularItems}>
                        <Text style={style.titleHeadings}>
                            {"Most Populer Items"}
                        </Text>
                        <RecentItems  
                            {...props} 
                            width = { '32%'} 
                            size = {51}
                        />
                    </View>
                    
                    <View style={{backgroundColor : 'white'}}>
                        <Text style={style.titleHeadings} >
                            {"Most Populer Stores"}
                        </Text>
                        <Stores {...props} size = {51}/>
                    </View>
              </ScrollView>  
                </TabView.Item>   
        
            {categories.map((category:Category,i)=> {
                return <TabView.Item key= {i} style={{width: '100%' }}>
                    <ScrollView 
                            onScroll={onScroll}
                            style={{...style.scrollView , backgroundColor : 'white'}}>
                        <Items {...props} showCategory={false} categoryId = {category.id} />
                    </ScrollView>
                </TabView.Item>  
            })}

    </TabView>
    </View>)
}


const style = StyleSheet.create({
    container : {
        flex : 1,
        margin : 0,
        borderRadius : 10, 
        marginBottom : 0,
        backgroundColor : themeColor
    },
    body : {
        flex : 1,
        justifyContent:'center',
        alignItems : 'center',
        margin : 0,
        padding : 0,
    },
    scrollView: {
        flexGrow : 1,
        width:'100%',
        height : '100%',
        position : 'absolute'
    },
    titleHeadings : {
        marginHorizontal : 10,
        fontWeight : 'bold',
        fontSize : 16,
        marginVertical : 20,
    },
    mostPopularItems : {
        display : 'flex',
        padding : 'auto',
        backgroundColor : 'white',
    }
   
 
})

