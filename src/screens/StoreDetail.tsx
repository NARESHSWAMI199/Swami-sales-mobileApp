import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { Rating } from 'react-native-elements';
import { Text } from 'react-native-paper';
import { Store } from '../redux';
import { toTitleCase } from '../utils';
import { storeImageUrl } from '../utils/utils';





const StoreDetail = (props:any) => {

  const {route, navigation} = props;
  const [state,setState] = useState("")

  const store : Store = route.params;


  const updateSearch = (search :any) => {
    setState(search);
  };



  return (<>
    <StatusBar translucent backgroundColor="transparent"  barStyle="dark-content" />

  <ScrollView style={{ backgroundColor:'white'}}>
    <View style={styles.imageParent}>
      <Image style={styles.image} source={{uri : storeImageUrl  +  store.slug + "/"+store.avatar}} />
    </View>
    <View style={styles.body}>
      <View>
        <Text style={styles.title} variant="titleLarge"> {toTitleCase(store.name.trim())} </Text>
        <View style={styles.rating}>
          <Text style={{...styles.subtitle,marginTop : 0, marginRight : 10,paddingLeft : 5}}>{"Rating : "}</Text>
          <Rating type='custom' imageSize={25} readonly startingValue={store.rating} />
        </View>
        <View style={{display : 'flex', flexDirection : 'row'}}>
          <Text style={styles.subtitle}> {"Store : "}</Text>
          <Text style={{...styles.subtitle,fontWeight : '500',fontSize : 16}}> {"Swami sales"}</Text>
        </View>
        <View>
          <Text style={styles.subtitle}> {"Description : "}</Text>
          <Text style={{fontSize : 16 , fontWeight : '500'}}> {store.description}</Text>
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
    fontSize : 18,
    fontWeight : 'bold',
    color : 'black',
    marginRight : 'auto'
  },
  priceParent : {
    display : 'flex',
    flex : 1,
    flexDirection :'row',
    marginTop : 12, 
  },
  price : {
    fontSize : 16,
    fontWeight : 'bold',
    color : 'black',
    opacity : 0.8
  },
  discount : {
    fontSize : 16,
    fontWeight : 'bold',
    color : '#0D6900',
  },
  totalPrice : {
    marginTop : 10, 
    fontSize : 16,
    fontWeight : 'bold',
    color : '#939393',
    textDecorationLine: 'line-through' 
  },
  rating : {
    marginTop : 10,
    marginRight : 'auto',
    display : 'flex',
    flexDirection : 'row',
    justifyContent : 'center',
    alignItems : 'center'
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

export default StoreDetail