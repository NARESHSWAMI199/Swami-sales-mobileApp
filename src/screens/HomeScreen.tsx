import { Tab, TabView } from '@rneui/themed'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BackHandler, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
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
import Stores from './Stores'

// Main component
const HomeScreen = (props: any) => {
    const { navigation } = props;

    // Adding auth token to axios headers
    useEffect(() => {
        const  updateToken = async () => {
            let token = await props.token;
            axios.defaults.headers['Authorization'] = token;
        }
        updateToken();
    }, [props.token])

    // Function to hide the tab bar
    const hideTabBar = () => {
        navigation.setOptions({
            tabBarStyle: { display: 'none' },
        });
    };

    // Function to show the tab bar
    const showTabBar = () => {
        navigation.setOptions({
            tabBarStyle: { height: 60, display: 'flex' },
        });
    };

    // Handle scroll event to show/hide tab bar
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

    // Effect to handle back button press
    useEffect(() => {
        navigation.addListener("beforeRemove", (e: any) => {
            e.preventDefault();
            BackHandler.exitApp();
        })
    }, []);

    const [index, setIndex] = useState(0);
    const [categories, setCategories] = useState([])

    // Effect to fetch categories and perform auth check
    useEffect(() => {
        axios.post(itemsUrl + "categories", { orderBy: 'id' })
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

    // Handle filter navigation
    const handleFilter = () => {
        navigation.navigate('itemFilter', {});
    }

    // Handle navigation to items screen
    const handleNavigationItems = () => {
        props.navigation.navigate('items');
    };

    // Handle navigation to stores screen
    const handleNavigationStore = () => {
        props.navigation.navigate('stores');
    };

    return (<>
        <StatusBar translucent backgroundColor='transparent' barStyle="dark-content" />
        
        {/* Header section */}
        <View style={style.mainHeader}>
            <Image
                source={require('../images/logow.png')}
                style={style.logo}
            />
            <Text style={style.headerText}>
                Swami Sales
            </Text>
        </View>
        
        {/* Main container */}
        <View style={style.container}>
            <View style={{ backgroundColor: themeColor }}>
                <View style={{ paddingHorizontal: 10 }}>
                    <Searchbar
                        placeholder="Search"
                        value={''}
                        onPressOut={handleFilter}
                        autoFocus={false}
                        style={{
                            width: '100%',
                            alignSelf: 'center',
                            marginVertical: 10,
                        }}
                    />
                </View>

                {/* Categories tab */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    <Tab value={index} onChange={setIndex} dense>
                        <Tab.Item
                            titleStyle={{ fontSize: 14, color: 'white', minWidth: 50 }}
                        >
                            <Icon
                                name='home'
                                type='font-awesome'
                                size={20}
                                color='white'
                            />
                            {"All"}
                        </Tab.Item>
                        {categories.map((category: Category, i) => {
                            return <Tab.Item
                                key={i}
                                titleStyle={{
                                    fontSize: 14,
                                    color: 'white',
                                    minWidth: 50
                                }}
                            >
                                  <Avatar
                                    rounded
                                    size={20}
                                    source={{
                                        uri: category.icon
                                    }}
                                />
                                {category.category}
                            </Tab.Item>
                        })}

                    </Tab>
                </ScrollView>
            </View>

            {/* Tab view for categories */}
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
                            style={{ backgroundColor: themeColor }}
                        >
                            <View>
                                <Text style={{ ...style.titleHeadings, color: 'white', marginVertical: 12 }}>
                                    Popular Items
                                </Text>

                                <ScrollView
                                    style={{
                                        paddingBottom: 20
                                    }}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                >
                                    <RecentItems {...props} marginHorizontal={5} />
                                </ScrollView>
                            </View>
                        </View>

                        {/* Item categories section */}
                        <View style={style.parentView}>
                            <Text style={{ ...style.titleHeadings, marginVertical: 12 }}>
                                Item Categories
                            </Text>
                            <ItemSubCategories {...props} />
                        </View>

                        <View style={style.parentView}>
                            <ItemCategories  {...props} />
                        </View>

                        {/* Popular stores section */}
                        <View style={style.parentView}>
                            <Text style={style.titleHeadings}>
                                Popular Stores
                            </Text>
                            <ScrollView horizontal>
                                <PopularStores
                                    width={"32%"}
                                    {...props}
                                    showCategory={false}
                                />
                            </ScrollView>
                        </View>
                        <View style={style.parentView}>
                            <Text style={{ ...style.titleHeadings, marginVertical: 12 }}>
                                Store Categories
                            </Text>
                            <StoreSubCategories {...props} />
                        </View>

                        {/* Most popular items section */}
                        <View style={{
                            ...style.mostPopularItems,
                            ...style.parentView
                        }}>
                            <Text style={style.titleHeadings}>
                                Most Populer Items
                            </Text>
                            <TabItems showCategory={false}
                                {...props}
                                size={51}
                                selfPadding={false}
                            />

                            <TouchableOpacity style={style.paginate} onPress={() => handleNavigationItems()} >
                                <Text style={style.paginateText}>See all items</Text>
                                <Icon name='chevron-small-right' color={'#001475'} type="entypo" />
                            </TouchableOpacity>
                        </View>

                        {/* Most popular stores section */}
                        <View style={{
                            ...style.mostPopularStores,
                            ...style.parentView
                        }}>
                            <Text style={style.titleHeadings} >
                                Most Populer Stores
                            </Text>
                            <Stores
                                {...props}
                                size={100}
                                showCategory={false}
                                selfPadding={false}
                            />
                            <TouchableOpacity style={style.paginate} onPress={() => handleNavigationStore()} >
                                <Text style={style.paginateText}>See all stores</Text>
                                <Icon name='chevron-small-right' color={'#001475'} type="entypo" />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </TabView.Item>

                {/* Tab view items for each category */}
                {categories.map((category: Category, i) => {
                    return <TabView.Item key={i} style={{ width: '100%' }}>
                        <ScrollView
                            onScroll={onScroll}
                            style={{ ...style.scrollView, ...style.parentView }}>
                            <View>
                                <Text style={style.titleHeadings}>
                                    Related Categoires
                                </Text>
                                <ItemSubCategories {...props} categoryId={category.id} size={6} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={style.titleHeadings}>
                                    Related Items
                                </Text>
                                <TabItems {...props} showCategory={false} categoryId={category.id} />
                            </View>
                        </ScrollView>
                    </TabView.Item>
                })}
            </TabView>
        </View>
    </>)
}

// Styles
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
        justifyContent: 'flex-start',
        backgroundColor: themeColor,
        paddingHorizontal: 10,
        paddingVertical: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: '800',
        color: bodyColor,
        marginLeft: 10,
    },
    logo: {
        width: 30,
        height: 30,
    }
})

// Map state to props
const mapToStateProps = (state: any) => {
    return {
        token: state.userReducer?.token
    }
}

export default connect(mapToStateProps)(HomeScreen)