import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import StoreCard from '../components/StoreCard'
import { Store } from '../redux'
import { storeUrl } from '../utils/utils'
import { logError, logInfo } from '../utils/logger' // Import logger

// Component function
function AllStores(props : any) {
  // State variables
  const [stores,setStores] = useState([])
  const [search,setSearch] = useState(false)
  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState("")

  // Function to update search query
  const updateSearch = (search : any) => {
    setQuery(search);
    logInfo(`Search query updated: ${search}`)
  };

  // Effect to fetch stores
  useEffect(() => {
    logInfo(`Fetching stores`)
    axios.post(storeUrl+"all",{pageSize  : !!props.size ? props.size : 8, orderBy :'rating'})
      .then(res => {
        let data = res.data.content;
        setStores(data)
        logInfo(`Stores fetched successfully`)
      })
      .catch(err => {
        logError(`Error fetching stores: ${err.message}`)
      })
  }, [])

  // Effect to fetch categories
  useEffect(() => {
    logInfo(`Fetching categories`)
    axios.post(storeUrl+"categories",{orderBy : 'category'})
      .then(res => {
        let categories = res.data;
        setCategories(categories)
        logInfo(`Categories fetched successfully`)
      })
      .catch(err => {
        logError(`Error fetching categories: ${err.message}`)
      })
  }, [])

  // Function to handle navigation to store detail
  const handleNavigation = (store : Store) => {
    logInfo(`Navigating to store detail: ${store.id}`)
    props.navigation.navigate('storeDetail',store);
  };

  // Render component
  return (<View style={styles.body}>
    <View style={styles.storeParent}>
      {stores.map((store : Store ,i)=>(
        <TouchableOpacity key={i} style={styles.storeView} onPress={e=> handleNavigation(store)} >
          <StoreCard store={store}/>
        </TouchableOpacity>
      ))}
    </View>
  </View>)
}

// Styles
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