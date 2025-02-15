import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native'
import { bodyColor, slipsUrl, themeColor } from '../utils/utils'
import { Item } from '../redux';
import { TextInput } from 'react-native-paper';
import { Icon } from '@rneui/themed';
import { logError, logInfo } from '../utils/logger' // Import logger
import DropDownPicker from 'react-native-dropdown-picker';

const AddToSlip = (props: any) => {
  const { route, navigation } = props;
  const [slips, setSlips] = useState([]);
  const [selectedSlip, setSelectedSlip] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const item: Item = route.params.item;

  // Fetch slips
  useEffect(() => {
    axios.post(slipsUrl + "all",{})
      .then(res => {
        setSlips(res.data.content.map((slip: any) => ({ label: slip.slipName, value: slip.id })));
        setLoading(false);
        logInfo(`Slips fetched successfully`);
      })
      .catch(err => {
        logError(`Error fetching slips: ${!!err.response?.data.message ? err.response.data.message : err.message}`);
        setLoading(false);
      })
  }, []);

  // Function to handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    logInfo(`Quantity updated: ${newQuantity}`);
  }

  // Function to handle add to slip
  const handleAddToSlip = () => {
    if (selectedSlip === null) {
      logError(`No slip selected`);
      return;
    }

    const payload = {
      itemId: item.id,
      quantity: quantity,
      slipId: selectedSlip
    };

    axios.post(slipsUrl + "add_item", payload)
      .then(res => {
        logInfo(`Item added to slip successfully`);
        navigation.navigate('slipItems', { slipId: selectedSlip });
      })
      .catch(err => {
        logError(`Error adding item to slip: ${!!err.response?.data.message ? err.response.data.message : err.message}`);
      })
  }

  if (loading) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color={themeColor} />
      </View>
    );
  }

  const handleBack = () => {
    navigation.goBack();
  }

  return (
    <>
      <View style={styles.headerContainer}>
        <Pressable style={styles.mainHeader} onPress={handleBack}>
          <Icon
            name="arrow-back"
            type="material"
            size={24}
            color="white"
            style={{ fontWeight: 'bold', marginHorizontal: 5 }}
          />
          <Text style={styles.headerText}>
            Add to Slip
          </Text>
        </Pressable>
      </View>
      <FlatList
        style={{ backgroundColor: 'white' }}
        data={[{ key: 'form' }]}
        renderItem={() => (
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Item:</Text>
              <Text style={styles.value}>{item.name}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Quantity:</Text>
              <View style={styles.quantitySelector}>
                <TouchableOpacity onPress={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1}>
                  <Icon name='remove' type='material' size={24} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity onPress={() => handleQuantityChange(quantity + 1)}>
                  <Icon name='add' type='material' size={24} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Select Slip:</Text>
              <DropDownPicker
                open={open}
                value={selectedSlip}
                items={slips}
                setOpen={setOpen}
                setValue={setSelectedSlip}
                setItems={setSlips}
                placeholder="Select a slip"
                style={styles.input}
                dropDownContainerStyle={styles.dropdownContainer}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleAddToSlip}>
              <Text style={styles.buttonText}>Add to Slip</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.key}
      />
    </>
  )
}

// Styles
const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: themeColor,
    paddingTop: 50, // Increased height
    paddingBottom: 20,
    paddingHorizontal: 10,
    elevation: 5,
    marginBottom: 10, // Fix margin from bottom
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
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: 'gray',
  },
  input: {
    backgroundColor: 'white',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: themeColor,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderColor: 'gray',
  }
})

export default AddToSlip
