
import { Image, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { toTitleCase } from '../utils';
import { bodyColor, itemImageUrl } from '../utils/utils';
import { Badge } from 'react-native-elements';

const ItemCard = (props:any) => {
    const {
        price,
        name,
        description,
        avatar,
        slug,
        discount,
        label
    } = props.item
    const avtar = itemImageUrl+slug+"/"+avatar

return(
  <View style={style.card}>
    <View style={style.cover}>
      <Image
        style={style.cardCover}
        resizeMode  = 'contain'
        source = {{ uri: !!avatar ? avtar : props.url}} />
    </View>
        <View style={style.badge}>
          {label == 'O' ?<Badge 
              textStyle ={{
                color : '#001475',
                fontSize : 10
              }}
              badgeStyle={{
                paddingHorizontal : 5,
                backgroundColor : '#f1f7ed'
              }} 
              status='primary' 
              value={'Old'} 
              /> : 
              <Badge 
                status='success' 
                value={'New'}

                textStyle = {{
                  color : '#001475',
                  fontSize : 10
                }}

                badgeStyle={{
                  paddingHorizontal : 5,
                  backgroundColor : '#f2f5fa'
                }} 
               />}
        </View>
          <Text style={style.itemTitle} >
            {toTitleCase(name.substring(0,20))}
          </Text>
      
        <Text style={style.discount} >{Math.floor((discount/price)*100) +"% OFF"} </Text>
        <View style={{display : 'flex', flexDirection : 'row'}}>
          <Text style={style.price} >{"\u20B9 "+(price-discount)} </Text>
          <Text style={style.actualPrice} >{"\u20B9 "+price} </Text>
        </View>
    </View>
);
} 


const style = StyleSheet.create({
  card : {
    display : 'flex',
    flexDirection : 'column',
    width:'100%',
    alignContent : 'center',
    paddingHorizontal : 1,
    paddingBottom : 5
  },
  price : {
    fontSize : 12,
    fontWeight : 'bold',
    color : 'black',
  },
  actualPrice : {
    fontSize : 12,
    fontWeight : 'bold',
    color : '#939393',
    textDecorationLine: 'line-through' 
  },
  discount : {
    fontSize : 12,
    color : 'green',
    flexWrap : 'wrap'
  },
  cardCover : {
      width : '100%',
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
    height: 120,
    flex  :1,
    borderRadius : 10
  },
  badge :  {
    marginTop : 10,
    alignSelf : 'flex-start'
  }


})


export default ItemCard;