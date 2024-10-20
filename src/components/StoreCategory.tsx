
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { Avatar } from 'react-native-elements';
import { itemImageUrl } from '../utils/utils';
import { useEffect } from 'react';
import { toTitleCase } from '../utils';

const style = StyleSheet.create({
    card : {
      width:'100%',
      shadowColor: "#000",
      shadowOffset: {
        width: 1,
        height: 2,
      },
      padding : 10,
      shadowOpacity: 0.25,
      shadowRadius: 4.84,
      borderRadius : 20,
      elevation: 5,
      backgroundColor : 'white',
      textAlign : 'center',
      alignItems : 'center',
      margin : 10,

    },
    cardCover : {
        width : 50,
        overflow: 'hidden',
        height : 50,
    },
    itemTitle : {
        fontSize : 12,
        fontWeight : 'bold',
        marginTop : 8,
    }
  
  
  })

const StoreCategoryCard = (props:any) => {
    const {
      icon,
      id,
      category
    } = props.category

return(
  <View style={style.card}>
      < Card.Cover 
        style={style.cardCover}
       resizeMode='cover' source = {{ uri: icon}} />
          <Text variant="titleLarge" style={style.itemTitle} >
            { toTitleCase(category)}
            </Text>
    </View>
);
} 


export default StoreCategoryCard;