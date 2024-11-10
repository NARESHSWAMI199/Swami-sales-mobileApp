import axios from 'axios'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Avatar } from 'react-native-elements'
import { Searchbar } from 'react-native-paper'
import StoreCard from '../components/StoreCard'
import { Category, Store } from '../redux'
import { bodyColor, storeUrl } from '../utils/utils'
import Spinner from 'react-native-loading-spinner-overlay'





function Stores(props : any) {

  const [width,setWidth]= useState('32%')

  useEffect(()=>{
    if(!!props.width)
    setWidth(props.width)
  },[props.width])

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
    }
  
  }),[width]) 
  

  const [stores,setStores] = useState([])
  const [search,setSearch] = useState(false)

  const [categories, setCategories] = useState([])
  const [query, setQuery] = useState("")

  const [showCategory, setShowCategory] = useState(true)
  // TODO : change false to true if you want show spinners
  const [showSpinner,setShowSpinner] = useState(true)

  const [data,setData] = useState({
      pageSize  : 51, 
      orderBy :'rating',
      categoryId : undefined,
      subcategoryId : undefined
    })

  useEffect(()=>{
    if(props.showCategory == true || props.showCategory == false )
    setShowCategory(props.showCategory)
  },[props.showCategory])

  useEffect(()=>{
  setData({
      ...data,
      subcategoryId : props.subcategoryId,
      categoryId : props.categoryId,
      pageSize : props.size
  })
  },[props.categoryId,props.size,props.subcategoryId])


  const updateSearch =(search : any) => {
    setQuery(search)
  }

    useEffect(() => {
          axios.post(storeUrl+"all",{...data,searchKey : query})
            .then(res => {
                let response = res.data.content;
                setStores(response)
                console.log("store : " ,JSON.stringify(response[0]['name']), data.pageSize)
                setShowSpinner(false)
            })
            .catch(err => {
                console.log(err.message)
                setShowSpinner(false)
            })
    }, [data,search])


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

  return (<ScrollView style={style.body}>
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
                  onPress={(e)=> setData({
                    ...data,
                    categoryId : category.id
                  })
                  }
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
          <Spinner
            visible={showSpinner}
            textContent={'Loading...'}
            textStyle={{color : 'white'}}
          />
            {stores.map((store,i)=>{
              return <TouchableOpacity key={i} style={style.storeView} onPress={e=> handleNavigation(store)} >
                    <StoreCard store={store}/>
              </TouchableOpacity>
            })}
          </View>
   </ScrollView>
  )

}



export default Stores