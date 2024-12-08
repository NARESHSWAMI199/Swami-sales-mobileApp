import React from 'react'
import { ImageBackground, StatusBar, StyleSheet, Text, View } from 'react-native'
import { Avatar, Icon } from 'react-native-elements'
import { bodyColor, dummyImageUrl, ruppeCurrencyIcon } from '../utils/utils'

function Slips() {
  return (<>
  
  <ImageBackground
        source={require('../images/bg1.png')}
        resizeMode = 'cover'
    >
    <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
    <View style={style.body}>

      <View style={style.mainHeader}></View>

      <View style={style.list}>
        <View style={{...style.listItem}}>
            <View style={{...style.itemBody,...style.rowItem}}>
                <Avatar source={{uri : dummyImageUrl}} size={35} rounded/>
                <Text style={style.itemTitle}>
                    Item name
                </Text>
            </View>
            <Text style={{...style.price,...style.rowItem}}>
                {"100 "+ruppeCurrencyIcon}
            </Text>
            <Text style={{...style.quantity,...style.rowItem}}>
                {5}
            </Text>
            <Text style={{...style.price, ...style.rowItem}}>
                {"500 "+ruppeCurrencyIcon}
            </Text>
        </View>
      </View>


      <View style={style.list}>
        <View style={{...style.listItem}}>
            <View style={{...style.itemBody,...style.rowItem}}>
                <Avatar source={{uri : dummyImageUrl}} size={35} rounded/>
                <Text style={style.itemTitle}>
                    Item name
                </Text>
            </View>
            <Text style={{...style.price,...style.rowItem}}>
                {"100 "+ruppeCurrencyIcon}
            </Text>
            <Text style={{...style.quantity,...style.rowItem}}>
                {5}
            </Text>
            <Text style={{...style.price, ...style.rowItem}}>
                {"500 "+ruppeCurrencyIcon}
            </Text>
        </View>
      </View>


      <View style={style.list}>
        <View style={{...style.listItem}}>
            <View style={{...style.itemBody,...style.rowItem}}>
                <Avatar source={{uri : dummyImageUrl}} size={35} rounded/>
                <Text style={style.itemTitle}>
                    Item name
                </Text>
            </View>
            <Text style={{...style.price,...style.rowItem}}>
                {"100 "+ruppeCurrencyIcon}
            </Text>
            <Text style={{...style.quantity,...style.rowItem}}>
                {5}
            </Text>
            <Text style={{...style.price, ...style.rowItem}}>
                {"500 "+ruppeCurrencyIcon}
            </Text>
        </View>
      </View>



      <View style={style.list}>
        <View style={{...style.listItem}}>
            <View style={{...style.itemBody,...style.rowItem}}>
                <Avatar source={{uri : dummyImageUrl}} size={35} rounded/>
                <Text style={style.itemTitle}>
                    Item name
                </Text>
            </View>
            <Text style={{...style.price,...style.rowItem}}>
                {"100 "+ruppeCurrencyIcon}
            </Text>
            <Text style={{...style.quantity,...style.rowItem}}>
                {5}
            </Text>
            <Text style={{...style.price, ...style.rowItem}}>
                {"500 "+ruppeCurrencyIcon}
            </Text>
        </View>
      </View>

    </View>
    </ImageBackground>
    </> )
}

const style = StyleSheet.create({
  body: {
    height : '100%'
  },
  list : {
    height : 60,
    width : '100%'
  },
  mainHeader : {
    height : 90
  },
  listItem : {
    display : 'flex',
    flexDirection : 'row',
    alignItems : 'center',
    paddingHorizontal : 10,
    borderColor : 'gray',
    backgroundColor : bodyColor,
    flex : 1,
    width : '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 0.1

  },
  itemTitle : {
    fontWeight : 'bold',
    fontSize : 14,
    color : 'gray',
    marginHorizontal : 5,
  },
  price: {
    fontWeight : 'bold',
    color : 'green',
    width : 100
  },
  itemBody : {
    display : 'flex',
    flexDirection : 'row',
    alignItems : 'center',
  },
  rowItem : {
    textAlign : 'center',
  },quantity : {
    width : 40
  }
})

export default Slips