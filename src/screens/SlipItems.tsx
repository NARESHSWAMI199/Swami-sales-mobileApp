import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ImageBackground, StatusBar, StyleSheet, Text, View } from 'react-native'
import { Avatar, Badge } from 'react-native-elements'
import { connect } from 'react-redux'
import { ApplicationState } from '../redux'
import { bodyColor, dummyImageUrl, itemImageUrl, ruppeCurrencyIcon, slipsUrl } from '../utils/utils'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { logError, logInfo } from '../utils/logger' // Import logger

function Slips(props:any) {

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

  // Render component
  return (<>
  
  <ImageBackground
        source={require('../images/slipbg.png')}
        resizeMode = 'cover'
    >
    <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
    <View style={style.body}>
    {/* Don't remove this main header */}
      <View style={style.mainHeader}></View>

      <View  style={{...style.list}}>
        <View style={{...style.listItem,
          backgroundColor : '#054263',
            marginHorizontal : 8,
            marginVertical : 5,
            borderRadius : 20
          }}>
          <Text style={{
                ...style.itemTitle,
                ...style.rowItem,
                color : bodyColor,
                width : 105
            }}
          >
            Item Name
          </Text>
          <Text style={{
                ...style.price,
                ...style.rowItem,
                color : bodyColor,
            }}>
              Item Price
          </Text>
          <Text style={{
                ...style.quantity,
                ...style.rowItem,
                color : bodyColor,
                fontWeight : 'bold'
            }}>
            Quan.
          </Text>

          <Text style={{
            ...style.totalPrice,
            ...style.rowItem,
            color : bodyColor,
            }}>
            Total Price
          </Text>
        </View>
      </View>


    {orderItems.length > 0 ? 
        orderItems.map((orderItem , index)=>{
            let order = orderItem.itemOrder;
            let totalPrice = (order.item.price * order.quantity).toLocaleString('en-US')
            let name = order.item?.name;
            name = name.substring(0,20) +((order.item?.name)?.length > 20 ? ".." : '')
            return <TouchableOpacity key={index} style={style.list} onPress={()=>handleRedirect(order)}>
                <View style={{...style.listItem}}>
                    <View style={{...style.itemBody}}>
                        <Avatar source={{uri : itemImageUrl+order.item.slug+"/"+(order.item.avatars.split(","))[0]}} size={35} rounded/>
                        <Text style={style.itemTitle}>
                            {name}
                        </Text>
                    </View>

                    <View style={{...style.price,...style.rowItem}}>
                        <Badge 
                            status='success' 
                            value={order.item?.price.toLocaleString('en-US')+" "+ruppeCurrencyIcon}

                            textStyle ={{
                                color : '#001475',
                                fontSize : 10,
                                // fontWeight : 'bold'
                            }}

                            badgeStyle={{
                                paddingHorizontal : 5,
                                backgroundColor : '#ebf0f7'
                            }} 
                        />
                        </View>

                    <View style={{...style.quantity,...style.rowItem}}>
                        <Badge 
                            status='success' 
                            value={"x"+order.quantity}

                            textStyle = {{
                                color : '#001475',
                                fontSize : 10,
                                // fontWeight : 'bold'
                            }}

                            badgeStyle={{
                                backgroundColor : '#fceded'
                            }} 
                        />
                    </View>


                    <View style={{
                        ...style.totalPrice,
                        ...style.rowItem,
                        width : 100
                    }}>
                        <Badge 
                            status='success' 
                            value={totalPrice+" "+ruppeCurrencyIcon}
                            textStyle ={{
                                color : '#001475',
                                fontSize : 12,
                                fontWeight : 'bold'
                            }}

                            badgeStyle={{
                                paddingHorizontal : 5,
                                backgroundColor : '#eff5e9'
                            }} 
                        />
                    </View>
            </View>
        </TouchableOpacity>
         }) :
        <View style={{      
                display : 'flex',
                flexDirection : 'column',
                justifyContent : 'center',
                alignItems : 'center',
                flex : 1
            }}>
            <Text style={{
                    fontSize : 14,
                    fontWeight : 'bold',
                    color : 'gray'
                    }}>
                Currently no orders found
            </Text>
        </View>
    }
    </View>
    </ImageBackground>
    </> )
}

const style = StyleSheet.create({
  body: {
    height : '100%'
  },
  list : {
    height : 65,
    width : '100%',
    marginVertical : 3
  },
  mainHeader : {
    height : 80,
    backgroundColor : '#054263',
    borderRadius : 40
  },
  listItem : {
    display : 'flex',
    flexDirection : 'row',
    alignItems : 'center',
    paddingHorizontal : 15,
    borderColor : 'gray',
    backgroundColor : bodyColor,
    flex : 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 0.5
  },
  itemTitle : {
    fontWeight : 'bold',
    color : 'gray',
    marginStart : 10,
    fontSize : 12,
    width : 80,
  },
  price: {
    fontWeight : 'bold',
    color : 'green',
    width : 80,
    alignItems : 'flex-start',
  },
  itemBody : {
    display : 'flex',
    flexDirection : 'row',
    alignItems : 'center',
  },
  rowItem : {
    // textAlign : 'center',
    alignItems : 'flex-start',
    fontSize : 13
  },
  quantity : {
    width : 50,
    alignItems : 'flex-start'
  },
  totalPrice: {
    fontWeight : 'bold',
    color : 'green',
    width : 80,
    alignItems : 'flex-start'
  },
})


const mapToStateProps = (state:ApplicationState) =>{
    return {
        token : state.userReducer.token,
    }
}



export default connect(mapToStateProps)(Slips)