import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Items from './Items'
import { Store, Subcategory } from '../redux';
import { bodyColor, notFoundImage, storeUrl } from '../utils/utils';
import { toTitleCase } from '../utils';
import Stores from './Stores';
import Spinner from 'react-native-loading-spinner-overlay';
import StoreCard from '../components/StoreCard';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-elements';
import { logError, logInfo } from '../utils/logger' // Import logger

function SubCategirzedStores(props:any) {
    const {route, navigation} = props;
    const {
        subcategory,
        id
    }= route.params

    // State variables
    const [stores,setStores] = useState([])
    const [showSpinner,setShowSpinner] = useState(false)

    // Effect to set navigation options
    useEffect(()=>{
        navigation.setOptions({
            title: toTitleCase(subcategory),
        })
        logInfo(`Navigation options set for subcategory: ${subcategory}`)
    },[])

    // Effect to fetch stores based on subcategory id
    useEffect(() => {
        let data = {
            subcategoryId : id,
            pageSize : 99
        }
        logInfo(`Fetching stores for subcategory id: ${id}`)
        axios.post(storeUrl+"all",data)
          .then(res => {
              let response = res.data.content;
              setStores(response)
              setShowSpinner(false)
              logInfo(`Stores fetched successfully`)
          })
          .catch(err => {
              setShowSpinner(false)
              logError(`Error fetching stores: ${err.message}`)
          })
    }, [])

    // Function to handle navigation to store detail
    const handleNavigation = (store : Store) => {
        logInfo(`Navigating to store detail: ${store.id}`)
        navigation.navigate('storeDetail',store);
    };

    // Render component
    return (<>
        {stores.length > 0 ? 
        <ScrollView style={style.body}>
            <View style={style.storeParent}>
                <Spinner
                    visible={showSpinner}
                    textContent={'Loading...'}
                    textStyle={{color : 'white'}}
                />
                {stores.map((store,i)=>{
                    return <TouchableOpacity key={i} style={style.storeView} onPress={e=> handleNavigation(store)} >
                        <StoreCard store={store}/>
                    </TouchableOpacity>
                })}
            </View>
        </ScrollView>
        :    
        <View style={style.notFound}> 
            <Avatar source={{uri : notFoundImage}} size={150}  />
            <Text style={style.notFoundText}>
                No stores found.
            </Text>
        </View>
        }
    </>)
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
    storeParent : {
        display : 'flex',
        flexDirection : 'row',
        flexWrap : 'wrap',
      },
      storeView : {
        width :'32%',
        backgroundColor : 'white',
        borderRadius : 10,
        marginHorizontal : 2
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
    }

})

export default SubCategirzedStores