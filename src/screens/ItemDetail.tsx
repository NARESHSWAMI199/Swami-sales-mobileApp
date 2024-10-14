import React from 'react'
import { ScrollView, StyleSheet, View,Image } from 'react-native'
import { dummyImageUrl } from '../utils/utils'

const ItemDetail = () => {

  const styles = StyleSheet.create({
    imageParent : {
      width : '100%',
      height : 320
    },
    image : {
      width : '100%',
      height : 320
    }
  })

  return (<>
  
  <ScrollView>

    <View style={styles.imageParent}>

      <Image style={styles.image} source={{uri : dummyImageUrl}} />

    </View>


  </ScrollView>
  
  </>
  )
}

export default ItemDetail