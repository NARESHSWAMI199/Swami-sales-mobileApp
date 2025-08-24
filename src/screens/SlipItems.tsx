import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Pressable, StatusBar, StyleSheet, Text, View, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native'
import { Avatar, Button, Icon, Rating } from 'react-native-elements'
import { connect } from 'react-redux'
import { ApplicationState } from '../redux'
import { bodyColor, itemImageUrl, ruppeCurrencyIcon, slipsUrl, themeColor, storeUrl, itemsUrl, backgroundThemeColor } from '../utils/utils'
import { logError, logInfo } from '../utils/logger' 
import { ScrollView } from 'react-native-gesture-handler'
import RatingModal from '../components/RatingModal'

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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState()

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

  const handleRatingSubmit = (rating:Number) => {
    axios.post(itemsUrl + `update/ratings`,
      {
        itemId : selectedItem,
        rating : rating
      })
      .then(res => {
        Alert.alert("Thanks you", "Your feedback has been saved successfully.")
        let response = res.data;
        logInfo(response.message)
      }).catch(err=>{
        logError(`Error during update item ratings: ${!!err.response ? err.response.data?.message : err.message}`)
      })
  }

  const handleBack = () => {
    navigation.goBack();
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
        {
        loading ?
          <View style={style.spinnerContainer}>
            <ActivityIndicator size="large" color={themeColor} />
          </View> :
        orderItems.length > 0 ? 
          orderItems.map((orderItem , index)=>{
            let order = orderItem.itemOrder;
            if(!order?.item) return null;
            let actualPrice = order.item?.price;
            let totalPrice = ((actualPrice - order.item?.discount) * order.quantity).toLocaleString('en-US')
            let name = order.item?.name;
            name = name.substring(0,20) +((order.item?.name)?.length > 20 ? ".." : '')

            let discountPercentage = (( (order.item?.discount) / order.item?.price) * 100).toFixed(2);
            let savedPrice = (order.item?.discount * order.quantity).toLocaleString('en-US');
            return (
              <View style={style.cardContainer} key={index}>
                <Pressable style={style.card} onPress={()=>handleRedirect(order)}>
                  <Image
                    source={{uri : itemImageUrl+order.item?.slug+"/"+(order.item?.avatars.split(","))[0]}}
                    style={style.itemImage}
                  />
                  <View style={style.itemDetails}>
                    <Text style={style.itemTitle}>{order.item?.name}</Text>
                    <View style={style.detailContainer}>
                      <Text style={style.label}>Store Name:</Text>
                      <View style={style.storeContainer}>
                        <Icon name="store" type="material" size={16} color="#000" />
                        <Text style={style.storeName}>{order.item?.storeName}</Text>
                      </View>
                    </View>
                    <View style={style.detailContainer}>
                      <Text style={style.label}>Price:</Text>
                      <View style={style.priceContainer}>
                        <Text style={style.price}>{(actualPrice - order.item?.discount) +" "+ruppeCurrencyIcon}</Text>
                        <Text style={style.mutedPrice}>{actualPrice.toLocaleString('en-US')+" "+ruppeCurrencyIcon}</Text>
                      </View>
                    </View>
                    <View style={style.detailContainer}>
                      <Text style={style.label}>Discount:</Text>
                      <Text style={style.discount}>{discountPercentage}% off</Text>
                    </View>
                    <View style={style.detailContainer}>
                      <Text style={style.label}>Quantity:</Text>
                      <Text style={style.quantity}>{order.quantity}</Text>
                    </View>
                    {order.item?.discount > 0 && (
                      <View style={style.detailContainer}>
                        <Text style={style.label}>Saved:</Text>
                        <Text style={style.savedPrice}>{savedPrice+" "+ruppeCurrencyIcon}</Text>
                      </View>
                    )}
                    <View style={style.detailContainer}>
                      <Text style={style.label}>Total Price:</Text>
                      <Text style={style.totalPrice}>{totalPrice+" "+ruppeCurrencyIcon}</Text>
                    </View>
                  </View>
                </Pressable>
                <View style={style.cardActions}>
                  <TouchableOpacity onPress={() => handleRemoveOrder(orderItem.id)} style={style.deleteButton}>
                    <Icon name="delete" type="material" size={24} color="red" />
                    <Text style={style.deleteText}>Remove</Text>
                  </TouchableOpacity>
                  <Pressable style={style.ratingButton} onPress={()=> {
                     navigation.navigate('addItemReview', { item: order.item });
                    }}>
                    <Text style={{color : 'blue', fontWeight : 'bold'}}>
                      Add a Review
                    </Text>
                  </Pressable>
                </View>
              </View>
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
    backgroundColor: backgroundThemeColor
  },
  headerContainer: {
    backgroundColor: themeColor,
    paddingTop: 50, 
    paddingBottom: 20,
    paddingHorizontal: 10,
    elevation: 5,
    marginBottom: 10, 
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
  cardContainer: {
    marginVertical: 2,
    marginHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    // elevation: 2,
  },
  card: {
    padding: 15,
  },
  itemImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  itemDetails: {
    marginTop: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 100,
  },
  storeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeName: {
    fontSize: 16,
    marginLeft: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mutedPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginLeft: 10,
  },
  discount: {
    fontSize: 14,
    color: 'green',
  },
  quantity: {
    fontSize: 16,
  },
  savedPrice: {
    fontSize: 14,
    color: 'green',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 16,
    color: 'red',
    marginLeft: 5,
  },
  ratingButton: {
    padding: 5,
  },
  noOrders: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noOrdersText: {
    fontSize: 16,
    color: 'gray',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const mapToStateProps = (state:ApplicationState) =>{
  return {
    token: state.userReducer.token,
  }
}

export default connect(mapToStateProps)(SlipItems)