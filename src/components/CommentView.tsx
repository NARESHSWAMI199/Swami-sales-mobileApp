import axios from "axios"
import { useEffect, useState } from "react"
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { Avatar, Button } from "react-native-elements"
import { TouchableOpacity } from "react-native-gesture-handler"
import CommentRepliesView from "./CommentReplies"
import { bodyColor, commentUrl, userImageUrl } from "../utils/utils"
import { Icon} from "@rneui/themed"




const CommentView = (props:any) =>{

    const [comments,setComments] = useState<any>([])
    const [parent ,setParent] = useState<any>({})
    const [showRepliesModel,setShowRepliesModal] = useState(false)
    
    useEffect(()=>{
        // TODO : Currently itemId is static need to dynamic
        axios.post(commentUrl+"all",{itemId : 1})
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
                    <View style={{
                            height: '50%',
                            marginTop: 'auto',
                        }}>
         
                        <View style={style.footer}>                  
                        <ScrollView>
                            <View>
                                <Pressable style={style.goBack} onPress={closeModel}>
                                    <Icon name="arrow-back" type="material" size={24} color="black" style={{fontWeight : 'bold'}} />
                                    <Text style={{...style.subtitle,marginLeft : 10}}>
                                        Replies 
                                    </Text>
                                </Pressable>   
                            </View>
                            <View>
                                <CommentRepliesView parent={parent} itemId={comment.itemId} />
                            </View>
                            </ScrollView>
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
      }
})


export default CommentView