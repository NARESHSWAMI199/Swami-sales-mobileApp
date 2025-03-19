import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon, Image } from 'react-native-elements';
import { Rating } from 'react-native-ratings';
import ViewMoreText from 'react-native-view-more-text';
import { connect } from 'react-redux'; // Import connect
import { ApplicationState } from '../redux'; // Import ApplicationState
import { logError, logInfo } from '../utils/logger';
import { backgroundThemeColor, itemImageUrl, reviewUrl, themeColor } from '../utils/utils';

const AddItemReview = ({ route, navigation, isAuthenticated }) => { // Add isAuthenticated prop
  const { item } = route.params;
  const [review, setReview] = useState('');
  const avatars : [] =  item.avatars?.split(',')
  const [itemAvatar,setItemAvatar] = useState();
  const [rating, setRating] = useState(3);

  useEffect(()=>{
    if(!!avatars && avatars.length > 0){
      setItemAvatar([...avatars][0])
    }
  },[])

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate('login');
    }
  }, [isAuthenticated]);

  const handleRatingSubmit = () => {
    axios.post(reviewUrl + 'add', {
      itemId : item?.id,
      rating,
      message : review
    })
    .then(res => {
      Alert.alert("Thank you", "Your review has been submitted successfully.");
      logInfo(res.data.message);
      navigation.goBack()
    })
    .catch(err => {
      logError(`Error submitting review: ${!!err.response ? err.response.data?.message : err.message}`);
    });
  };
  
  // Function to render "View More" text
  const renderViewMore = (onPress: any) => {
    return (
      <View style={styles.viewMoreLess}>
        <Icon name='chevron-small-down' color='black' type="entypo" />
        <Text onPress={onPress}>Read more</Text>
      </View>
    )
  }

  // Function to render "View Less" text
  const renderViewLess = (onPress: any) => {
    return (
      <View style={styles.viewMoreLess}>
        <Icon name='chevron-small-up' type="entypo" />
        <Text onPress={onPress}>Read less</Text>
      </View>
    )
  }

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.mainHeader}>
          <Icon
            name="arrow-back"
            type="material"
            size={24}
            color = 'white'
            style={{ fontWeight: 'bold', marginHorizontal: 5 }}
          />
          <Text style={styles.headerText}>Write a Review</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {/* Item card */}
          <View style={styles.itemCard}>
            <Image
              style={styles.image}
              source={{ uri: itemImageUrl + item.slug + "/" + itemAvatar }}
              resizeMode='cover'
              alt='Item Images'
            />
            <View style={{ display: 'flex', flexDirection: 'column', flex : 1}}>
              {/* Item name */}
              <View>
                <Text style={styles.title}>{item.name}</Text>
              </View>
              {/* Description */}
              <View>
                <ViewMoreText
                  numberOfLines={3}
                  renderViewMore={renderViewMore}
                  renderViewLess={renderViewLess}
                >
                  <Text style={styles.description}>{item.description?.trim()}</Text>
                </ViewMoreText>
              </View>
            </View>
          </View>

          <View style={{ backgroundColor: '#fff', padding: 20 }}>
            <Text style={{ textAlign: 'center', ...styles.label }}>
              How would you rate this product overall?
            </Text>
            <Rating
              imageSize={25}
              onFinishRating={setRating}
              style={{ marginVertical: 20 }}
            />
          </View>

          {/* Review section */}
          <View style={styles.reviewBody}>
            <Text style={styles.label}>Write a review:</Text>
            <TextInput
              style={styles.input}
              placeholder="Would you like to write anything about this product."
              multiline
              numberOfLines={10}
              onChangeText={setReview}
              value={review}
            />
          </View>
          <View style={{ display: 'flex', alignItems: 'center' }}>
            <Pressable
              onPress={handleRatingSubmit}
              style={styles.button}
              accessibilityLabel="Submit your review"
            >
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>Submit Review</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundThemeColor,
  },

  reviewBody: {
    padding : 15,
    display : 'flex',
    flexDirection : 'column',
    justifyContent : 'center',
    alignItems : 'center'
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
    fontWeight: '600',
    color : 'white',
    marginLeft: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20
  },

  itemCard : {
    display : 'flex',
    flexDirection : 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical : 20,
    padding : 15,
  },

  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
  },
  label: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
    textAlign : 'center'
  },
  input: {
    marginBottom: 20,
    backgroundColor : '#fff',
    padding : 15,
    borderRadius: 10,
  },
  button: {
    borderRadius: 5,
    height: 45,
    width : '95%',
    backgroundColor: themeColor,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.25, // iOS shadow
    shadowRadius: 3.84, // iOS shadow
  },
  viewMoreLess: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 5,
  },
  image : {
    height : 80, 
    width : 80,
    borderRadius : 5,
    marginRight : 10
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

const mapToStateProps = (state: ApplicationState) => {
  return {
    isAuthenticated: !!state.userReducer.token,
  };
};

export default connect(mapToStateProps)(AddItemReview);
