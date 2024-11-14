import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import ItemCard from '../components/ItemCard';
import { Item } from '../redux';
import { bodyColor, itemsUrl } from '../utils/utils';




function TabItems(props:any) {
    const {categoryId,storeId} = props;
    const [showSpinner,setShowSpinner] = useState(false)
    const [items, setItems] = useState([])

    useEffect(() => {
        let data = {
            categoryId : categoryId,
            storeId : storeId,
            pageSize : 99
        }
        console.log("TabItems")
        axios.post(itemsUrl+"all",data)
        .then(res => {
                let items = res.data.content;
                setItems(items)
                setShowSpinner(false)
            })
            .catch(err => {
                setShowSpinner(false)
                console.log("TabItems.tsx  : ",err.message)
            })
    }, [])



    const handleNavigation = (item : Item) => {
        props.navigation.navigate('itemDetail',item);
    };



  return (<ScrollView style={style.body}>
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
        width:'98%',
        backgroundColor : 'white'
    },
    innerView : {
        width : '32%',
        margin : 2
    }

})

export default TabItems