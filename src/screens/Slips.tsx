import React, { useEffect, useState } from 'react'
import { StatusBar, StyleSheet, Text, View, ActivityIndicator, Pressable, Modal, TextInput, Alert } from 'react-native'
import { Avatar, Badge, Icon } from 'react-native-elements'
import { backgroundThemeColor, bodyColor, dummyImageUrl, longToDate, ruppeCurrencyIcon, slipsUrl, themeColor } from '../utils/utils'
import { ApplicationState } from '../redux'
import { connect } from 'react-redux'
import axios from 'axios'
import { toTitleCase } from '../utils'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { logError, logInfo } from '../utils/logger' // Import logger

function Slips(props:any) {

  const {navigation} = props;

  // State variables
  const [token , setToken] = useState<string>()
  const [isAuthenticated , setIsAuthenticated] = useState<boolean>()
  const[totalElements,setTotalElements] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage,setItemPerPage] = useState(29)
  const [slips,setSlips] = useState([])
  // TODO : change false to true if you want show spinners
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newSlipName, setNewSlipName] = useState('');
  const [editSlipName, setEditSlipName] = useState('');
  const [editSlipId, setEditSlipId] = useState(null);

  // Effect to get token from props
  useEffect(()=>{
    const getData =  async() =>{
       setToken(await props.token)
       setIsAuthenticated(!!(await props.token) ? true : false)
       logInfo(`Token and authentication state set`)
    }
    getData()
  },[props.token])


  // Effect to fetch slips
  useEffect(()=>{
      const getData = ()=>{
        logInfo(`Fetching slips`)
        axios.post(slipsUrl+"all",{
          pageNumber : currentPage,
          pageSize: itemsPerPage
      })
      .then(res=>{
          let response = res.data;
          setSlips(response.content)
          setTotalElements(response.totalElements)
          setLoading(false)
          logInfo(`Slips fetched successfully`)
      })
      .catch(err => {
          logError(`Error fetching slips: ${err.message}`)
          setLoading(false)
      })
    }

    if(!!token) getData()

},[token])


// Function to handle navigation to slip items
const handleRedirect = (slipId:number)=>{
  logInfo(`Navigating to slip items: ${slipId}`)
  navigation.navigate('slipItems',{slipId : slipId})
}

const handleBack = () => {
  navigation.goBack();
}

const handleAddSlip = () => {
  if (newSlipName.trim() === '') {
    Alert.alert('Error', 'Slip name cannot be empty');
    return;
  }

  axios.post(slipsUrl + "add", { name: newSlipName })
    .then(res => {
      setSlips([res.data.res,...slips]);
      setModalVisible(false);
      setNewSlipName('');
      logInfo(`Slip added successfully`);
    })
    .catch(err => {
      logError(`Error adding slip: ${err.message}`);
      Alert.alert('Error', 'Failed to add slip');
    });
}

const handleDeleteSlip = (slipId: number) => {
  Alert.alert(
    'Confirm Delete',
    'Are you sure you want to delete this slip?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          axios.post(`${slipsUrl}delete`, { id: slipId })
            .then(() => {
              setSlips(slips.filter(slip => slip.id !== slipId));
              logInfo(`Slip deleted successfully`);
            })
            .catch(err => {
              logError(`Error deleting slip: ${err.message}`);
              Alert.alert('Error', 'Failed to delete slip');
            });
        },
        style: 'destructive',
      },
    ],
    { cancelable: true }
  );
}

const handleEditSlip = () => {
  if (editSlipName.trim() === '') {
    Alert.alert('Error', 'Slip name cannot be empty');
    return;
  }

  axios.post(`${slipsUrl}update`, { id: editSlipId, name: editSlipName })
    .then(() => {
      setSlips(slips.map(slip => slip.id === editSlipId ? { ...slip, slipName: editSlipName, updatedAt: new Date().getTime() } : slip));
      setEditModalVisible(false);
      setEditSlipName('');
      logInfo(`Slip updated successfully`);
    })
    .catch(err => {
      logError(`Error updating slip: ${err.message}`);
      Alert.alert('Error', 'Failed to update slip');
    });
}

const openEditModal = (slip) => {
  setEditSlipId(slip.id);
  setEditSlipName(slip.slipName);
  setEditModalVisible(true);
}

  // Render component
  return (
    <>
      <StatusBar translucent backgroundColor={themeColor} barStyle="light-content" />
      <ScrollView style={style.body}>
        <View style={style.headerContainer}>
          <Pressable style={style.mainHeader} onPress={handleBack}>
            <Icon
              name="arrow-back"
              type="material"
              size={24}
              color="white"
              style={{ fontWeight: 'bold', marginHorizontal: 5 }}
            />
            <Text style={style.headerText}>
              Slips
            </Text>
          </Pressable>
        </View>
        <View style={style.listHeader}>
          <Text style={style.listHeaderText}>Slip Name</Text>
          <Text style={style.listHeaderText}>Last Updated</Text>
          <Text style={style.listHeaderText}>Created At</Text>
          <Text style={style.listHeaderText}>Actions</Text>
        </View>
        {loading ? (
          <View style={style.spinnerContainer}>
            <ActivityIndicator size="large" color={themeColor} />
          </View>
        ) : (
          slips.map((slip, i) => (
            <Pressable key={i} style={style.list} onPress={() => handleRedirect(slip.id)}>
              <View style={style.listItem}>
                <Text style={style.itemTitle}>{toTitleCase(slip.slipName)}</Text>
                <View style={style.itemTitle}>
                  <Badge 
                    status='success' 
                    value={!!slip.updatedAt ? longToDate(slip.updatedAt) : 0}
                    textStyle={{color: '#001475', fontSize: 10}}
                    badgeStyle={{paddingHorizontal: 5, backgroundColor: '#eff5e9'}} 
                  />
                </View>
                <View style={style.itemTitle}>
                  <Badge 
                    status='error' 
                    value={!!slip.createdAt ? longToDate(slip.createdAt) : 0}
                    textStyle={{color: '#001475', fontSize: 10}}
                    badgeStyle={{paddingHorizontal: 5, backgroundColor: '#f2f5fa'}} 
                  />
                </View>
                <View style={style.actions}>
                  <Icon
                    name="edit"
                    type="material"
                    size={20}
                    color="blue"
                    onPress={() => openEditModal(slip)}
                  />
                  <Icon
                    name="delete"
                    type="material"
                    size={20}
                    color="red"
                    onPress={() => handleDeleteSlip(slip.id)}
                  />
                </View>
              </View>
            </Pressable>
          ))
        )}

      </ScrollView>
      {/* Add Slip Button */}
      <Pressable style={style.addSlip} onPress={() => setModalVisible(true)}>
        <Icon type="font-awesome" name='plus' size={20} color={"#054263"} />
      </Pressable>
 
      {/* Add Slip Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={style.modalView}>
          <View style={style.modalContent}>
            <Text style={style.modalTitle}>Add New Slip</Text>
            <TextInput
              style={style.input}
              placeholder="Enter slip name"
              value={newSlipName}
              onChangeText={setNewSlipName}
            />
            <View style={style.modalButtons}>
              <Pressable style={style.button} onPress={handleAddSlip}>
                <Text style={style.buttonText}>Save</Text>
              </Pressable>
              <Pressable style={style.button} onPress={() => setModalVisible(false)}>
                <Text style={style.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Slip Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={style.modalView}>
          <View style={style.modalContent}>
            <Text style={style.modalTitle}>Edit Slip</Text>
            <TextInput
              style={style.input}
              placeholder="Enter slip name"
              value={editSlipName}
              onChangeText={setEditSlipName}
            />
            <View style={style.modalButtons}>
              <Pressable style={style.button} onPress={handleEditSlip}>
                <Text style={style.buttonText}>Save</Text>
              </Pressable>
              <Pressable style={style.button} onPress={() => setEditModalVisible(false)}>
                <Text style={style.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const style = StyleSheet.create({
  body: {
    height: '100%',
    backgroundColor: backgroundThemeColor
  },
  headerContainer: {
    backgroundColor: themeColor,
    paddingTop: 50, // Increased height
    paddingBottom: 20,
    paddingHorizontal: 10,
    elevation: 5,
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: bodyColor,
    marginHorizontal: 10,
    marginTop: 10, // Fix margin from top
  },
  listHeaderText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000', // Dark text color
    textAlign: 'center'
  },
  list: {
    height: 65,
    display: 'flex',
    marginHorizontal: 2,
    marginVertical: 2,
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    backgroundColor: bodyColor,
    flex: 1,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 14, // Increased font size
    textAlign: 'center',
    display: 'flex',
    flex : 1,
  },
  itemBody: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowItem: {
    textAlign: 'center',
  },
  quantity: {
    width: 40
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: themeColor,
    borderRadius: 5,
    margin: 10,
  },
  goBackText: {
    color: 'white',
    marginLeft: 5,
  },
  addSlip: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    height: 60,
    width: 60,
    backgroundColor: 'white',
    borderRadius: 25,
    marginLeft:'auto',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: 10,
    backgroundColor: themeColor,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 80,
  },
})

const mapToStateProps = (state:ApplicationState) =>{
  return {
    token: state.userReducer.token,
  }
}

export default connect(mapToStateProps)(Slips)