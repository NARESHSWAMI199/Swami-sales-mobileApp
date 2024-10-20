
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { Avatar } from 'react-native-elements';
import { itemImageUrl } from '../utils/utils';
import { useEffect } from 'react';
import { toTitleCase } from '../utils';

const style = StyleSheet.create({
    card : {
      width:'100%',
      padding : 3,
      marginLeft : 8,
      marginRight : 8,
      height : 286,
      borderWidth : 0.1,
      shadowColor :'black',
      borderColor : 'black',
      textAlign : 'center',
      alignItems : 'center',
      marginBottom : 5,
      //margin:5,

    },
    price : {
      fontSize : 16,
      fontWeight : 'bold',
      color : 'green',
    },
    cardCover : {
        width : '100%',
        height: 206,
        // borderRadius : 0,
        overflow: 'hidden'
    },
    itemTitle : {
        fontSize : 16,
        fontWeight : 'bold',
        marginTop : 8,
        // fontFamily : 'inter',
    }
  
  
  })


const ItemCard = (props:any) => {
    const {
        price,
        name,
        description,
        avatar,
        slug
    } = props.item
    const avtar = itemImageUrl+slug+"/"+avatar

return(
  <View style={style.card}>
      < Card.Cover 
        style={style.cardCover}
       resizeMode='cover' source = {{ uri: !!avatar ? avtar : props.url}} />
          <Text variant="titleLarge" style={style.itemTitle} >
            { toTitleCase(name.substring(0,15))}
            </Text>
          {/* </Card.Content> */}
        < Card.Actions >
        <Text style={style.price} > {price +" \u20B9"} </Text>
        </Card.Actions>
    </View>
);
} 


export default ItemCard;