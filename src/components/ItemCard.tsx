
import { Image, StyleSheet, View } from 'react-native';
import { Badge, Rating } from 'react-native-elements';
import { Text } from 'react-native-paper';
import { toTitleCase } from '../utils';
import { itemImageUrl } from '../utils/utils';

const ItemCard = (props:any) => {
    const {
        price,
        name,
        avatars,
        slug,
        discount,
        rating,
        itemSubCategory,
        itemCategory,
        capacity,
    } = props.item
    const avtar = itemImageUrl+slug+"/"+avatars?.split(',')[0]

return(
  <View style={style.card}>
    <View style={style.cover}>
      <Image
        style={style.cardCover}
        resizeMode  = 'contain'
        source = {{ uri: !!avatars ? avtar : props.url}} />
    </View>
        <View style={style.badge}>
      
          {!!itemSubCategory ?
          <Badge 
              textStyle ={{
                color : '#001475',
                fontSize : 10
              }}
              badgeStyle={{
                paddingHorizontal : 5,
                backgroundColor : '#f2f5fa'
              }} 
              status='primary' 
              value={toTitleCase(itemSubCategory.subcategory)} 
              /> : 
              <Badge 
                status='success' 
                value={itemCategory.category}

                textStyle = {{
                  color : '#001475',
                  fontSize : 10
                }}

                badgeStyle={{
                  paddingHorizontal : 5,
                  backgroundColor : '#f2f5fa'
                }} 
               />}



          {!!itemSubCategory && !!itemSubCategory.unit && itemSubCategory.unit !=  "null" ?
          <Badge 
              textStyle ={{
                color : '#001475',
                fontSize : 10
              }}
              badgeStyle={{
                paddingHorizontal : 5,
                backgroundColor : '#f1f7ed'
              }} 
              status='primary' 
              value={toTitleCase(capacity+ itemSubCategory.unit)} 
              /> : ''}


        </View>
          <Text style={style.itemTitle} >
            {toTitleCase(name.substring(0,20)).trim()}
          </Text>
        <Text style={style.discount} >{Math.floor((discount/price)*100) +"% OFF"} </Text>
        <View style={{
            display : 'flex',
            justifyContent : 'flex-start',
            alignItems : 'flex-start',
            marginVertical : 5
          }}>
            <Rating type='custom' imageSize={15} readonly startingValue={rating} />
          </View>
        <View style={{display : 'flex', flexDirection : 'row',flexWrap : 'wrap'}}>
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
    paddingHorizontal : 0.2,
    paddingBottom : 5,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 0.1,

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
      fontSize : 12,
      fontWeight : 'bold',
      marginTop : 5
  },
  cover : {
    height: 120,
    flex  :1,
    borderRadius : 10
  },
  badge :  {
    display : 'flex',
    flexDirection : 'row',
    marginTop : 10,
    alignSelf : 'flex-start',
  },
  rating : {
    width : 10,
    padding : 100
    // height : 1
  }


})


export default ItemCard;