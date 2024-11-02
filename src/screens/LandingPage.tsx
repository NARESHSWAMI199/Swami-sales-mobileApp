import * as Location from 'expo-location'
import React, { useEffect, useState } from 'react'
import { Alert, Dimensions, Image, StyleSheet, Text, View } from 'react-native'

import { connect } from 'react-redux'
import { ApplicationState, onUpdateLocation } from '../redux'
import { useFocusEffect } from '@react-navigation/native'


const screenWidth = Dimensions.get('screen').width

const _LandingScreen = (props : any) => {
    const [errorMsg,setErrorMsg] = useState("")
    const [address, setAddress] = useState<Location.LocationGeocodedAddress>()

    const [displayAddress, setDisplayAddress] = useState("Waiting for current location.")

    useFocusEffect (()=>{
        (async () =>{
            try {
            let {status} = await Location.requestForegroundPermissionsAsync()
            console.log("the status : " + status)
            if( status !== 'granted'){
                setErrorMsg('Permission to access location is not granted.')
                Alert.alert(
                    "Insufficient permissions!",
                    "Sorry, we need location permissions to make this work!",
                    [{ text: "Okay" }]
                );
            }

            let location: any = await Location.getLastKnownPositionAsync()
            const {coords} = location

            if (coords){
                const { latitude ,longitude} = coords;
                console.log("coords : ",coords)    
                let  addressResponse : any = await Location.reverseGeocodeAsync({latitude,longitude})
                
                for(let item of addressResponse){
                    let currentAddress = `${item.name},${item.street},${item.postalCode}, ${item.country}`
                    setDisplayAddress(currentAddress)
                    console.log("redirecting to home....")    
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
                // notify the use something went wrong with location.
            }
        }catch(err) {
            console.log(err)
        }
        })();
    })

    return (<>
            <View  style={style.container}>
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


const mapToStateProps = (state : ApplicationState) => {
    return {userReducer : state.userReducer}
}   


let LandingScreen  = connect(mapToStateProps, {onUpdateLocation})(_LandingScreen)
export { LandingScreen }
