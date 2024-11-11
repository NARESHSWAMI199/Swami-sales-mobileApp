import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Items from './Items'
import { Store, Subcategory } from '../redux';
import { bodyColor, storeUrl } from '../utils/utils';
import { toTitleCase } from '../utils';
import Stores from './Stores';
import Spinner from 'react-native-loading-spinner-overlay';
import StoreCard from '../components/StoreCard';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';

function SubCategirzedStores(props:any) {
    const {route, navigation} = props;
    const {
        subcategory,
        id
    }= route.params

    const [stores,setStores] = useState([])
    const [showSpinner,setShowSpinner] = useState(false)

    useEffect(() => {
        let data = {
            subcategoryId : id,
            pageSize : 99
        }
        console.log("SubCategirzedStores")
        axios.post(storeUrl+"all",data)
          .then(res => {
              let response = res.data.content;
              setStores(response)
              setShowSpinner(false)
          })
          .catch(err => {
              console.log("SubCategirzedStores : ",err.message)
              setShowSpinner(false)
          })
  }, [])


    useEffect(()=>{
        navigation.setOptions({
            title: toTitleCase(subcategory),
        })
    },[])

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
        width :'32%',
        backgroundColor : 'white',
        borderRadius : 10,
        marginHorizontal : 2
    },

})

export default SubCategirzedStores