import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import ItemCard from '../components/ItemCard';
import { Item } from '../redux';
import { bodyColor, itemsUrl } from '../utils/utils';
import { logError, logInfo } from '../utils/logger'; // Import logger

function TabItems(props:any) {
    const {categoryId,storeId} = props;

    // State variables
    const [showSpinner,setShowSpinner] = useState(false)
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
                setShowSpinner(false)
                logInfo(`Items fetched successfully`)
            })
            .catch(err => {
                setShowSpinner(false)
                logError(`Error fetching items: ${err.message}`)
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
    },
    innerView : {
        width : '32%',
        margin : 2
    }

})

export default TabItems