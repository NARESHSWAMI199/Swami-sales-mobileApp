import React, { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Icon } from 'react-native-elements';
import { Rating } from 'react-native-ratings';
import axios from 'axios';
import { itemsUrl, reviewUrl, themeColor } from '../utils/utils';
import { logError, logInfo } from '../utils/logger';

const AddItemReview = ({ route, navigation }) => {
  const { item } = route.params;
  const [rating, setRating] = useState(3);
  const [review, setReview] = useState('');

  const handleRatingSubmit = () => {
    axios.post(reviewUrl + 'add', {
      itemId : item?.id,
      rating,
      message : review
    })
    .then(res => {
      Alert.alert("Thank you", "Your review has been submitted successfully.");
      logInfo(res.data.message);
      navigation.navigate("itemDetail",{item : item , review : res.data.res});
    })
    .catch(err => {
      logError(`Error submitting review: ${!!err.response ? err.response.data?.message : err.message}`);
    });
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.mainHeader}>
          <Icon
            name="arrow-back"
            type="material"
            size={24}
            color="white"
            style={{ fontWeight: 'bold', marginHorizontal: 5 }}
          />
          <Text style={styles.headerText}>Add Item Review</Text>
        </TouchableOpacity>
      </View>
    <View style={styles.container}>
      <View style={styles.card}>
        <Rating
          showRating
          onFinishRating={setRating}
          style={{ paddingVertical: 10 }}
        />
        <TextInput
          style={styles.input}
          placeholder="Write your review here..."
          multiline
          numberOfLines={4}
          onChangeText={setReview}
          value={review}
        />
        <View style={{ display: 'flex', alignItems: 'center' }}>
          <Pressable
            onPress={handleRatingSubmit}
            style={styles.button}
            accessibilityLabel="Learn more about this purple button"
          >
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>Submit</Text>
          </Pressable>
        </View>
      </View>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: themeColor,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 10,
    elevation: 5,
  },
  mainHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.25, // iOS shadow
    shadowRadius: 3.84, // iOS shadow
  },
  input: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    borderRadius: 10,
    height: 45,
    width: '100%',
    backgroundColor: themeColor,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.25, // iOS shadow
    shadowRadius: 3.84, // iOS shadow
  }
});

export default AddItemReview;
