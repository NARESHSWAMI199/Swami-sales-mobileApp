import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { Avatar, Button, Input } from "react-native-elements"
import { TouchableOpacity } from "react-native"
import CommentRepliesView from "./CommentReplies"
import { bodyColor, commentUrl, defaultAvtar, themeColor, userImageUrl } from "../utils/utils"
import { Icon} from "@rneui/themed"
import CommentInputBox from "./CommentInputBox"
import { connect } from "react-redux"
import { ApplicationState } from "../redux"




const CommentView = (props:any) =>{


    const {
        itemId
    } = props
    const [comments,setComments] = useState<any>([])
    const [parent ,setParent] = useState<any>({})
    const [showRepliesModel,setShowRepliesModal] = useState(false)
    const [refresh,setRefresh] = useState(false)
    const commentRef = useRef(null);
    const [messagePrefix,setMessagePrefix] = useState('')

    const [token , setToken] = useState<string>()
    const [isAuthenticated , setIsAuthenticated] = useState<boolean>()
  
  
    useEffect(()=>{
      const getData =  async() =>{
         setToken(await props.token)
         setIsAuthenticated(!!(await props.token) ? true : false)
      }
      getData()
    },[props.token])




    useEffect(()=>{
        axios.defaults.headers['Authorization'] = token;
        axios.post(commentUrl+"all",{itemId : itemId})
        .then(res=>{
            setComments(res.data)
        })
        .catch(err => {
            console.log("Comment view  : "+err.message)
        })
    },[props.isCommentUpdate,token])


    const showReplies = (parent:any) =>{
        setParent(parent)
        setShowRepliesModal(true)
        setMessagePrefix('')
    }

    const closeModel = () =>{
        setShowRepliesModal(false)
        setMessagePrefix('')
    }


    const refreshCommentReplies = ()=>{
        setRefresh(refresh ? false  : true)
    }

    const handleReply = (parent:any)=> {
        setParent(parent)
        setShowRepliesModal(true)
        setMessagePrefix('')
        setTimeout (()=>{
            commentRef.current?.blur();
            commentRef.current?.focus();
        },100)
    };


    const handleLikes = async(commentId:number) =>{
        /** TODO : you can also redirect to login page */
        if(!isAuthenticated) return false
        axios.defaults.headers['Authorization'] = token;
        await axios.get(commentUrl+"like/"+commentId)
        .then(res=>{
            let response = res.data;
            setComments(previous => previous.filter((comment : any)=> {
                if(comment.id == commentId){
                    comment.likes += (!!response.likes) ? response.likes : 0;
                    comment.dislikes += (!!response.dislikes) ? response.dislikes : 0;
                    comment.isLiked = response.isLiked;
                    comment.isDisliked = response.isDisliked;
                }
                return comment;
            }))
        })
        .catch(err => {
            console.log("Comment like view  : "+err.message)
        })
    }


    const handleDislike = async (commentId:number) =>{
             if(!isAuthenticated) return false
             axios.defaults.headers['Authorization'] = token;
             await axios.get(commentUrl+"dislike/"+commentId)
             .then(res=>{
                 let response = res.data;
                 setComments(previous => previous.filter((comment : any)=> {
                     if(comment.id == commentId){
                        comment.likes += (!!response.likes) ? response.likes : 0;
                        comment.dislikes += (!!response.dislikes) ? response.dislikes : 0;
                        comment.isLiked = response.isLiked;
                        comment.isDisliked = response.isDisliked;
                     }
                     return comment;
                 }))
             })
             .catch(err => {
                 console.log("Comment dislike view  : "+err.message)
             })
    }


    const handleChildReply = (reply : any) =>{
        if(!!reply){
            commentRef.current?.blur();
            setTimeout (()=>{
                setMessagePrefix("@"+reply.user.username)
                commentRef.current?.focus();
            },100)
        }
    }


    const discardText = () => {
        setMessagePrefix('')
    }


    const updateMainComment = (comment : any) =>{
        setComments(previous => previous.filter((_comment : any)=> {
            if(comment.id == _comment.id){
              _comment.likes = comment.likes,
              _comment.dislikes = comment.dislikes
              _comment.isLiked = comment.isLiked,
              _comment.isDisliked = comment.isDisliked
            }
            return _comment
        }))
    }



    return (<><View>
        {comments.map((comment : any,index : number) => {
            return (
                <View key={index}  style={{
                    display : 'flex',
                    flexDirection : 'column'
                }}>
                <View style={style.messageBody}>
                    <View>
                        <Avatar size={25}  
                        rounded
                        source={{
                            uri : !!comment.user.avtar ? userImageUrl+comment.user.slug+"/"+comment.user.avtar : defaultAvtar
                        }} />
                    </View>
                    <View style={style.messageView}>
                        <View>
                        <Text style={{
                                fontSize : 10,
                            }}>
                                {"@"+comment?.user?.username?.toLowerCase()}
                        </Text>
                        <Text style={style.message}>
                            {comment.message}
                        </Text>
                        <View style={{...style.replyActions}}>
                            <View style={style.likesOrDislikeBody}>
                                <Pressable onPress={()=>{
                                    handleLikes(comment.id)
                                }}>
                                   
                                    <Icon 
                                        style={{...style.iconStyle,marginRight : 5}}
                                        name='thumbs-up'
                                        type='font-awesome'
                                        color={!comment.isLiked ? '#565757' : themeColor}
                                        size={20}
                                        
                                    /> 
                                </Pressable>
                                <Text style={{fontSize : 14 , fontWeight : 'bold',color : 'gray'}}>
                                    {!!comment.likes && comment.likes}
                                </Text>
                            </View>
                            <View style={style.likesOrDislikeBody}>
                                <Pressable onPress={()=>handleDislike(comment.id)}>
                                    <Icon
                                        style={{...style.iconStyle,marginRight : 5}}
                                        name='thumbs-down'
                                        type='font-awesome'
                                        color={!comment.isDisliked ? '#565757' : themeColor}
                                        size={20}
                                    />
                                </Pressable>
                                <Text style={{fontSize : 14 , fontWeight : 'bold',color : 'gray'}}>
                                        {!!comment.dislikes && comment.dislikes}
                                </Text>
                           </View>
                            <Pressable onPress={()=>handleReply(comment)}>
                                <Icon
                                    style={style.iconStyle}
                                    name='reply'
                                    type='font-awesome'
                                    color={'#565757'}
                                    size={20}
                                />
                            </Pressable>

                        <Pressable>
                            <Icon
                                style={{...style.iconStyle, marginLeft : 100}}
                                name='ellipsis-v'
                                type='font-awesome'
                                color={'#565757'}
                                size={20}
                            />
                         </Pressable>
                        </View>



                        <TouchableOpacity onPress={() =>showReplies(comment)}>
                            <Text style={style.totalReplies} >
                                Reply {comment.repliesCount}
                            </Text>
                        </TouchableOpacity>
                        </View>

                    </View>
                </View>
                </View>
            )
        } )}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showRepliesModel}
                    onRequestClose={() => {
                        setShowRepliesModal(false)
                    }}>
                    <View style={{
                            height: '50%',
                            marginTop: 'auto',
                        }}>
         
                        <View style={style.footer}>             
                            <View>
                                <Pressable style={style.goBack} onPress={closeModel}>
                                    <Icon 
                                        name="arrow-back" 
                                        type="material" 
                                        size={24} 
                                        color="black" 
                                        style={{fontWeight : 'bold'}} 
                                        />
                                    <Text style={{...style.subtitle,marginLeft : 10}}>
                                        Replies 
                                    </Text>
                                </Pressable>   
                            </View>
                            <View style={{flex : 1}}>
                                <CommentRepliesView 
                                    updateMainComment = {updateMainComment}
                                    handleChildReply={handleChildReply} 
                                    handleParentReply={handleReply}
                                    refresh={refresh} 
                                    parent={parent} 
                                    itemId={parent.itemId} 
                                />
                                <CommentInputBox 
                                    messagePrefix = {messagePrefix}
                                    parentId={parent.id}
                                    itemId={parent.itemId}
                                    commentRef={commentRef} 
                                    isCommentUpdated={refreshCommentReplies} 
                                    commentContainer={style.commentInputBody} 
                                    style={style.commentInput}
                                    onDiscardText={discardText}
                                    discardAlert={true}
                                /> 
           
                            </View>
                        </View>
                </View>
                </Modal>
            </View>
    </>
    )
}


const style = StyleSheet.create({
    messageBody : {
        display : 'flex',
        flexDirection : 'row',
        textAlign : 'center',
        minHeight : 80,
        paddingVertical : 10,
        shadowColor: "#000",
        paddingHorizontal : 10,
        width : '100%',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 1,
        backgroundColor : bodyColor
    },
    messageView :{
        alignSelf : 'center',
        paddingLeft : 5,
    },
    message : {
        fontSize : 14,
        fontWeight : 'bold',
        paddingRight : 40
    },
    totalReplies : {
        marginVertical : 10,
        fontSize : 12,
        fontWeight : 'bold',
        color : themeColor
    },
    footer: {
        flex : 1,
        backgroundColor: bodyColor,
        bottom : 0,
        left : 0,
        right : 0
      },
      subtitle : {
        marginVertical : 5,
        fontSize : 16,
        fontWeight : '700'
      },
      goBack : {
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'flex-start',
        alignItems : 'center',
        paddingHorizontal : 10,
        paddingVertical : 10
      },
      replyActions: {
        display :'flex',
        flexDirection : 'row',
        width : '70%',
        marginTop : 5,
    } , iconStyle : {
        display : 'flex',
        justifyContent:'center',
        alignItems : 'center',
        // marginTop : 6,
        marginRight : 30,
        paddingLeft : 5
    },
    commentInput : {
        fontSize:14,
        borderColor : 'gray',
        height : 50
    },
    commentInputBody : {
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : bodyColor,
        paddingHorizontal : 40,
        bottom : 0,
        position : 'absolute',
        left : 0,
        right : 0
      },
      likesOrDislikeBody : {
        display : 'flex',
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        marginRight : 25
      }
})


const mapToStateProps = (state:ApplicationState) =>{
    return {
        token : state.userReducer.user.token,
        isAuthenticated : !!state.userReducer.user.token ? true : false
    }
}

export default connect(mapToStateProps) (CommentView)