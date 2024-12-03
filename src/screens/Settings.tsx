import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon, ListItem } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { List } from 'react-native-paper'

function Settings() {
  return (
    <View>

        <View>
            {/* Edit profile */}
            <TouchableOpacity>
                  <View style={style.listItem}>
                    <View style={style.iconTab}>
                        <Icon 
                            type='font-awesome' 
                            name='' color='gray'
                            size={20}
                        />
                    </View>
                    <Text>
                        Edit Profile
                    </Text>
                </View>
            </TouchableOpacity>
        </View>


        <View>
            {/* About */}
        </View>


        <View>
            {/* Logout */}
        </View>

    </View>
  )
}


const style = StyleSheet.create({
    listItem : {
        display : 'flex',
        flexDirection : 'row'
    },
    iconTab : {
        
    }
})


export default Settings