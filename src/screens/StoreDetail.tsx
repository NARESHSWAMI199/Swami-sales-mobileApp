import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import {Badge, Rating } from 'react-native-elements';
import { Text } from 'react-native-paper';
import { Store } from '../redux';
import { toTitleCase } from '../utils';
import { storeImageUrl } from '../utils/utils';
import { TabItem } from '@rneui/base/dist/Tab/Tab.Item';
import TabItems from './TabItems';
import ViewMoreText from 'react-native-view-more-text';
import { Icon } from '@rneui/themed';
import PagiantedItems from '../components/PaginatedItems';





const StoreDetail = (props:any) => {

  const {route, navigation} = props;
  const [state,setState] = useState("")

  const store : Store = route.params;


  const updateSearch = (search :any) => {
    setState(search);
  };



  const renderViewMore = (onPress:any) => {
    return(
      <View style={{
          display : 'flex', 
          flexDirection : 'row',
          marginVertical : 10
          }}>
        <Icon name='chevron-small-down' color='black' type="entypo" />
       <Text onPress={onPress}>       
        View more
        </Text>
      </View>

    )
  }
  const renderViewLess = (onPress:any) =>{
    return(
      <View 
        style={{
          display : 'flex',
          flexDirection : 'row',
          marginVertical : 10
         }}>
      <Icon name='chevron-small-up'  type="entypo" />
      <Text onPress={onPress}>       
        View less
      </Text>
    </View>
    )
  }


  return (<>
    <StatusBar translucent backgroundColor="transparent"  barStyle="dark-content" />

  <ScrollView style={{ backgroundColor:'white'}}>
    <View style={styles.imageParent}>
      <Image style={styles.image} 
        source={{uri : storeImageUrl  +  store.slug + "/"+store.avatar}}
        resizeMode={'cover'} />
    </View>
    <View style={styles.body}>
    <View style={{
              display : 'flex', 
              justifyContent : 'flex-start',
              flexDirection : 'row',
              alignItems :'flex-start'}}>
        <Badge 
                textStyle ={{
                  color : '#001475',
                  fontSize : 10,
                }}
                badgeStyle={{
                  backgroundColor : '#f1f7ed',
                }} 
                status='primary' 
                value={store?.storeSubCategory?.subcategory} 
          />
          <Badge 
                textStyle ={{
                  color : '#001475',
                  fontSize : 10,
                }}
                badgeStyle={{
                  backgroundColor : '#f1f7ed',
                }} 
                status='primary' 
                value={store?.storeCategory?.category} 
          />
          </View>

        <Text style={styles.title} variant="titleLarge">{toTitleCase(store.name.trim())} </Text>
        <View style={styles.rating}>
          <Text style={{...styles.subtitle,
              marginTop : 0, 
              marginRight : 10,
            }}>{"Rating : "}</Text>
          <Rating type='custom' imageSize={25} 
          readonly 
          startingValue={store.rating} />
        </View>


        <View>
            <Text style={styles.titleHeadings}>
              Our Latest Products
            </Text>
            {/* <TabItems {...props} storeId={store.id} /> */}
          <PagiantedItems {...props} storeId={store.id} />
            {/* Need to add pagination here. */ }

            <Text style={styles.subtitle}>About us : </Text>
            <ViewMoreText
              numberOfLines={3}
              renderViewMore={renderViewMore}
              renderViewLess={renderViewLess}
            >
              <Text style={styles.description}>{store.description.trim()}</Text>
            </ViewMoreText>
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
    paddingHorizontal : 10,
    paddingTop : 10,
  },
  title : {
    fontSize : 16,
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
    fontSize : 16,
    fontWeight : '700'
  },
  button : {
    borderRadius : 20,
    height : 50,
    width : 172,
    backgroundColor : '#D5DCE7',
    alignItems  : 'center',
    justifyContent : 'center',
  },
  titleHeadings : {
    fontWeight : 'bold',
    fontSize : 16,
    marginVertical : 20,
},  
description : {
  fontSize : 14 , 
  fontWeight : '500',
}

})

export default StoreDetail