import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ItemCard from '../components/ItemCard';
import { Item } from '../redux';
import { bodyColor, itemsUrl } from '../utils/utils';
import { logError, logInfo } from '../utils/logger'; // Import logger

function TabItems(props:any) {
    const {categoryId,storeId} = props;

    // State variables
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([])

    // Effect to fetch items based on categoryId and storeId
    useEffect(() => {
        let data = {
            categoryId : categoryId,
            storeId : storeId,
            pageSize : 99
        }
        logInfo(`Fetching items for categoryId: ${categoryId} and storeId: ${storeId}`)
        axios.post(itemsUrl+"all",data)
        .then(res => {
                let items = res.data.content;
                setItems(items)
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
    return (
        <ScrollView style={style.body}>
            <View style={style.outerView}>
                {loading ? (
                    <ActivityIndicator size="large" color={bodyColor} />
                ) : (
                    items.map((item:Item , i) =>{
                        return(
                            <TouchableOpacity key={i} style={style.innerView} onPress={(e) => handleNavigation(item)}> 
                                <ItemCard  item={item}/>
                            </TouchableOpacity>
                        )
                    })
                )}
            </View>
        </ScrollView>
    )
}

// Styles
const style = StyleSheet.create({
    body : {
        backgroundColor : bodyColor,
        height : '100%',
        flex : 1
    },
    outerView : {
        display : 'flex',
        flex : 1,
        flexDirection : 'row',
        flexWrap: 'wrap',
        // justifyContent: 'center',
        alignItems: 'center',
    },
    innerView : {
        width : '32%',
        margin : 2
    }

})

export default TabItems