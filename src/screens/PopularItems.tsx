import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import ItemCard from '../components/ItemCard';
import { Item } from '../redux';
import { toTitleCase } from '../utils';
import { bodyColor, itemsUrl } from '../utils/utils';

function PopularItems(props:any) {
    const {route, navigation} = props;
    const {
        subcategory,
        id
    }= route.params

    const [showSpinner,setShowSpinner] = useState(false)

    useEffect(()=>{
        navigation.setOptions({
            title: toTitleCase(subcategory),
        })
    },[])

    const [items, setItems] = useState([])



    useEffect(() => {
        let data = {
            subcategoryId : id,
            pageSize : 99
        }
        console.log("PopularItems")
        axios.post(itemsUrl+"all",data)
        .then(res => {
                let item = res.data.content;
                setItems(item)
                setShowSpinner(false)
            })
            .catch(err => {
                setShowSpinner(false)
                console.log("PopularItems : ",err.message)
            })
    }, [])



    const handleNavigation = (item : Item) => {
        props.navigation.navigate('itemDetail',item);
    };



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
        backgroundColor : 'white'
    },
    innerView : {
        width : '32%',
        margin : 2
    }

})

export default PopularItems