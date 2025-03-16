import { Icon } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, View, TouchableOpacity, ActivityIndicator, Pressable, Alert } from 'react-native';
import { Badge, Rating } from 'react-native-elements';
import { Text } from 'react-native-paper';
import ViewMoreText from 'react-native-view-more-text';
import { Store, Item } from '../redux';
import { toTitleCase } from '../utils';
import { storeImageUrl, itemsUrl, themeColor, storeUrl } from '../utils/utils';
import { logError, logInfo } from '../utils/logger'; // Import logger
import ItemCard from '../components/ItemCard';
import axios from 'axios';
import RatingModal from '../components/RatingModal';

const StoreDetail = (props: any) => {
  const { route, navigation } = props;
  const [state, setState] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalRatings,setTotalRatings] = useState(0)
  const [data, setData] = useState({
    storeId: route.params.id,
    pageSize: 51,
    pageNumber: 0
  });

  const [store,SetStore] = useState<Store>(route.params);



    // Get store ratings
    useEffect(()=>{
      axios.get(`${storeUrl}ratings/${store.slug}`)
      .then(res => {
        setTotalRatings(res.data.totalRating);
      }).catch(err=>{
        logError(`Error fetching rating count details: ${!!err.response?.data.message ? err.response.data.message : err.message}`)
      })
    },[])
  

  // Function to update search query
  const updateSearch = (search: any) => {
    setState(search);
    logInfo(`Search query updated: ${search}`);
  };

  // Function to render "View More" text
  const renderViewMore = (onPress: any) => {
    return (
      <View style={styles.viewMoreLess}>
        <Icon name='chevron-small-down' color='black' type="entypo" />
        <Text onPress={onPress}>View more</Text>
      </View>
    );
  };

  // Function to render "View Less" text
  const renderViewLess = (onPress: any) => {
    return (
      <View style={styles.viewMoreLess}>
        <Icon name='chevron-small-up' type="entypo" />
        <Text onPress={onPress}>View less</Text>
      </View>
    );
  };

  // Function to check if background color is white
  const isBackgroundWhite = (color: string) => {
    const whiteThreshold = 240; // Adjust this value as needed
    const rgb = color.match(/\d+/g);
    if (rgb) {
      const [r, g, b] = rgb.map(Number);
      return r > whiteThreshold && g > whiteThreshold && b > whiteThreshold;
    }
    return false;
  };

  const backgroundColor = 'white'; // Replace with dynamic background color if needed
  const statusBarStyle = isBackgroundWhite(backgroundColor) ? 'dark-content' : 'light-content';

  // Effect to fetch items based on storeId
  useEffect(() => {
    logInfo(`Fetching items for storeId: ${data.storeId}`)
    axios.post(itemsUrl + "all", { ...data })
      .then(res => {
        let item = res.data.content;
        setItems(item);
        setTotalElements(res.data.totalElements);
        setLoading(false);
        logInfo(`Items fetched successfully`)
      })
      .catch(err => {
        setLoading(false);
        logError(`Error fetching items: ${!!err.response?.data.message ? err.response.data.message : err.message}`)
      })
  }, []);

  // Function to fetch more items on scroll end
  const fetchMoreItems = () => {
    if (items.length >= totalElements) return;
    setIsFetchingMore(true);
    axios.post(itemsUrl + "all", { ...data, pageNumber: data.pageNumber + 1 })
      .then(res => {
        let newItems = res.data.content;
        if (newItems.length > 0) {
          setItems(prevItems => [...prevItems, ...newItems]);
          setData({ ...data, pageNumber: data.pageNumber + 1 });
        }
        setIsFetchingMore(false);
        logInfo(`More items fetched successfully`)
      })
      .catch(err => {
        setIsFetchingMore(false);
        logError(`Error fetching more items: ${!!err.response?.data.message ? err.response.data.message : err.message}`)
      })
  };


  const handleRatingSubmit = (rating:Number) => {
    axios.post(storeUrl + `update/ratings`,
      {
        storeId : store.id,
        rating : rating
      })
      .then(res => {
        Alert.alert("Thanks you", "Your feedback has been saved successfully.")
        let response = res.data;
        SetStore(previous => ({...previous,rating : response.ratingAvg}))
        logInfo(response.message)
      }).catch(err=>{
        logError(`Error during update store ratings: ${!!err.response ? err.response.data?.message : err.message}`)
      })
  }

  // Render component
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle={statusBarStyle} />
      <ScrollView
        style={{ backgroundColor }}
        onScroll={({ nativeEvent }) => {
          if (nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height - 20) {
            fetchMoreItems();
          }
        }}
        scrollEventThrottle={400}
      >
        <View style={styles.imageParent}>
          <Image style={styles.image}
            source={{ uri: storeImageUrl + store.slug + "/" + store.avatar }}
            resizeMode={'cover'} />
        </View>

        <View style={styles.body}>
          <View style={styles.badgesContainer}>
            <Badge textStyle={styles.badgeText} badgeStyle={styles.badge} status='primary' value={store?.storeSubCategory?.subcategory} />
            <Badge textStyle={styles.badgeText} badgeStyle={styles.badge} status='primary' value={store?.storeCategory?.category} />
          </View>


          <View style={styles.rating}>
            <View style={styles.ratingCount}>
              <Text style={styles.ratingText}>{Math.round(store.rating)}</Text>
              <Icon name="star" type="material" size={20} color="white" />
            </View>
            <Text style={{marginHorizontal : 5}}>
              {totalRatings} ratings
            </Text>
          </View>

          <Text style={styles.title} variant="titleLarge">{toTitleCase(store.name.trim())} </Text>
          <View>
              <Text style={styles.subtitle}>About us:</Text>
              <ViewMoreText
                numberOfLines={3}
                renderViewMore={renderViewMore}
                renderViewLess={renderViewLess}
              >
                <Text style={styles.description}>{store.description.trim()}</Text>
              </ViewMoreText>
            </View>

          <View>
            {items.length > 0 && 
            <View style={{display : 'flex',flexDirection : 'row'}}>
              <View style={{flex :1}}>
                <Text style={styles.titleHeadings}>Our Latest Products</Text> 
              </View>
              <Pressable style={{justifyContent : 'center', alignItems : 'flex-end'}}
                onPress={()=> {
                  setModalVisible(!modalVisible)
                }}>
              
                <Text style={{
                  color : 'blue',
                  marginHorizontal : 10
                }}>Rate now</Text> 
              </Pressable>
            </View>
            }
            {loading ? (
              <ActivityIndicator size="large" color={themeColor} />
            ) : (
              <View style={styles.outerView}>
                {items.map((item: Item, i) => (
                  <TouchableOpacity key={i} style={styles.innerView} onPress={() => props.navigation.navigate('itemDetail', item)}>
                    <ItemCard item={item} />
                  </TouchableOpacity>
                ))}
                {isFetchingMore && <ActivityIndicator size="large" color={themeColor} />}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.fixedBackButton}>
        <Icon name='arrow-back' color='white' />
      </TouchableOpacity>

      <RatingModal modalVisible={modalVisible} setModalVisible={setModalVisible} handleRatingSubmit={handleRatingSubmit} />
    </>
  );
};

// Styles
const styles = StyleSheet.create({
  header: {
    elevation: 0,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
  },
  fixedBackButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
    zIndex: 1,
  },
  imageParent: {
    width: '100%',
    height: 320,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  body: {
    paddingHorizontal: 15,
    paddingTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  badgesContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#f1f7ed',
    marginRight: 5,
  },
  badgeText: {
    color: '#001475',
    fontSize: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 'auto',
  },
  rating: {
    marginVertical: 10,
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  ratingCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: 'green',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 2
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700'
  },
  titleHeadings: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 20,
  },

  description: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 20,
  },
  viewMoreLess: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 10,
  },
  outerView: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    backgroundColor: 'white'
  },
  innerView: {
    width: '32%',
    margin: 2,
  },
});

export default StoreDetail;