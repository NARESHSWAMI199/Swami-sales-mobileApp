import axios from "axios"
import { useEffect, useState } from "react"
import { Modal, Pressable, StyleSheet, Text, View } from "react-native"
import { Avatar, Button } from "react-native-elements"
import { TouchableOpacity } from "react-native-gesture-handler"
import CommentRepliesView from "./CommentReplies"
import { bodyColor, commentUrl, userImageUrl } from "../utils/utils"
import { Icon, Input } from "@rneui/themed"




const CommentView = (props:any) =>{

    const [comments,setComments] = useState<any>([])
    const [parent ,setParent] = useState<any>({})
    const [showRepliesModel,setShowRepliesModal] = useState(false)
    
    useEffect(()=>{
        // TODO : Currently itemId is static need to dynamic
        axios.post(commentUrl+"all",{itemId : 74})
        .then(res=>{
            setComments(res.data)
        })
        .catch(err => {
            console.log("Comment view  : "+err.message)
        })
    },[])


    const showReplies = (parent:any) =>{
        setParent(parent)
        setShowRepliesModal(true)
    }

    const closeModel = () =>{
        setShowRepliesModal(false)
    }


    return (<View style={style.body}>
        {comments.map((comment : any,index : number) => {
            return (
                <View key={index}  style={{
                    display : 'flex',
                    flexDirection : 'column'
                }}>
                <View style={style.messageBody}>
                    <View>
                        <Avatar size={40}  
                        rounded
                        source={{
                            uri : userImageUrl+comment.user.slug+"/"+comment.user.avtar
                        }} />
                    </View>
                    <View style={style.messageView}>
                        <Text style={style.message}>
                            {comment.message}
                        </Text>
                        <TouchableOpacity onPress={() =>showReplies(comment)}>
                            <Text style={style.totalReplies} >
                                replies {comment.repliesCount}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showRepliesModel}
                    onRequestClose={() => {
                        setShowRepliesModal(false)
                    }}>
                    
                    <View
                        style={{
                            height: '50%',
                            marginTop: 'auto',
                        }}>
                        <View style={style.footer}>                  
                            <View>
                                <Pressable style={style.goBack} onPress={closeModel}>
                                    <Icon name="close" type="material" size={20} color="black" />
                                </Pressable>   
                            </View>
                            <View>
                                <CommentRepliesView parent={parent} itemId={74} />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
            )
        } )}
    </View>
    )
}


const style = StyleSheet.create({
    body : {
        marginBottom : 20,
        backgroundColor : 'green'
    },

    messageBody : {
        display : 'flex',
        flexDirection : 'row',
        textAlign : 'center',
        minHeight : 80,
        alignItems : 'center',
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
        backgroundColor : bodyColor,
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
        fontSize : 12,
        color : 'blue'
    },
    footer: {
        flex: 1,
        backgroundColor: bodyColor,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
      },
      textInput: {
        alignSelf: 'stretch',
        color: 'black',
        backgroundColor: '#ddd',
        borderTopWidth: 2,
        borderTopColor: '#ddd',
      },
      addButton: {
        position: 'absolute',
        zIndex: 11,
        right: 20,
        bottom: 90,
        backgroundColor: '#98B3B7',
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
      },
      addButtonText: {
        color: '#fff',
        fontSize: 18,
      },
      headerText: {
        color: 'black',
        fontSize: 18,
        padding: 26,
      },
      goBack : {
        display : 'flex',
        justifyContent : 'flex-end',
        alignItems : 'flex-end',
        paddingHorizontal : 10,
        paddingVertical : 10
      }
})


export default CommentView