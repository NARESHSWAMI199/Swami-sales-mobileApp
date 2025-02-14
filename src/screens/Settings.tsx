import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { connect, useDispatch } from 'react-redux'
import { ApplicationState, onLogout } from '../redux'
import { bodyColor, themeColor } from '../utils/utils'
import { logError, logInfo } from '../utils/logger' // Import logger

function Settings(props: any) {

    const { navigation } = props
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>()
    const dispatch = useDispatch()

    // Effect to get token from props and set authentication state
    useEffect(() => {
        const getData = async () => {
            let token = await props.token
            setIsAuthenticated(!!token)
            logInfo(`Authentication state set: ${!!token}`)
        }
        getData()
    }, [props.token])

    // Function to handle navigation based on page name
    const handleRedirect = (pageName: string) => {
        if (pageName === 'login') {
            navigation.navigate('login')
            logInfo("Navigating to login")
        }
        else if (pageName === 'logout') {
            dispatch(onLogout())
            logInfo("Logout successful")
        }
        else if (pageName === 'slips') {
            navigation.navigate("slips")
            logInfo("Navigating to slips")
        }
        else if (pageName === 'edit-profile') {
            navigation.navigate('editProfile')
            logInfo("Navigating to edit profile")
        }
        else if (pageName === 'register') {
            navigation.navigate('signUp')
            logInfo("Navigating to sign up")
        }
        else {
            // navtigate to about page
            logInfo("Navigating to about")
        }
    }

    // Function to handle back navigation
    const handleBack = () => {
        navigation.goBack();
        logInfo("Navigating back")
    }

    // Render component
    return (
        <>
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
                            Settings
                        </Text>
                    </Pressable>
                </View>

                <View>
                    {!isAuthenticated &&
                        <TouchableOpacity onPress={() => handleRedirect('login')} >
                            <View style={style.listItem}>
                                <View style={style.iconTab}>
                                    <Icon
                                        type='font-awesome'
                                        name='sign-in'
                                        color='gray'
                                        size={20}
                                        style={style.iconTab}
                                    />
                                </View>
                                <Text style={style.label}>
                                    Sign In
                                </Text>
                            </View>
                        </TouchableOpacity>
                    }
                </View>

                {!isAuthenticated &&
                    <View>
                        <TouchableOpacity onPress={() => handleRedirect('register')}>
                            <View style={style.listItem}>
                                <View style={style.iconTab}>
                                    <Icon
                                        type='font-awesome'
                                        name='user'
                                        color='gray'
                                        size={20}
                                        style={style.iconTab}
                                    />
                                </View>
                                <Text style={style.label}>
                                    Sign Up
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }

                {isAuthenticated &&
                    <View>
                        <TouchableOpacity onPress={() => handleRedirect('edit-profile')}>
                            <View style={style.listItem}>
                                <View style={style.iconTab}>
                                    <Icon
                                        type='font-awesome'
                                        name='user'
                                        color='gray'
                                        size={20}
                                        style={style.iconTab}
                                    />
                                </View>
                                <Text style={style.label}>
                                    Edit Profile
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }

                {/* showing slips */}

                {isAuthenticated &&
                <View>
                    <TouchableOpacity onPress={() => handleRedirect('slips')}>
                        <View style={style.listItem}>
                            <View style={style.iconTab}>
                                <Icon
                                    type='font-awesome'
                                    name='print'
                                    color='gray'
                                    size={20}
                                    style={style.iconTab}
                                />
                            </View>
                            <Text style={style.label}>
                                Slips
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            }
                <View>
                    <TouchableOpacity>
                        <View style={style.listItem}>
                            <View style={style.iconTab}>
                                <Icon
                                    type='font-awesome'
                                    name='info'
                                    color='gray'
                                    size={25}
                                    style={style.iconTab}
                                />
                            </View>
                            <Text style={style.label}>
                                About
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View>
                    {isAuthenticated &&
                        <TouchableOpacity onPress={() => handleRedirect('logout')}>
                            <View style={style.listItem}>
                                <View style={style.iconTab}>
                                    <Icon
                                        type='font-awesome'
                                        name='sign-out'
                                        color='gray'
                                        size={20}
                                        style={style.iconTab}
                                    />
                                </View>
                                <Text style={style.label}>
                                    Sign Out
                                </Text>
                            </View>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </>
    )
}

const style = StyleSheet.create({
    body: {
        backgroundColor: bodyColor,
        height: '100%',
    },
    headerContainer: {
        backgroundColor: themeColor,
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 10,
        elevation: 5,
    },
    mainHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 10,
    },
    listItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        borderColor: 'gray',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 0.1,
    },
    label: {
        fontSize: 16,
        fontWeight: '500'
    },
    iconTab: {
        width: 40,
        marginHorizontal: 5
    }
})

const mapToStateProps = (state: ApplicationState) => {
    return {
        token: state.userReducer.token
    }
}

export default connect(mapToStateProps)(Settings)