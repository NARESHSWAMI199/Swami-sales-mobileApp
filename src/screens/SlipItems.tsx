import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Pressable, StatusBar, StyleSheet, Text, View } from 'react-native'
import { Avatar, Badge, Icon, Card, Rating } from 'react-native-elements'
import { connect } from 'react-redux'
import { ApplicationState } from '../redux'
import { bodyColor, dummyImageUrl, itemImageUrl, ruppeCurrencyIcon, slipsUrl, themeColor } from '../utils/utils'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { logError, logInfo } from '../utils/logger' // Import logger

function SlipItems(props:any) {

  const {route,navigation} = props;

  const {slipId} = route.params

  // State variables
  const [token , setToken] = useState<string>()
  const [isAuthenticated , setIsAuthenticated] = useState<boolean>()
  const[totalElements,setTotalElements] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage,setItemPerPage] = useState(29)
  const [orderItems,setOrderItems] = useState([])

  // Effect to get token from props
  useEffect(()=>{
    const getData =  async() =>{
       setToken(await props.token)
       setIsAuthenticated(!!(await props.token) ? true : false)
       logInfo(`Token and authentication state set`)
    }
    getData()
  },[props.token])

  // Effect to fetch order items based on slipId
  useEffect(()=>{
    axios.defaults.headers['Authorization'] = token;
    const getData = ()=>{
        logInfo(`Fetching order items for slipId: ${slipId}`)
        axios.post(slipsUrl+"detail/"+slipId,{
            pageNumber : currentPage,
            pageSize: itemsPerPage
        })
        .then(res=>{
            let response = res.data;
            setOrderItems(response.content)
            setTotalElements(response.totalElements)
            logInfo(`Order items fetched successfully`)
        })
        .catch(err => {
            logError(`Error fetching order items: ${err.message}`)
        })
    }
    if(!!token) getData()
    
  },[token,slipId])

  // Function to handle navigation to item detail
  const handleRedirect = (order : any)=>{
    logInfo(`Navigating to item detail: ${order.item.id}`)
    navigation.navigate('itemDetail', {
        ...order.item,
        quantity : order.quantity
    })
  }

  const handleBack = () => {
    navigation.goBack();
  }

  // Render component
  return (
    <>
      <StatusBar translucent backgroundColor={themeColor} barStyle="light-content" />
      <View style={style.body}>
        <View style={style.headerContainer}>
          <Pressable style={style.mainHeader} onPress={handleBack}>
            <Icon
              name="arrow-back"
              type="material"
              size={24}
              color="white"
              style={{ fontWeight: 'bold', marginHorizontal: 5 }}
            />
            <Text style={style.headerText}>
              Slip Items
            </Text>
          </Pressable>
        </View>
        {orderItems.length > 0 ? 
          orderItems.map((orderItem , index)=>{
            let order = orderItem.itemOrder;
            let totalPrice = (order.item.price * order.quantity).toLocaleString('en-US')
            let name = order.item?.name;
            name = name.substring(0,20) +((order.item?.name)?.length > 20 ? ".." : '')
            let discountPercentage = (( (order.item.price - order.item.discount) / order.item.price) * 100).toFixed(2);
            let actualPrice = order.item.price - order.item.discount;
            return (
              <Pressable key={index} style={style.list} onPress={()=>handleRedirect(order)}>
                <View style={style.card}>
                  <View style={style.listItem}>
                    <Avatar source={{uri : itemImageUrl+order.item.slug+"/"+(order.item.avatars.split(","))[0]}} size={60} rounded/>
                    <View style={style.itemDetails}>
                      <Text style={style.itemTitle}>{name}</Text>
                      <Rating imageSize={18} readonly startingValue={order.item.rating} style={style.rating} />
                      <Text style={style.price}>{order.item?.price.toLocaleString('en-US')+" "+ruppeCurrencyIcon}</Text>
                      <Text style={style.discount}>Discount: {discountPercentage}%</Text>
                      <Text style={style.quantity}>Quantity: {order.quantity}</Text>
                      <Text style={style.totalPrice}>Total: {actualPrice+" "+ruppeCurrencyIcon}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            )
          }) :
          <View style={style.noOrders}>
            <Text style={style.noOrdersText}>
              Currently no orders found
            </Text>
          </View>
        }
      </View>
    </>
  )
}

const style = StyleSheet.create({
  body: {
    height: '100%',
    backgroundColor: '#f8f9fa'
  },
  headerContainer: {
    backgroundColor: themeColor,
    paddingTop: 50, // Increased height
    paddingBottom: 20,
    paddingHorizontal: 10,
    elevation: 5,
    marginBottom: 10, // Fix margin from bottom
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: bodyColor,
    marginHorizontal: 10,
    marginTop: 10, // Fix margin from top
  },
  listHeaderText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000', // Dark text color
    width: 100,
    textAlign: 'center'
  },
  list: {
    width: '100%',
    marginVertical: 5
  },
  card: {
    borderRadius: 15, // Increased border radius for premium look
    padding: 15,
    marginHorizontal: 15, // Perfect margin from both x sides
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1, // Small shadow height
    },
    shadowOpacity: 0.22, // Small shadow opacity
    shadowRadius: 4.84, // Small shadow radius
    elevation: 2, // Small elevation
  
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDetails: {
    marginLeft: 10,
    flex: 1,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  rating: {
    alignSelf: 'flex-start',
    marginVertical: 5,
  },
  price: {
    fontSize: 14,
    color: 'green',
  },
  discount: {
    fontSize: 14,
    color: 'red',
  },
  quantity: {
    fontSize: 14,
    color: '#000',
  },
  totalPrice: {
    fontSize: 14,
    color: 'green',
    fontWeight: 'bold',
  },
  noOrders: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  noOrdersText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'gray'
  }
})

const mapToStateProps = (state:ApplicationState) =>{
  return {
    token: state.userReducer.token,
  }
}

export default connect(mapToStateProps)(SlipItems)