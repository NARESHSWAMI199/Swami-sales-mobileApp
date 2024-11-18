import axios from "axios"
import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { bodyColor, commentUrl, userImageUrl } from "../utils/utils"
import { Avatar } from "react-native-elements"
import { TouchableOpacity } from "react-native-gesture-handler"



const CommentRepliesView = (props:any) =>{

    const {
        itemId,
        parent
    } = props

    const [replies,setReplies] = useState<any>([])
    const [parentComment,setParentComment] = useState<any>({})

       
    useEffect(()=>{
        axios.get(commentUrl+"detail/"+parent.slug)
        .then(res=>{
            setParentComment(res.data)
        })
        .catch(err => {
            console.log("Comment detail view  : "+err.message)
        })
    },[parent])

    
    useEffect(()=>{
        axios.post(commentUrl+"all",{itemId : itemId, parentId : parent.id})
        .then(res=>{
            setReplies(res.data)
        })
        .catch(err => {
            console.log("Comment view  : "+err.message)
        })
    },[itemId,parent.id])



    return (
        <>
            <View style={style.body}>
                <View style={style.messageBody}>
                    <View>
                        <Avatar size={40}  
                        rounded
                        source={{
                            uri : userImageUrl+parentComment?.user?.slug+"/"+parentComment?.user?.avtar
                        }} />
                    </View>
                    <View style={style.messageView}>
                        <Text style={style.message}>
                            {parentComment.message}
                        </Text>
                    </View>
                </View>
            </View>

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
        height : 80,
        background : 'white',
        borderWidth : 0.2
    },
    messageBody : {
        display : 'flex',
        flexDirection : 'row',
        alignItems : 'center',
        textAlign : 'left',
        backgroundColor : bodyColor,
        paddingHorizontal : 10,
        height : 70,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 1,

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