import axios from "axios"
import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { bodyColor, commentUrl, userImageUrl } from "../utils/utils"
import { Avatar } from "react-native-elements"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Icon } from "@rneui/themed"



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

            {/* Parent Comment */}
            <View style={{...style.replyMain,backgroundColor : '#f5fafa'}}>
                <View  style={{...style.replyBody}}>
                    <View>
                        <Avatar size={40}  
                        rounded
                        source={{
                            uri : userImageUrl+parentComment?.user?.slug+"/"+parentComment?.user?.avtar
                        }} />
                    </View>
                    <View style={style.messageView}>
                        <Text>
                            {"@ "+parentComment?.user?.username}
                        </Text>
                        <Text style={style.message}>
                            {parentComment.message}
                        </Text>
                    </View>
                </View>

                <View style={style.replyActions}>
                            <Icon 
                                style={style.iconStyle}
                                name='thumbs-up'
                                type='font-awesome'
                                size={20}
                            />
                            <Icon
                                style={style.iconStyle}
                                name='thumbs-down'
                                type='font-awesome'
                                size={20}
                            />
                            <Icon
                                style={style.iconStyle}
                                name='reply'
                                type='font-awesome'
                                size={20}
                            />
                        </View>
                </View>

        {/* All Replies */}
        {replies.map((reply : any,index : number) => {
            return (
            <View key={index} style={style.replyMain}>
                <View style={{...style.replyBody,marginLeft : 30}}>
                    <View>
                        <Avatar size={30}  
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


                <View style={{...style.replyActions,width : '80%'}}>
                    <Icon 
                        style={style.iconStyle}
                        name='thumbs-up'
                        type='font-awesome'
                        color={'#565757'}
                        size={20}
                    />
                    <Icon
                        style={style.iconStyle}
                        name='thumbs-down'
                        type='font-awesome'
                        color={'#565757'}
                        size={20}
                    />
                    <Icon
                        style={style.iconStyle}
                        name='reply'
                        type='font-awesome'
                        color={'#565757'}
                        size={20}
                    />
                </View>
            </View>
            )
        } )}        
        </View>
        </>
    )
}


const style = StyleSheet.create({
    body : {
        paddingHorizontal : 10

    },
    replyMain : {
        display : 'flex',
        flexDirection : 'column',
        textAlign : 'left',
        justifyContent : 'center',
        backgroundColor : bodyColor,
        minHeight : 80,
        marginVertical : 5
    },
    replyBody : {
        display : 'flex',
        flexDirection : 'row',
        alignItems : 'center',
        textAlign : 'left'
    },
    messageView :{
        alignSelf : 'center',
        paddingLeft : 5
    },
    message : {
        fontSize : 16,
        fontWeight : 'bold',
    },
    totalReplies : {
        fontSize : 10,
        color : 'blue'
    },
    replyActions: {
        display :'flex',
        flexDirection : 'row',
        justifyContent : 'center',
        flex :1,
        width : '70%',
    } , iconStyle : {
        display : 'flex',
        justifyContent:'center',
        alignItems : 'center',
        height : 30,
        width : 50,
    }
})


export default CommentRepliesView