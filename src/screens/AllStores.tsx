import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import StoreCard from '../components/StoreCard'
import { Item, Store } from '../redux'
import { storeUrl } from '../utils/utils'





function AllStores(props : any) {

  const [stores,setStores] = useState([])
  const [search,setSearch] = useState(false)

  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState("")



  const updateSearch = (search : any) => {
    setQuery(search);
  };

    useEffect(() => {
           axios.post(storeUrl+"all",{pageSize  : !!props.size ? props.size : 8, orderBy :'rating'})
              .then(res => {
                  let data = res.data.content;
                  setStores(data)
              })
              .catch(err => {
                  console.log(err.message)
              })
    }, [])


    useEffect(() => {
      axios.post(storeUrl+"categories",{orderBy : 'category'})
      .then(res => {
          let categories = res.data;
          setCategories(categories)
      })
      .catch(err => {
          console.log(err.message)
      })
    }, [])


  const handleNavigation = (store : Store) => {
    props.navigation.navigate('storeDetail',store);
  };

  return (<View style={styles.body}>
    <View style={styles.storeParent}>
        {stores.map((store : Store ,i)=>(
        <TouchableOpacity key={i} style={styles.storeView} onPress={e=> handleNavigation(store)} >
              <StoreCard store={store}/>
        </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}




const styles = StyleSheet.create({

    body : {
        display: 'flex',
        paddingHorizontal : 10,
        flex : 1
    },
    storeParent : {
      display : 'flex',
      flexDirection : 'row',
      flexWrap : 'wrap',
    },
    storeView : {
      width : '32%',
      backgroundColor : 'white',
      borderRadius : 10,
      marginHorizontal : 2
    }
  
  })
  



export default AllStores