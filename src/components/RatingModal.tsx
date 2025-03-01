import React, { useEffect, useState } from 'react'
import { Alert, Modal, Pressable, StyleSheet, View } from 'react-native';
import { Rating, Text } from 'react-native-elements';

const RatingModal = (props:any) => {
const [modalVisible, setModalVisible] = useState(false);
const [rating,setRating] = useState(3)

useEffect(()=>{
    setModalVisible(props.modalVisible)
},[props.modalVisible])


  return (
    <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
            props.setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Rating 
              showRating onFinishRating={setRating} 
              />
              <View>
                {/* submit button */}
                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {
                        setModalVisible(!modalVisible)
                        props.setModalVisible(!modalVisible);
                        props.handleRatingSubmit(rating)
                    }}
                    >
                    <Text style={styles.textStyle}>Submit</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 10,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
      marginTop : 20
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  });


export default RatingModal