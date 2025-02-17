import axios from 'axios'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { Avatar } from 'react-native-elements'
import { Searchbar } from 'react-native-paper'
import { connect } from 'react-redux'
import StoreCard from '../components/StoreCard'
import { ApplicationState, Category, Store } from '../redux'
import { bodyColor, storeUrl } from '../utils/utils'
import { logError, logInfo } from '../utils/logger' // Import logger

// Component function
function Stores(props : any) {
  // State variables
  const [width,setWidth]= useState('32%')

  // Effect to set width based on props
  useEffect(()=>{
    if(!!props.width)
    setWidth(props.width)
    logInfo(`Width set to ${props.width}`)
  },[props.width])

  // Memoized styles
  const style = useMemo(()=>StyleSheet.create({
    body : {
      display : 'flex',
      paddingHorizontal : props.selfPadding ==false ? 0 : 5,
      flex : 1,
      backgroundColor : bodyColor
    },
    storeParent : {
      display : 'flex',
      flexDirection : 'row',
      flexWrap : 'wrap',
    },
    storeView : {
      width :width,
      backgroundColor : 'white',
      borderRadius : 10,
      marginHorizontal : 2
    },
    category : {
      display : 'flex',
      width : '100%',
      height : 100,
      backgroundColor : 'white'
    },
    categoryTitle : {
      fontSize : 12
    },
    categoryParent : {
      textAlign : 'center',
      width : 100,
      alignContent : 'center',
      justifyContent : 'center',
      alignItems : 'center',
      backgroundColor : 'white'
    },
    mainHeader : {
      height : 35,
      backgroundColor : bodyColor,
  }
  }),[width]) 

  // State variables for stores, search, categories, query, and spinner
  const [stores,setStores] = useState([])
  const [search,setSearch] = useState(false)
  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState("")
  const [showCategory, setShowCategory] = useState(true)
  const [loading, setLoading] = useState(true)
  const [data,setData] = useState({
      pageSize  : 51, 
      orderBy :'rating',
      categoryId : undefined,
      subcategoryId : undefined,
      zipCode: props.location?.postalCode // Add zipCode from props
    })

  // Effect to set showCategory based on props
  useEffect(()=>{
    if(props.showCategory == true || props.showCategory == false )
    setShowCategory(props.showCategory)
    logInfo(`ShowCategory set to ${props.showCategory}`)
  },[props.showCategory])

  // Effect to update data based on props
  useEffect(()=>{
  setData({
      ...data,
      subcategoryId : props.subcategoryId,
      categoryId : props.categoryId,
      pageSize : props.size,
      zipCode: props.location?.postalCode // Update zipCode from props
  })
  logInfo(`Data updated: ${JSON.stringify(data)}`)
  },[props.categoryId,props.size,props.subcategoryId, props.location?.postalCode])

  // Function to update search query
  const updateSearch =(search : any) => {
    setQuery(search)
    logInfo(`Search query updated: ${search}`)
  }

  // Effect to fetch stores based on data and search query
  useEffect(() => {
          logInfo(`Fetching stores with data: ${JSON.stringify(data)} and query: ${query}`)
          axios.post(storeUrl+"all",{...data,searchKey : query})
            .then(res => {
                let response = res.data.content;
                setStores(response)
                setLoading(false)
                logInfo(`Stores fetched successfully`)
            })
            .catch(err => {
                logError(`Error fetching stores: ${!!err.response?.data.message ? err.response.data.message : err.message}`)
                setLoading(false)
            })
    }, [search])

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
          logError(`Error fetching categories: ${!!err.response?.data.message ? err.response.data.message : err.message}`)
      })
    }, [])

  // Function to handle navigation to store detail
  const handleNavigation = (store : Store) => {
    logInfo(`Navigating to store detail: ${store.id}`)
    props.navigation.navigate('storeDetail',store);
  };

  // Render component
  return (<>
  <View style={style.mainHeader}></View>
 <ScrollView style={style.body}>
    {!!showCategory && 
    <>
        <View 
            style={{
                display : 'flex',
                flexDirection : 'row',
                marginTop : 5
            }}
        >
        <Searchbar
            placeholder="Search Stores"
            onChangeText={updateSearch}
            value={query}
            onClearIconPress={()=>{
                setQuery('')
                setSearch(search ? false : true)
                logInfo(`Search query cleared`)
            }}
            onSubmitEditing={() => setSearch(search ? false : true)}
            style={{
                backgroundColor:'white',
                 width : '100%'}}
            />
        </View>
 
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}   style={style.category} >
            {categories.map((category:Category, i)=> (
                <TouchableOpacity key={i} style={style.categoryParent}
                  onPress={(e)=> {
                    setData({
                      ...data,
                      categoryId : category.id
                    })
                    logInfo(`Category selected: ${category.id}`)
                  }}
                >
                    <Avatar  rounded
                        size={40}
                    source={{
                        uri:category.icon
                    }} />
                    <Text style={style.categoryTitle}>
                        {category.category}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
        </>
        }
        <View style={style.storeParent}>
          {loading ? (
            <ActivityIndicator size="large" color={bodyColor} />
          ) : (
            stores.map((store,i)=>{
              return <TouchableOpacity key={i} style={style.storeView} onPress={e=> handleNavigation(store)} >
                    <StoreCard store={store}/>
              </TouchableOpacity>
            })
          )}
          </View>
   </ScrollView>
   </>
  )
}

const mapStateToProps = (state: ApplicationState) => ({
    location: state.userReducer.location
})

export default connect(mapStateToProps)(Stores)