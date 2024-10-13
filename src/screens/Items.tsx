import React, { useEffect, useState } from 'react'
import CustomCard from '../components/StoreCard'
import { ScrollView } from 'react-native'
import { StyleSheet, View } from 'react-native'
import ItemCard from '../components/ItemCard'
import axios from 'axios'
import { itemImageUrl, ItemsUrl } from '../utils/utils'
import { Item } from '../redux'
const style = StyleSheet.create({
    outerView : {
        display : 'flex',
        flex : 1,
        flexDirection : 'row',
        flexWrap: 'wrap',
        width:'98%',
        justifyContent:'center',
        alignContent:'center',
        alignItems :'center'
    },
    innerView : {
        width : '50%'
    },

})

function Items() {

        const [items, setItems] = useState([])
        /** Get wholesale using user slug. */
        useEffect(() => {
            const getItems = async () => {
                await axios.post(ItemsUrl+"all",{})
                    .then(res => {
                        let item = res.data.content;
                        setItems(item)
                    })
                    .catch(err => {
                        console.log(err.message)
                    })
            }
            getItems()
        }, [])
    

  return (
    <ScrollView>
        <View style={style.outerView}>
        {items.map((item:Item) =>{
                return(<>
                 <View style={style.innerView} >
                    <ItemCard item={item}  url='https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg'/>
                </View>
                </>)
            })}
            </View>
   </ScrollView>
  )




}

export default Items