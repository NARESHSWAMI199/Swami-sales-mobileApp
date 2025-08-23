import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ItemCard from '../components/ItemCard';
import { Item } from '../redux';
import { toTitleCase } from '../utils';
import { bodyColor, itemsUrl, notFoundImage, themeColor } from '../utils/utils';
import { Avatar } from 'react-native-elements';
import { logError, logInfo } from '../utils/logger'; // Import logger

function SubCategirzedItems(props:any) {
    const {route, navigation} = props;
    const {
        subcategory,
        id
    }= route.params

    // State variables
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([])

    // Effect to set navigation options
    useEffect(()=>{
        navigation.setOptions({
            title: toTitleCase(subcategory),
        })
        logInfo(`Navigation options set for subcategory: ${subcategory}`)
    },[])

    // Effect to fetch items based on subcategory id
    useEffect(() => {
        let data = {
            subcategoryId : id,
            pageSize : 99
        }
        logInfo(`Fetching items for subcategory id: ${id}`)
        axios.post(itemsUrl+"all",data)
        .then(res => {
                let item = res.data.content;
                setItems(item)
                setLoading(false)
                logInfo(`Items fetched successfully`)
            })
            .catch(err => {
                setLoading(false)
                logError(`Error fetching items: ${!!err.response?.data.message ? err.response.data.message : err.message}`)
            })
    }, [])

    // Function to handle navigation to item detail
    const handleNavigation = (item : Item) => {
        logInfo(`Navigating to item detail: ${item.id}`)
        props.navigation.navigate('itemDetail',item);
    };

    // Render component
    return (<>
        {items.length > 0 ? 
        <ScrollView style={style.body}>
            <View style={style.outerView}>
                {items.map((item:Item , i) =>{
                        return(<TouchableOpacity key={i} style={style.innerView} onPress={(e) => handleNavigation(item)}> 
                            <ItemCard  item={item}/>
                        </TouchableOpacity>)
                    })
                }
            </View>
        </ScrollView>
        :    
        loading ? (
            <ActivityIndicator style={style.activityIndicator} size="large" color={themeColor} />
        ) : 
        <View style={style.notFound}> 
            <Avatar source={{uri : notFoundImage}} size={150}  />
            <Text style={style.notFoundText}>
                No items found.
            </Text>
        </View>
        }
    </>)
}

// Styles
const style = StyleSheet.create({
    body : {
        padding : 10,
        backgroundColor : bodyColor,
        height : '100%',
        flex : 1
    },
    titleHeadings : {
        marginHorizontal : 10,
        fontWeight : 'bold',
        fontSize : 16,
        marginVertical : 20,
        color : 'black',
    },
    outerView : {
        display : 'flex',
        flex : 1,
        flexDirection : 'row',
        flexWrap: 'wrap',
        width:'98%',
        backgroundColor : bodyColor,
        alignSelf : 'center'
    },
    innerView : {
        width : '32%',
        margin : 2
    },
    notFound : {
        justifyContent : 'center',
        alignItems : 'center',
        height : '100%',
        backgroundColor : bodyColor
    },
    notFoundText : {
        fontWeight : 'bold',
        fontSize : 14
    }, 
    activityIndicator : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center'
    }
})

export default SubCategirzedItems