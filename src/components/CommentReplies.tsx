import axios from "axios"
import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { bodyColor, commentUrl, userImageUrl } from "../utils/utils"
import { Avatar } from "react-native-elements"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
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



    return (<View style={style.body}>

            {/* Parent Comment */}
            <View style={{...style.replyMain,backgroundColor : '#f5fafa'}}>
                <View  style={{...style.replyBody}}>
                    <View>
                        <Avatar size={25}  
                        rounded
                        source={{
                            uri : userImageUrl+parentComment?.user?.slug+"/"+parentComment?.user?.avtar
                        }} />
                    </View>
                    <View style={style.messageView}>
                        {/* <View> */}
                            <Text style={{
                                fontSize : 10,
                            }}>
                                {"@ "+parentComment?.user?.username?.toLowerCase()}
                            </Text>
                            <Text style={style.message}>
                                {parentComment.message}
                            </Text>
                            
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
                        {/* </View> */}
                    </View>
                </View>
            </View>

        {/* All Replies */}
        <ScrollView>
        {replies.map((reply : any,index : number) => {
            return (
            <View key={index} style={style.replyMain}>
                <View style={{...style.replyBody,marginLeft : 30}}>
                    <View>
                        <Avatar size={25}  
                        rounded
                        source={{
                            uri : userImageUrl+reply.user.slug+"/"+reply.user.avtar
                        }} />
                    </View>
                    <View style={style.messageView}>
                        <Text style={{
                                fontSize : 10,
                            }}>
                                {"@"+reply?.user?.username?.toLowerCase()}
                        </Text>
                        <Text style={style.message}>
                            {reply.message}
                        </Text>

                        <View style={{...style.replyActions}}>
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
                </View>
            </View>
            )
        } )}        
        </ScrollView>
        </View>
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
        minHeight : 70,
        paddingVertical : 20
    },
    replyBody : {
        display : 'flex',
        flexDirection : 'row',
        textAlign : 'left',
    },
    messageView :{
        alignSelf : 'center',
        paddingLeft : 5
    },
    message : {
        fontSize : 14,
        fontWeight : 'bold',
    },
    totalReplies : {
        fontSize : 10,
        color : 'blue'
    },
    replyActions: {
        display :'flex',
        flexDirection : 'row',
        width : '70%',
    } , iconStyle : {
        display : 'flex',
        justifyContent:'center',
        alignItems : 'center',
        marginTop : 6,
        marginRight : 30,
        paddingLeft : 5

    }
})


export default CommentRepliesView