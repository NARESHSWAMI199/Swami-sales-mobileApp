import React, { useState } from 'react'
import { ScrollView, StyleSheet, View,Image, Pressable} from 'react-native'
import { getPercentage, itemImageUrl } from '../utils/utils'
import { Item } from '../redux';
import { toTitleCase } from '../utils';
import {Text } from 'react-native-paper';
import { Rating, SearchBar } from 'react-native-elements';



const styles = StyleSheet.create({
  imageParent : {
    width : '100%',
    height : 320,
  },
  image : {
    width : '100%',
    height : 320
  },
  body : {
    padding : 20,
    paddingTop : 20,
    opacity : 0.8
  },
  title : {
    fontSize : 22,
    fontWeight : 'bold',
    color : 'black'
  },
  priceParent : {
    display : 'flex',
    flex : 1,
    flexDirection :'row',
    marginTop : 12, 
  },
  price : {
    fontSize : 22,
    fontWeight : 'bold',
    color : 'black',
    opacity : 0.8
  },
  discount : {
    fontSize : 22,
    fontWeight : 'bold',
    color : '#0D6900',
  },
  totalPrice : {
    marginTop : 10, 
    fontSize : 22,
    fontWeight : 'bold',
    color : '#939393',
    textDecorationLine: 'line-through' 
  },
  rating : {
    marginTop : 10,
    marginRight : 'auto',
  },
  subtitle : {
    marginTop : 12,
    fontSize : 18,
    fontWeight : '700'
  },
  button : {
    borderRadius : 20,
    height : 50,
    width : 172,
    backgroundColor : '#D5DCE7',
    alignItems  : 'center',
    justifyContent : 'center',
  }

})

const ItemDetail = (props:any) => {

  const {route, navigation} = props;
  const [state,setState] = useState("")

  const item : Item = route.params;


  const updateSearch = (search :any) => {
    setState(search);
  };



  return (<>
  
  <ScrollView style={{ backgroundColor:'white'}}>
    <View style={styles.imageParent}>
      <Image style={styles.image} source={{uri : itemImageUrl  +  item.slug + "/"+item.avatar}} />
    </View>
    <View style={styles.body}>
      <View>
        <Text style={styles.title} variant="titleLarge"> {toTitleCase(item.name.trim())} </Text>
        <View style={styles.priceParent}>
           <Text style={styles.price} variant="titleLarge"> {item.price-item.discount +" \u20B9"} </Text>
           <Text style={{...styles.price,marginLeft : 20} } variant="titleLarge">
              <Text style={styles.discount}> {Math.floor(getPercentage(item.discount,item.price)*1) +"% "}</Text>
              {"off"}
            </Text>
        </View>
        <Text style={styles.totalPrice}> {item.price +" \u20B9"}</Text>
        <View style={styles.rating}>
          <Rating type='custom'  imageSize={30} readonly startingValue={item.rating} />
        </View>
        <View style={{display : 'flex', flexDirection : 'row'}}>
          <Text style={styles.subtitle}> {"Store : "}</Text>
          <Text style={{...styles.subtitle,fontWeight : '500',fontSize : 18}}> {"Swami sales"}</Text>
        </View>
        <View>
          <Text style={styles.subtitle}> {"Description : "}</Text>
          <Text style={{fontSize : 16 , fontWeight : '500'}}> {item.description}</Text>
        </View>
      </View>

      <View style={{display : 'flex',alignItems : 'center', marginTop : 64 }}>
        <Pressable
          onPress={(e) => console.log("clicked")}
          style={styles.button}
          accessibilityLabel="Learn more about this purple button"
        >
          <Text style={{fontSize : 18, fontWeight : 'bold'}} >{"ADD TO SLIP"}</Text>
        </Pressable>
      </View>

    </View>
  </ScrollView>
  
  </>
  )
}

export default ItemDetail