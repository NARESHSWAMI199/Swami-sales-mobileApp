import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import StoreCard from '../components/StoreCard';
import { Store } from '../redux';
import { bodyColor, storeUrl } from '../utils/utils';

function PopularStores(props:any) {
    const [stores,setStores] = useState([])
    const [showSpinner,setShowSpinner] = useState(false)

    useEffect(() => {
        let data = {
            pageSize : 12
        }
        console.log("PopularStores")
        axios.post(storeUrl+"all",data)
          .then(res => {
              let response = res.data.content;
              setStores(response)
              setShowSpinner(false)
          })
          .catch(err => {
              console.log("PopularStores : ",err.message)
              setShowSpinner(false)
          })
  }, [])

    const handleNavigation = (store : Store) => {
        props.navigation.navigate('storeDetail',store);
    };

  return (
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
  )
}

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
        width : 120,
        backgroundColor : 'white',
        borderRadius : 10,
        marginHorizontal : 2
    },

})

export default PopularStores