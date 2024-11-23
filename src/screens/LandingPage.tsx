import * as Location from 'expo-location'
import React, { useEffect, useState } from 'react'
import { Alert, Dimensions, Image, StyleSheet, Text, View } from 'react-native'

import { connect, useDispatch } from 'react-redux'
import { ApplicationState, onUpdateLocation } from '../redux'


const screenWidth = Dimensions.get('screen').width

const _LandingScreen = (props : any) => {
    
    const [errorMsg,setErrorMsg] = useState("")
    const [address, setAddress] = useState<Location.LocationGeocodedAddress>()

    const [displayAddress, setDisplayAddress] = useState("Waiting for current location.")
    const [showPermissionButton, setShowPermissionButton] = useState(false)
    const [ask ,setAsk] = useState(true)
    const dispatch = useDispatch();

    useEffect (()=>{
        (async () =>{
            try {
            var {status} =  await Location.requestForegroundPermissionsAsync()
            console.log("the status : " + status)
            if( status !== 'granted'){
                setErrorMsg('Permission to access location is not granted.')
                Alert.alert(
                    "Insufficient permissions!",
                    "Sorry, we need location permissions to make this work! Make sure location is enable",
                    [{ text: "Okay" }]
                );
                var {status} =  await Location.requestForegroundPermissionsAsync()
            }

            let location: any = await Location.getLastKnownPositionAsync()
            //if(location == null) location = await Location.getCurrentPositionAsync()
            if (location !=null){
                const {coords} = location
                const { latitude ,longitude} = coords;
                console.log("coords : ",coords)    
                let  addressResponse : any = await Location.reverseGeocodeAsync({latitude,longitude})
                
                for(let item of addressResponse){
                    let currentAddress = `${item.name},${item.street},${item.postalCode}, ${item.country}`
                    setDisplayAddress(currentAddress)
                    console.log("redirecting to home....")  
                    setAddress(addressResponse)
                    /** dispatch the action for reducer */ 
                    dispatch(onUpdateLocation(addressResponse));
                    if (currentAddress.length > 0){
                        setTimeout(()=>{
                            props.navigation.navigate('tab')
                        },100) 
                    }
                    return;
                }
            }
            else{
                console.log("notify the use something went wrong with location.")    
                props.navigation.navigate('tab')
                setShowPermissionButton(true)
            }
        }catch(err) {
            console.log(err)
        }
        })();
    },[ask])

    return (<>
            <View  style={style.container}>
                <View style={style.body}>
                    <Image source={require('../images/location.png')} style={style.location_icon} />
                    <View style={style.address_container}>
                        <Text> Your Current Address </Text>
                    </View>
                    <Text style={style.addressText}> Waiting for current location. </Text>
                </View>
                {/* {showPermissionButton ? 
                    <Button buttonStyle={{
                        backgroundColor : themeColor,
                        height : 45,
                        marginVertical : 20,
                        marginHorizontal : 50,
                        borderRadius : 20
                    }}
                     onPress={()=>setAsk(ask ? false : true)}><Text style={{color : 'white'}}>Allow Loctaion</Text></Button>
                 : ''} */}
            </View>

        </>
    )
}


const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(242,242,2422,1)'
    },
    navigation: {
        flex: 2,
    },
    body: {
        flex: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    location_icon: {
        width : 120,
        height : 120
    },
    address_container : {
        width  : screenWidth-100,
        borderBottomColor  : 'red',
        alignItems :'center',
        borderBottomWidth : 0.5,
        padding : 5

    },
    addressTitle : {
        fontSize : 24,
        fontWeight : '700',
        color : '#7D7D7D'
    },
    addressText: {
        fontSize: 18,
        fontWeight: '200',
        color: '#4F4F4F',
        padding : 5
    },
    footer: {
        flex: 1,
    }
  
})


const mapToStateProps = (state : ApplicationState) => {
    return {userReducer : state.userReducer}
}   


let LandingScreen  = connect(mapToStateProps)(_LandingScreen)
export { LandingScreen }
