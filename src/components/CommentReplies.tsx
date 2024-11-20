import axios from "axios"
import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { bodyColor, commentUrl, defaultAvtar, userImageUrl } from "../utils/utils"
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
    },[])

    
    useEffect(()=>{
        axios.post(commentUrl+"all",{itemId : itemId, parentId : parent.id})
        .then(res=>{
            setReplies(res.data)
        })
        .catch(err => {
            console.log("Comment view  : "+err.message)
        })
    },[props.refresh])



    return (<View style={style.body}>

            {/* Parent Comment */}
            <View style={{...style.replyMain,backgroundColor : '#f5fafa'}}>
                <View  style={{...style.replyBody}}>
                    <View>
                        <Avatar size={25}  
                        rounded
                        source={{
                            uri : !!parentComment?.user?.avtar ? userImageUrl+parentComment?.user?.slug+"/"+parentComment?.user?.avtar : defaultAvtar
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
        <ScrollView style={{marginBottom : 100}}>
        {replies.map((reply : any,index : number) => {
            return (
            <View key={index} style={style.replyMain}>
                <View style={{...style.replyBody,marginLeft : 30}}>
                    <View>
                        <Avatar size={25}  
                        rounded
                        source={{
                            uri : !!reply?.user?.avtar ?   userImageUrl+reply.user.slug+"/"+reply.user.avtar : defaultAvtar
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
                        <View style={style.likesBody}>
                                <Icon 
                                    style={{...style.iconStyle,marginRight : 5}}
                                    name='thumbs-up'
                                    type='font-awesome'
                                    color={'#565757'}
                                    size={20}
                                />
                                <Text style={{fontSize : 14 , fontWeight : 'bold',color : 'gray'}}>
                                    {reply.likes}
                                </Text>
                            </View>
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
        paddingHorizontal : 10,
        bottomPadding : 100
    },
    replyMain : {
        display : 'flex',
        flexDirection : 'column',
        textAlign : 'left',
        justifyContent : 'center',
        backgroundColor : bodyColor,
        minHeight : 70,
        paddingVertical : 10
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
        marginTop : 5
    } , iconStyle : {
        display : 'flex',
        justifyContent:'center',
        alignItems : 'center',
        marginRight : 30,
        paddingLeft : 5
    },
    likesBody : {
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        marginRight : 25,
      }
})


export default CommentRepliesView