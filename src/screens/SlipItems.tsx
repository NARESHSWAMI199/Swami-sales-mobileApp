import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Pressable, StatusBar, StyleSheet, Text, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native'
import { Avatar, Icon, Rating } from 'react-native-elements'
import { connect } from 'react-redux'
import { ApplicationState } from '../redux'
import { bodyColor, itemImageUrl, ruppeCurrencyIcon, slipsUrl, themeColor, storeUrl } from '../utils/utils'
import { logError, logInfo } from '../utils/logger' // Import logger
import { ScrollView } from 'react-native-gesture-handler'

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
  const [loading, setLoading] = useState(true)

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
    const getData = async()=>{
        logInfo(`Fetching order items for slipId: ${slipId}`)
        axios.post(slipsUrl+"detail/"+slipId,{
            pageNumber : currentPage,
            pageSize: itemsPerPage
        })
        .then(async(res)=>{
            let response = res.data;
            let responseContent = response.content;
            logInfo(`Fetching store details for order items`);
            const updatedOrderItems = await Promise.all(responseContent.map(async (orderItem:any) => {
              const order = orderItem.itemOrder;
              if(!order?.item) return orderItem;
              try {
                const res = await axios.get(`${storeUrl}-detail/${order.item?.wholesaleId}`);
                order.item.storeName = res.data.storeName;
                logInfo(`Store details fetched successfully for storeId: ${order.item?.wholesaleId} and Store name: ${JSON.stringify(res.data.storeName)}`);
              } catch (err) {
                logError(`Error fetching store details: ${!!err.response?.data.message ? err.response.data.message : err.message}`);
              }
              return orderItem;
            }));
            setOrderItems(updatedOrderItems);
            setTotalElements(response.totalElements)
            logInfo(`Order items fetched successfully`)
            setLoading(false);
        })
        .catch(err => {
            logError(`Error fetching order items: ${err.message}`)
            setLoading(false);
        })
    }
    if(!!token) getData()
    
  },[token,slipId])

  // Function to handle navigation to item detail
  const handleRedirect = (order : any)=>{
    logInfo(`Navigating to item detail: ${order.item?.id}`)
    navigation.navigate('itemDetail', {
        ...order.item,
        quantity : order.quantity
    })
  }

  // Function to handle item removal
  const handleRemoveOrder = (orderItemId: number) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          onPress: () => {
            axios.post(slipsUrl + "remove-order", { id: orderItemId })
              .then(res => {
                logInfo(`Item removed successfully`);
                setOrderItems(orderItems.filter(orderItem => orderItem.id !== orderItemId));
              })
              .catch(err => {
                console.log(err)
                logError(`Error removing item: ${!!err.response?.data.message ? err.response.data.message : err.message}`);
              })
          },
          style: "destructive"
        }
      ]
    );
  }

  const handleBack = () => {
    navigation.goBack();
  }

  if (loading) {
    return (
      <View style={style.spinnerContainer}>
        <ActivityIndicator size="large" color={themeColor} />
      </View>
    );
  }

  // Render component
  return (
    <>
      <StatusBar translucent backgroundColor={themeColor} barStyle="light-content" />
      <ScrollView style={style.body}>
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
            if(!order?.item) return null;
            let actualPrice = order.item?.price - order.item?.discount;
            let totalPrice = (actualPrice * order.quantity).toLocaleString('en-US')
            let name = order.item?.name;
            name = name.substring(0,20) +((order.item?.name)?.length > 20 ? ".." : '')

            let discountPercentage = (( (order.item?.discount) / order.item?.price) * 100).toFixed(2);
            let savedPrice = (order.item?.discount * order.quantity).toLocaleString('en-US');
            return (
              <Pressable key={index} style={style.list} onPress={()=>handleRedirect(order)}>
                <View style={style.card}>
                  <View style={style.listItem}>
                    <Avatar source={{uri : itemImageUrl+order.item?.slug+"/"+(order.item?.avatars.split(","))[0]}} size={60} rounded/>
                    <View style={style.itemDetails}>
                      <Text style={style.itemTitle}>{order.item?.name}</Text>
                      <Rating imageSize={18} readonly startingValue={order.item?.rating} style={style.rating} />
                      <Text style={style.price}>{actualPrice.toLocaleString('en-US')+" "+ruppeCurrencyIcon}</Text>
                      <Text style={style.discount}>Discount: {discountPercentage}%</Text>
                      <Text style={style.quantity}>Quantity: {order.quantity}</Text>
                      {order.item?.discount > 0 && (
                        <Text style={style.savedPrice}>Saved: {savedPrice+" "+ruppeCurrencyIcon}</Text>
                      )}
                      <Text style={style.totalPrice}>Total: {totalPrice+" "+ruppeCurrencyIcon}</Text>
                      <Text style={style.storeName}>Store: {order.item?.storeName}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleRemoveOrder(orderItem.id)} style={style.deleteButton}>
                      <Icon name="delete" type="material" size={24} color="red" />
                    </TouchableOpacity>
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
      </ScrollView>
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
    fontSize: 14,
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
    color: '#FF6347'
  },
  quantity: {
    fontSize: 14,
    color: '#000',
  },
  totalPrice: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  savedPrice: {
    fontSize: 14,
    color: '#0D6900',
    fontWeight: 'bold',
  },
  storeName: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  deleteButton: {
    marginLeft: 'auto',
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
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

const mapToStateProps = (state:ApplicationState) =>{
  return {
    token: state.userReducer.token,
  }
}

export default connect(mapToStateProps)(SlipItems)