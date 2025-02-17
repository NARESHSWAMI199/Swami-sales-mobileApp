import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import ItemCard from '../components/ItemCard';
import { ApplicationState, Item } from '../redux';
import { toTitleCase } from '../utils';
import { bodyColor, itemsUrl } from '../utils/utils';
import { logError, logInfo } from '../utils/logger'; // Import logger

function CategirzedItems(props:any) {
    const {route, navigation, location} = props;
    const {
        category,
        id
    }= route.params

    // State variables
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([])

    // Effect to set navigation options
    useEffect(()=>{
        navigation.setOptions({
            title: toTitleCase(category),
        })
        logInfo(`Navigation options set for category: ${category}`)
    },[])

    // Effect to fetch items based on category id
    useEffect(() => {
        let data = {
            categoryId : id,
            pageSize : 99,
            zipCode: location?.postalCode // Add zipCode from props
        }
        logInfo(`Fetching items for category id: ${id}`)
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
        paddingHorizontal : 10,
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
        backgroundColor : 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerView : {
        width : '32%',
        margin : 2
    }

})

const mapStateToProps = (state: ApplicationState) => ({
    location: state.userReducer.location
})

export default connect(mapStateToProps)(CategirzedItems)