import * as Location from 'expo-location'
import React, { useEffect, useState } from 'react'
import { Alert, Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { connect, useDispatch } from 'react-redux'
import { ApplicationState, onUpdateLocation } from '../redux'
import { logError, logInfo } from '../utils/logger' // Import logger

const screenWidth = Dimensions.get('screen').width

const _LandingScreen = (props: any) => {
    // State variables
    const [errorMsg, setErrorMsg] = useState("")
    const [address, setAddress] = useState<Location.LocationGeocodedAddress>()
    const [displayAddress, setDisplayAddress] = useState("Waiting for current location.")
    const [showPermissionButton, setShowPermissionButton] = useState(false)
    const [ask, setAsk] = useState(true)
    const dispatch = useDispatch();

    // Effect to request location permissions and fetch location
    useEffect(() => {
        (async () => {
            try {
                var { status } = await Location.requestForegroundPermissionsAsync()
                logInfo(`Location permission status: ${status}`)
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location is not granted.')
                    Alert.alert(
                        "Insufficient permissions!",
                        "Sorry, we need location permissions to make this work! Make sure location is enable",
                        [{ text: "Okay" }]
                    );
                    dispatch(onUpdateLocation({ postalCode: 0 }));
                    props.navigation.navigate('tab')
                    return;
                }

                let location: any = await Location.getLastKnownPositionAsync()
                if (location != null) {
                    const { coords } = location
                    const { latitude, longitude } = coords;
                    logInfo(`Location coordinates: ${JSON.stringify(coords)}`)
                    let addressResponse: Location.LocationGeocodedAddress[] = await Location.reverseGeocodeAsync({ latitude, longitude })
                    dispatch(onUpdateLocation(addressResponse.length > 0 ? addressResponse[0] : null));
                    for (let item of addressResponse) {
                        let currentAddress = `${item.name},${item.street},${item.postalCode}, ${item.country}`
                        setDisplayAddress(currentAddress)
                        setAddress(addressResponse[0])
                        logInfo(`Current address: ${currentAddress}`)
                        if (currentAddress.length > 0) {
                            setTimeout(() => {
                                props.navigation.navigate('tab')
                            }, 100)
                        }
                        return;
                    }
                } else {
                    logError("Location not found, redirecting to home.")
                    props.navigation.navigate('tab')
                    setShowPermissionButton(true)
                }
            } catch (err) {
                logError(`Error fetching location: ${!!err.response?.data.message ? err.response.data.message : err.message}`)
            }
        })();
    }, [ask])

    // Render component
    return (<>
        <View style={style.container}>
            <View style={style.body}>
                <Image source={require('../images/location.png')} style={style.location_icon} />
                <View style={style.address_container}>
                    <Text> Your Current Address </Text>
                </View>
                <Text style={style.addressText}> Wating for current location. </Text>
            </View>
        </View>
    </>)
}

// Styles
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
        width: 120,
        height: 120
    },
    address_container: {
        width: screenWidth - 100,
        borderBottomColor: 'red',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        padding: 5
    },
    addressTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#7D7D7D'
    },
    addressText: {
        fontSize: 18,
        fontWeight: '200',
        color: '#4F4F4F',
        padding: 5
    },
    footer: {
        flex: 1,
    }
})

const mapToStateProps = (state: ApplicationState) => {
    return { userReducer: state.userReducer }
}

const mapDispatchToProps = {
    onUpdateLocation
}

let LandingScreen = connect(mapToStateProps, mapDispatchToProps)(_LandingScreen)
export { LandingScreen }
