
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { toTitleCase } from '../utils';
import { Subcategory } from '../redux';
import { useEffect, useState } from 'react';

const SingleSubcategoryCard = (props:any) => {


const [subcategory,setSubcategory] = useState({
  subcategory : '',
  icon : 'sdf'
})

useEffect(()=>{
  setSubcategory(props.subcategory)
},[props.subcategory])



return(
  <View style={style.card} >
    <View style={style.cover}>
      <Image
        style={style.cardCover}
        resizeMode = 'contain'
        source = {{uri : subcategory.icon}} />
    </View>
          <Text style={style.itemTitle} >
            {toTitleCase(subcategory.subcategory)}
          </Text>
    </View>
);
} 


const style = StyleSheet.create({
  card : {
    display : 'flex',
    flexDirection : 'column',
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
      overflow : 'hidden',
      backgroundColor : '#d4defc',
      flex : 1
  },
  itemTitle : {
      fontSize : 14,
      fontWeight : 'bold',
      marginTop : 5,
      textAlign :'center'
  },
  cover : {
    height: 110,
    flex  :1,
    borderRadius : 10
  },
  badge :  {
    marginTop : 10,
    alignSelf : 'flex-start'
  }


})


export default SingleSubcategoryCard;