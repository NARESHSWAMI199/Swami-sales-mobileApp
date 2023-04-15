import React , {useState, useReducer, useEffect } from 'react'
import { StyleSheet, View, Button, Text, Dimensions,Image, Alert } from 'react-native'
import  * as Location from 'expo-location'
import { useNavigation } from '../utils'

// import {}


const screenWidth = Dimensions.get('screen').width

export const LandingScreen = () => {
    const { navigate } = useNavigation()

    const [errorMsg,setErrorMsg] = useState("")
    const [address, setAddress] = useState<Location.LocationGeocodedAddress>()

    const [displayAddress, setDisplayAddress] = useState("Waiting for current location.")

    

    useEffect (()=>{
        (async () =>{
            let {status} = await Location.requestPermissionsAsync()
            console.log("the statusw : " + status)
            if( status !== 'granted'){
                setErrorMsg('Permission to access location is not granted.')
                Alert.alert(
                    "Insufficient permissions!",
                    "Sorry, we need location permissions to make this work!",
                    [{ text: "Okay" }]
                );
            }



            let location : any = await Location.getCurrentPositionAsync({})
            const {coords} = location

            if (coords){
                const { latitude ,longitude} = coords;

                let  addressResponse : any = await Location.reverseGeocodeAsync({latitude,longitude})
                
                for(let item of addressResponse){
                    let currentAddress = `${item.name},${item.street},${item.postalCode}, ${item.country}`
                    setDisplayAddress(currentAddress)

                    if (currentAddress.length > 0){
                        setTimeout(()=>{
                            navigate('homeStack')
                        },1000)
                    }
                    return;
                }
            }
            else{
               
                // notify the use something went wrong with location.
            }
        })();
    },[])

    return (
        <>
            <View style={style.container}>
                <View style={style.body}>
                    <Image source={require('../images/location.png')} style={style.location_icon} />
                    <View style={style.address_container}>
                        <Text> Your Current Address </Text>
                    </View>

                    <Text style={style.addressText}> Waiting for current location. </Text>
                </View>

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

