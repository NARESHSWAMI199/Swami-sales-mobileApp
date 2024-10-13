
import { StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { Avatar } from 'react-native-elements';
import { itemImageUrl } from '../utils/utils';
import { useEffect } from 'react';
import { toTitleCase } from '../utils';

const style = StyleSheet.create({
    card : {
      width:'96%',
      padding : 2,
      margin:5,

    },
    titleStyle:{
      fontSize:18,
      fontWeight : 'bold'
    },
    price : {
      fontSize : 16,
      fontWeight :'bold',
      color : 'green',
      marginRight : 'auto'
    },
    cardCover : {
        width : '100%',
        height: 200,
        // margin : 1
    },
    itemTitle : {
        fontSize : 18,
        fontWeight : 'bold',
        marginTop : 3,
        paddingLeft :5,
        marginRight:'auto'
    }
  
  
  })

const LeftContent = (avtar : string) => <Avatar  rounded
    size={40}
  source={{
    uri:avtar
  }} />

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
  <Card style={style.card}>
  {/* <Card.Title titleStyle={style.titleStyle} title= "Swami sales" subtitle = "jaipur" left = {(e)=> LeftContent(avtar) } /> */}
    {/* <Card.Content> */}

      {/* < Text variant = "bodyMedium" > {description.substring(0,20)} </Text> */}
       
        < Card.Cover style={style.cardCover} source = {{ uri: !!avatar ? avtar : props.url}} />
            <Text variant="titleLarge" style={style.itemTitle} >{ toTitleCase(name.substring(0,15))}</Text>
            {/* </Card.Content> */}
          < Card.Actions >
          <Text style={style.price} > {price} </Text>
          < Button > Visit </Button>
          </Card.Actions>
          </Card>
);
} 


export default ItemCard;