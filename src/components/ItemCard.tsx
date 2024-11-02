
import { Image, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { toTitleCase } from '../utils';
import { itemImageUrl } from '../utils/utils';

const ItemCard = (props:any) => {
    const {
        price,
        name,
        description,
        avatar,
        slug,
        discount
    } = props.item
    const avtar = itemImageUrl+slug+"/"+avatar

return(
  <View style={style.card}>
    <View style={style.cover}>
      <Image
        style={style.cardCover}
        resizeMode='cover' 
        source = {{ uri: !!avatar ? avtar : props.url}} />
    </View>
        <Text style={style.itemTitle} >
          {toTitleCase(name.substring(0,20))}
        </Text>
        <Text style={style.discount} >{Math.floor((discount/price)*100) +"% OFF"} </Text>
        <Text style={style.price} >{"\u20B9 "+price} </Text>
    </View>
);
} 


const style = StyleSheet.create({
  card : {
    display : 'flex',
    flexDirection : 'column',
    width:'100%',
    alignContent : 'center',
    padding : 15,
    backgroundColor : '#f2f5fa',
    borderRadius : 10
  },
  price : {
    fontSize : 14,
    fontWeight : 'bold',
    color : 'black',
  },
  discount : {
    fontSize : 12,
    color : 'green',
  },
  cardCover : {
      width : '100%',
      overflow: 'hidden',
      borderRadius : 10,
      backgroundColor : '#d4defc',
      flex : 1
  },
  itemTitle : {
      fontSize : 14,
      fontWeight : 'bold',
      marginTop : 5
  },
  cover : {
    height: 80,
    flex  :1,
    borderRadius : 10
  }


})


export default ItemCard;