import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { connect, useDispatch } from 'react-redux'
import { ApplicationState, onLogout } from '../redux'
import { bodyColor } from '../utils/utils'

function Settings(props:any) {

    const {navigation} = props
    const [isAuthenticated,setIsAuthenticated]  = useState<boolean>()
    const dispatch = useDispatch()

    useEffect(()=>{
        const getData = async () => {
            let token = await props.token
            setIsAuthenticated(!!token)
        }
        getData()
    },[props.token])

    const handleRedirect = (pageName:string) =>{
        if(pageName ==='login'){
            navigation.navigate('login')
        }
        else if(pageName === 'logout'){
            dispatch(onLogout())
        }
        else if (pageName === 'slips'){

        }
        else if (pageName === 'edit-profile'){
            navigation.navigate('editProfile')
        }
        else if (pageName === 'register'){
            navigation.navigate('signUp')
        }
        else {
            /** redirect to about */
        }
    }


  return (
    <>
    <View style={style.body}>
    <View style={style.mainHeader}>
        <Text style={style.headerText}>
            Settings
        </Text>
      </View>
        <View>
            {isAuthenticated  ? 
            <TouchableOpacity onPress={()=> handleRedirect('logout')}>
                  <View style={style.listItem}>
                    <View style={style.iconTab}>
                        <Icon 
                            type='font-awesome' 
                            name='sign-out' color='gray'
                            size={20}
                            style={style.iconTab}
                        />
                    </View>
                    <Text style={style.label}>
                        Sign Out
                    </Text>
                </View>
            </TouchableOpacity> : 
            <TouchableOpacity onPress={()=> handleRedirect('login')} >
                <View style={style.listItem}>
                <View style={style.iconTab}>
                    <Icon 
                        type='font-awesome' 
                        name='sign-in' color='gray'
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
            <TouchableOpacity onPress={()=> handleRedirect('register')}>
                  <View style={style.listItem}>
                    <View style={style.iconTab}>
                        <Icon 
                            type='font-awesome' 
                            name='user' color='gray'
                            size={20}
                            style={style.iconTab}
                        />
                    </View>
                    <Text style={style.label}>
                        Sing Up
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    }      

        {isAuthenticated &&
        <View>
            <TouchableOpacity onPress={()=> handleRedirect('edit-profile')}>
                  <View style={style.listItem}>
                    <View style={style.iconTab}>
                        <Icon 
                            type='font-awesome' 
                            name='user' color='gray'
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

        <View>
            <TouchableOpacity onPress={()=> handleRedirect('slips')}>
                  <View style={style.listItem}>
                    <View style={style.iconTab}>
                        <Icon 
                            type='font-awesome' 
                            name='print' color='gray'
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


        <View>
        <TouchableOpacity>
                  <View style={style.listItem}>
                    <View style={style.iconTab}>
                        <Icon 
                            type='font-awesome' 
                            name='info' color='gray'
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
            {/* Logout */}
        </View>

    </View></>
  )
}


const style = StyleSheet.create({

    body : {
        backgroundColor : bodyColor,
        height : '100%',
    },

    listItem : {
        display : 'flex',
        flexDirection : 'row',
        alignItems : 'center',
        paddingVertical : 20,
        borderColor : 'gray',
        // borderWidth : 0.2,

        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 0.1,
    
    },
    label : {
        fontSize : 16,
        fontWeight : '500'
    },
    iconTab : {
        width : 40,
        marginHorizontal : 5
    },
    mainHeader : {
        height : 80,
        marginBottom : 10,
        backgroundColor : bodyColor,
        paddingHorizontal : 10,
        justifyContent : 'flex-end',
    },
    headerText : {
        fontSize : 18,
        fontWeight : 'bold'
    }
})

const mapToStateProps = (state:ApplicationState) =>{
    return {
        token : state.userReducer.token
    }
}

export default  connect(mapToStateProps)(Settings)