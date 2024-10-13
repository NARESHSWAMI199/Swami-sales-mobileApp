
import { StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { Avatar } from 'react-native-elements';
import { itemImageUrl } from '../utils/utils';
import { useEffect } from 'react';

const style = StyleSheet.create({
    card : {
      width:'100%',
      padding : 6,
      margin:3
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
  
  
  })

const LeftContent = (props : any) => <Avatar  rounded
    size={40}
  source={{
    uri:props.url
  }} />

const ItemCard = (props:any) => {
    const {
        price,
        name,
        description,
        avatar,
        slug
    } = props.item

    useEffect(()=>{
        console.log(itemImageUrl+slug+"/"+avatar)
    },[props.item])

return(
  <Card style={style.card}>
  <Card.Title titleStyle={style.titleStyle} title= "Swami sales" subtitle = "jaipur" left = {(e)=> LeftContent(props) } />
    <Card.Content>
    <Text variant="titleLarge" style={{fontSize:16,fontWeight:'bold'}} >{name}</Text>
      < Text variant = "bodyMedium" > {description.substring(0,20)} </Text>
        </Card.Content>
        < Card.Cover source = {{ uri: props.avtar }} />
          < Card.Actions >
          <Text style={style.price} > {price} </Text>
          < Button > Visit </Button>
          </Card.Actions>
          </Card>
);
} 


export default ItemCard;