import React, { useEffect, useState } from 'react'
import { StatusBar, StyleSheet, Text, View, ActivityIndicator, Pressable } from 'react-native'
import { Avatar, Badge, Icon } from 'react-native-elements'
import { bodyColor, dummyImageUrl, longToDate, ruppeCurrencyIcon, slipsUrl, themeColor } from '../utils/utils'
import { ApplicationState } from '../redux'
import { connect } from 'react-redux'
import axios from 'axios'
import { toTitleCase } from '../utils'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { logError, logInfo } from '../utils/logger' // Import logger

function Slips(props:any) {

  const {navigation} = props;

  // State variables
  const [token , setToken] = useState<string>()
  const [isAuthenticated , setIsAuthenticated] = useState<boolean>()
  const[totalElements,setTotalElements] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage,setItemPerPage] = useState(29)
  const [slips,setSlips] = useState([])
  // TODO : change false to true if you want show spinners
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


  // Effect to fetch slips
  useEffect(()=>{
    axios.defaults.headers['Authorization'] = token;
      const getData = ()=>{
        logInfo(`Fetching slips`)
        axios.post(slipsUrl+"all",{
          pageNumber : currentPage,
          pageSize: itemsPerPage
      })
      .then(res=>{
          let response = res.data;
          setSlips(response.content)
          setTotalElements(response.totalElements)
          setLoading(false)
          logInfo(`Slips fetched successfully`)
      })
      .catch(err => {
          logError(`Error fetching slips: ${err.message}`)
          setLoading(false)
      })
    }

    if(!!token) getData()

},[token])


// Function to handle navigation to slip items
const handleRedirect = (slipId:number)=>{
  logInfo(`Navigating to slip items: ${slipId}`)
  navigation.navigate('slipItems',{slipId : slipId})
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
              Slips
            </Text>
          </Pressable>
        </View>
        <View style={style.listHeader}>
          <Text style={style.listHeaderText}>Slip Name</Text>
          <Text style={style.listHeaderText}>Last Updated</Text>
          <Text style={style.listHeaderText}>Created At</Text>
        </View>
        {loading ? (
          <View style={style.spinnerContainer}>
            <ActivityIndicator size="large" color={themeColor} />
          </View>
        ) : (
          slips.map((slip, i) => (
            <TouchableOpacity key={i} style={style.list} onPress={() => handleRedirect(slip.id)} activeOpacity={1}>
              <View style={style.listItem}>
                <Text style={style.itemTitle}>{toTitleCase(slip.slipName)}</Text>
                <View style={style.itemTitle}>
                  <Badge 
                    status='success' 
                    value={!!slip.updatedAt ? longToDate(slip.updatedAt) : 0}
                    textStyle={{color: '#001475', fontSize: 10}}
                    badgeStyle={{paddingHorizontal: 5, backgroundColor: '#eff5e9'}} 
                  />
                </View>
                <View style={style.itemTitle}>
                  <Badge 
                    status='error' 
                    value={!!slip.createdAt ? longToDate(slip.createdAt) : 0}
                    textStyle={{color: '#001475', fontSize: 10}}
                    badgeStyle={{paddingHorizontal: 5, backgroundColor: '#f2f5fa'}} 
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
      {/* <View style={style.addSlip}>
        <Icon type="font-awesome" name='plus' size={20} color={"#054263"}/>
      </View> */}
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
    height: 65,
    width: '100%',
    marginVertical: 3
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderColor: 'gray',
    backgroundColor: bodyColor,
    flex: 1,
    marginHorizontal: 10,
    marginTop: 10, // Fix margin from top
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 14, // Increased font size
    marginHorizontal: 5,
    width: 100,
    textAlign: 'center'
  },
  itemBody: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowItem: {
    textAlign: 'center',
  },
  quantity: {
    width: 40
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: themeColor,
    borderRadius: 5,
    margin: 10,
  },
  goBackText: {
    color: 'white',
    marginLeft: 5,
  },

  // addSlip: {
  //   height: 50,
  //   width: 50,
  //   backgroundColor: bodyColor,
  //   position: 'absolute',
  //   borderRadius: 50,
  //   bottom: 30,
  //   right: 20,
  //   justifyContent: 'center',
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 3,
  //   },
  //   shadowOpacity: 0.27,
  //   shadowRadius: 4.65,
  //   elevation: 6,
  // }
})

const mapToStateProps = (state:ApplicationState) =>{
  return {
    token: state.userReducer.token,
  }
}

export default connect(mapToStateProps)(Slips)