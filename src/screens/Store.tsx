import React, { useEffect, useState } from 'react'
import CustomCard from '../components/StoreCard'
import axios from 'axios'
import { ItemsUrl, storeUrl } from '../utils/utils'
import { ScrollView } from 'react-native-gesture-handler'
import { store } from '../redux'
import { StyleSheet, View } from 'react-native'
import StoreCard from '../components/StoreCard'
import CategoryTabs from '../components/Tabs'
import { Searchbar } from 'react-native-paper'





function Store() {

  const [stores,setStores] = useState([])
  const [search,setSearch] = useState(false)

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategories] = useState(-1)
  const [query, setQuery] = useState("")



  const updateSearch = (search : any) => {
    setQuery(search);
  };

    /** Get wholesale using user slug. */
    useEffect(() => {
      const getStores = async () => {
          await axios.post(storeUrl+"all",{})
              .then(res => {
                  let data = res.data.content;
                  setStores(data)
                  // console.log(data)
              })
              .catch(err => {
                  console.log(err.message)
              })
      }
      getStores()
  }, [])


    /** Get wholesale using user slug. */
    useEffect(() => {
      const getCategories = async () => {
          await axios.get(storeUrl+"categories")
              .then(res => {
                  let categories = res.data;
                  setCategories(categories)
              })
              .catch(err => {
                  console.log(err.message)
              })
      }
      getCategories()
  }, [])

  return (<View>
    <View style={styles.storeParent}>
        {stores.map((store : any ,i)=>(
          <View key={i} style={styles.storeView}>
              <StoreCard store={store}/>
          </View>
        ))}
      </View>
  </View>

 
       
    
  )
}


const styles = StyleSheet.create({
  storeParent : {
    display : 'flex',
    flexDirection : 'row',
    flexWrap : 'wrap',
    flex :1
  },
  storeView : {
    width : '30%',
    paddingHorizontal : 3,
    backgroundColor : 'white',
    marginVertical : 10,
    marginHorizontal : 4,
    borderRadius : 10
  }

})

export default Store