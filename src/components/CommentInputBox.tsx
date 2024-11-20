import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Avatar, Icon, Input } from 'react-native-elements'
import { commentUrl, defaultAvtar } from '../utils/utils'



function CommentInputBox(props:any) {

 const {
    itemId,
    parentId,
    commentRef
  } = props

  const [message,setMessage] = useState(undefined)

  // const [data,setData] = useState({
  //   message : '',
  //   itemId : itemId,
  //   parentId : parentId
  // })

  


  const handleComment = () => {
    axios.defaults.headers = {
      Authorization : 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwMGY3OGI4ZC1jYmY0LTQzZmItYTRkYy02ZTYzZGMwOGFjMDkiLCJleHAiOjE3MzIzNjc3MzcsImlhdCI6MTczMjEwODUzN30.mPZnkymYH5zVJr1jZfxktD2C1bzofLasJdM39_XyPQvZxYfjDDQXzoxmZcIky0MeOH9kD3b2p8JXWAptsVsYVA'
    }
    if(!!message){
    axios.post(commentUrl + "add",{
        message : message,
        itemId : itemId,
        parentId : parentId
      })
      .then(res => {
        console.log(res)
        props.isCommentUpdated(true)
        setMessage('')
      })
      .catch(err => {
        console.log("Comment : "+ err.message)
      })
    }
  }

  const handleMessage = (text:string) =>{
    // setData({...data,message : text})
    setMessage(text)
  }


  return (
  <View style={props.commentContainer}>
    <Avatar size={20}  
      rounded
      source={{
          uri : defaultAvtar
      }} />
        <Input
          ref={commentRef}
          onChangeText={(text)=>handleMessage(text)} 
          inputContainerStyle = {{ borderColor : 'white'}}
          placeholder='Write comment here..'
          style={{...props.style}}
          errorStyle= {{display : 'none'}}
          value={message}
      />

    <Pressable onPress={handleComment}>
      <Icon
          name='send'
          type='font-awesome'
          color={'#565757'}
          size={15}
      />
    </Pressable>
  </View>   
  
  )
}

export default CommentInputBox