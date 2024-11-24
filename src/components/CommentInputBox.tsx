import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Alert, Pressable, View } from 'react-native'
import { Avatar, Icon, Input } from 'react-native-elements'
import { connect } from 'react-redux'
import { ApplicationState } from '../redux'
import { commentUrl, defaultAvtar } from '../utils/utils'



function CommentInputBox(props:any) {

 const {
    itemId,
    parentId,
    commentRef,
    discardAlert,
  } = props

  const [message,setMessage] = useState<string>(undefined)
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
    setMessage((!!props.messagePrefix ? props.messagePrefix + "\n" + (!!message ? message : '') : message))
  },[props.messagePrefix])


  const handleComment = () => {
    if(!!message){
    axios.defaults.headers['Authorization'] = token
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
    setMessage(text)
  }


  const handleBlur = () =>{
    if (!!discardAlert && !!message && message?.trim() !== '') {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to discard them?',
        [
          {
            text: 'Keep Writing',
            style: 'cancel',
            onPress : () => {
              commentRef.current?.focus();
            }
          },
          {
            text: 'Discard',
            onPress: () => {
              setMessage('')
              props.onDiscardText()
            },
          },
        ]
      );
    }
  }


  return (<>
    {isAuthenticated && 
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
          onBlur={handleBlur}
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
  }
  </>
  )
}

const mapToStateProps = (state:ApplicationState) =>{
    return {
      token : state.userReducer.user.token,
  }
}

export default connect(mapToStateProps)(CommentInputBox)