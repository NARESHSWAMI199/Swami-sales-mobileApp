import axios from "axios"
import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { commentUrl, userImageUrl } from "../utils/utils"
import { Avatar } from "react-native-elements"
import { TouchableOpacity } from "react-native-gesture-handler"



const CommentRepliesView = (props:any) =>{

    const {
        itemId,
        parentId
    } = props

    const [replies,setReplies] = useState<any>([])

    
    useEffect(()=>{
        // TODO : Currently itemId is static need to dynamic
        axios.post(commentUrl+"all",{itemId : 1, parentId : parentId})
        .then(res=>{
            setReplies(res.data)
        })
        .catch(err => {
            console.log("Comment view  : "+err.message)
        })
    },[itemId,parentId])



    return (
        <>
        {replies.map((reply : any,index : number) => {
            return (
            <View key={index} style={style.body}>
                <View style={style.messageBody}>
                    <View>
                        <Avatar size={40}  
                        rounded
                        source={{
                            uri : userImageUrl+reply.user.slug+"/"+reply.user.avtar
                        }} />
                    </View>
                    <View style={style.messageView}>
                        <Text style={style.message}>
                            {reply.message}
                        </Text>
                    </View>
                </View>
            </View>
            )
        } )}        
        </>
    )
}


const style = StyleSheet.create({
    body : {
        marginVertical : 5
    },
    main : {
        width : '100%',
        height : 70,
        background : 'white',
        borderWidth : 0.2
    },
    messageBody : {
        display : 'flex',
        flexDirection : 'row',
        flexWrap : 'wrap',
        alignItems : 'flex-start',
        textAlign : 'left'
    },
    messageView :{
        alignSelf : 'center',
        paddingLeft : 5
    },
    message : {
        fontSize : 12,
        fontWeight : 'bold',
    },
    totalReplies : {
        fontSize : 10,
        color : 'blue'
    }
})


export default CommentRepliesView