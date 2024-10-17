import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { itemImageUrl, storeImageUrl } from '../utils/utils';
import { toTitleCase } from '../utils';
import { Avatar, Rating } from 'react-native-elements';

const style = StyleSheet.create({
  card : {
    width:'100%',
    // height : 286,
    borderWidth : 0.1,
    shadowColor :'black',
    shadowOffset : {
      height : 10,
      width : 10
    },
    shadowOpacity : 0.8,
    marginBottom : 10,
  },
  cardCover : {
      width : '100%',
      height: 100,
      overflow: 'hidden'
  },
  body  : {
    display : 'flex',
    flexDirection : 'column'
  },
  itemTitle : {
      fontSize : 12,
      fontWeight : 'bold',
      marginTop : 8,
      alignSelf : 'center'
  },
  description : {
    fontSize : 16,
    paddingVertical : 10,
    alignSelf : 'center'
  }


})

const StoreCard = (props:any) => {
      const {
        name,
        description,
        avatar,
        slug,
        address,
        rating
    } = props.store
    const avtar = storeImageUrl+slug+"/"+avatar

  return <View style={style.card}>
        < Card.Cover 
          style={style.cardCover}
          resizeMode='cover' source = {{ uri: !!avatar ? avtar : props.url}} />
          <View>
            <Text variant="titleLarge" style={style.itemTitle} >
              { toTitleCase(name.substring(0,30))}
            </Text>
            <Rating type='custom' imageSize={15} readonly startingValue={rating} />
            {/* <Text style={style.description} > {description.substring(0,20)} </Text> */}
        </View>
      </View>
  }

export default StoreCard;