import { Icon } from "@rneui/themed"
import axios from "axios"
import { useEffect, useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { Avatar } from "react-native-elements"
import { ScrollView } from "react-native-gesture-handler"
import { connect } from "react-redux"
import { ApplicationState } from "../redux"
import { bodyColor, commentUrl, defaultAvtar, themeColor, userImageUrl } from "../utils/utils"
import { logError, logInfo } from '../utils/logger' // Import logger

const CommentRepliesView = (props:any) =>{

    const {
        itemId,
        parent
    } = props

    // State variables
    const [replies,setReplies] = useState<any>([])
    const [parentComment,setParentComment] = useState<any>({})
    const [token , setToken] = useState<string>()
    const [isAuthenticated , setIsAuthenticated] = useState<boolean>()

    // Effect to get token from props
    useEffect(()=>{
        const getData =  async() =>{
            setToken(await props.token)
            setIsAuthenticated(!!(await props.token) ? true : false)
            logInfo(`Token and authentication state set`)
        }
        getData()
    },[props.token])

    // Effect to update main comment
    useEffect(()=>{
        props.updateMainComment(parentComment)
    },[parentComment])

    // Effect to fetch parent comment details
    useEffect(()=>{
        logInfo(`Fetching parent comment details for slug: ${parent.slug}`)
        axios.get(commentUrl+"detail/"+parent.slug)
        .then(res=>{
            setParentComment(res.data)
            logInfo(`Parent comment details fetched successfully`)
        })
        .catch(err => {
            logError(`Error fetching parent comment details: ${!!err.response?.data.message ? err.response.data.message : err.message}`)
        })
    },[token])

    // Effect to fetch replies
    useEffect(()=>{
        logInfo(`Fetching replies for itemId: ${itemId} and parentId: ${parent.id}`)
        axios.post(commentUrl+"all",{itemId : itemId, parentId : parent.id})
        .then(res=>{
            let response = res.data;
            setReplies(response.content)
            logInfo(`Replies fetched successfully`)
        })
        .catch(err => {
            logError(`Error fetching replies: ${err.message}`)
        })
    },[props.refresh,token])

    // Function to handle likes for replies
    const handleRepliesLikes = (propsComment:any,isReply:boolean) =>{
        if(!isAuthenticated) {
            return false
        }
        axios.get(commentUrl+"like/"+propsComment.id)
        .then(res=>{
            let response = res.data
            if(isReply){
                setReplies(previous => previous.filter((comment : any)=> {
                    if(propsComment.id == comment.id){
                        comment.likes +=(!!response.likes) ? response.likes : 0;
                        comment.dislikes +=(!!response.dislikes) ? response.dislikes : 0;
                        comment.isLiked =response.isLiked ;
                        comment.isDisliked = response.isDisliked;
                    }
                    return comment;
                }))
            }else {
                setParentComment(previous => ({
                    ...previous, 
                    dislikes : previous.dislikes +=(!!response.dislikes) ? response.dislikes : 0,
                    likes : previous.likes +=(!!response.likes) ? response.likes : 0,
                    isLiked : response.isLiked,
                    isDisliked : response.isDisliked
                }))
            }
            logInfo(`Likes updated for comment id: ${propsComment.id}`)
        })
        .catch(err => {
            logError(`Error updating likes: ${err.message}`)
        })
    }

    // Function to handle dislikes for replies
    const handleRepliesDisLikes = (propsComment:any,isReply:boolean) =>{
        /**TODO : show login alert here. */
        if(!isAuthenticated) {
            return false
        }
        axios.get(commentUrl+"dislike/"+propsComment.id)
        .then(res=>{
            let response = res.data
            if(isReply){
                setReplies(previous => previous.filter((comment : any)=> {
                    if(propsComment.id == comment.id){
                        comment.dislikes +=(!!response.dislikes) ? response.dislikes : 0;
                        comment.likes += (!!response.likes) ? response.likes : 0;
                        comment.isLiked =response.isLiked ;
                        comment.isDisliked = response.isDisliked;
                    }
                    return comment;
                }))
            }else {
                setParentComment(previous => ({
                    ...previous, 
                    dislikes : previous.dislikes +=(!!response.dislikes) ? response.dislikes : 0,
                    likes : previous.likes +=(!!response.likes) ? response.likes : 0,
                    isLiked : response.isLiked,
                    isDisliked : response.isDisliked
                }))
            }
            logInfo(`Dislikes updated for comment id: ${propsComment.id}`)
        })
        .catch(err => {
            logError(`Error updating dislikes: ${err.message}`)
        })
    }

    // Function to handle reply action
    const handleReply = (reply:any,isReply:boolean)=> {
        if(isReply){
            props.handleChildReply(reply)
        }else {
            props.handleParentReply(reply)
        }
        logInfo(`Reply action handled for comment id: ${reply.id}`)
    };

    // Function to highlight text
    const highlightText = (text:string) => {
        const regex = /@(\w+)/g;
        const parts = text?.split(regex);
      
        return (
          <Text style={style.message}>
            {parts?.map((part, index) => {
                if (index % 2 == 1)  {
                    return  <Text key={index} style={{color: themeColor}}>
                        {"@"+part}
                    </Text>
                }else {
                    return  <Text key={index}>
                    {part}
                </Text>
                }
            })}
          </Text>
        );
    }

    // Render component
    return (
        <View style={style.body}>
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
                        <Text style={{
                            fontSize : 10,
                        }}>
                            {"@ "+parentComment?.user?.username?.toLowerCase()}
                        </Text>
                        {highlightText(parentComment.message)}
                        <View style={style.replyActions}>
                            <View style={style.likesBody}>
                                <Pressable onPress={()=>{
                                    handleRepliesLikes(parentComment,false)
                                }}>
                                    <Icon 
                                        style={{...style.iconStyle,marginRight : 5}}
                                        name='thumbs-up'
                                        type='font-awesome'
                                        color={!parentComment.isLiked ? '#565757' : themeColor}
                                        size={20}
                                    /> 
                                </Pressable>
                                <Text style={{fontSize : 14 , fontWeight : 'bold',color : 'gray'}}>
                                    {!!parentComment.likes && parentComment.likes}
                                </Text>
                            </View>
                            <View style={style.likesBody}>
                                <Pressable onPress={()=>{
                                    handleRepliesDisLikes(parentComment,false)
                                }}>
                                    <Icon 
                                        style={{...style.iconStyle,marginRight : 5}}
                                        name='thumbs-down'
                                        type='font-awesome'
                                        color={!parentComment.isDisliked ? '#565757' : themeColor}
                                        size={20}
                                    /> 
                                </Pressable>
                                <Text style={{fontSize : 14 , fontWeight : 'bold',color : 'gray'}}>
                                    {!!parentComment.dislikes && parentComment.dislikes}
                                </Text>
                            </View>
                            <Pressable onPress={()=>handleReply(parentComment,false)}>
                                <Icon
                                    style={style.iconStyle}
                                    name='reply'
                                    type='font-awesome'
                                    size={20}
                                />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>

            {/* All Replies */}
            <ScrollView style={{marginBottom : 120}}>
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
                                    {highlightText(reply.message)}
                                    <View style={{...style.replyActions}}>
                                        <View style={style.likesBody}>
                                            <Pressable onPress={()=>{
                                                handleRepliesLikes(reply,true)
                                            }}>
                                                <Icon 
                                                    style={{...style.iconStyle,marginRight : 5}}
                                                    name='thumbs-up'
                                                    type='font-awesome'
                                                    color={!reply.isLiked ? '#565757' : themeColor}
                                                    size={20}
                                                /> 
                                            </Pressable>
                                            <Text style={{fontSize : 14 , fontWeight : 'bold',color : 'gray'}}>
                                                {!!reply.likes && reply.likes}
                                            </Text>
                                        </View>
                                        <View style={style.likesBody}>
                                            <Pressable onPress={()=>{
                                                handleRepliesDisLikes(reply,true)
                                            }}>
                                                <Icon 
                                                    style={{...style.iconStyle,marginRight : 5}}
                                                    name='thumbs-down'
                                                    type='font-awesome'
                                                    color={!reply.isDisliked ? '#565757' : themeColor}
                                                    size={20}
                                                /> 
                                            </Pressable>
                                            <Text style={{fontSize : 14 , fontWeight : 'bold',color : 'gray'}}>
                                                {!!reply.dislikes && reply.dislikes}
                                            </Text>
                                        </View>
                                        <Pressable onPress={()=>handleReply(reply,true)}>
                                            <Icon
                                                style={style.iconStyle}
                                                name='reply'
                                                type='font-awesome'
                                                color={'#565757'}
                                                size={20}
                                            />
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )
                })}        
            </ScrollView>
        </View>
    )
}

// Styles
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
        textAlign : 'left'
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

const mapToStateProps = (state:ApplicationState) =>{
    return {
        token : state.userReducer.token,
        isAuthenticated : !!state.userReducer.token ? true : false
    }
}

export default connect(mapToStateProps)(CommentRepliesView)