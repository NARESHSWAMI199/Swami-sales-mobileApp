import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, StyleSheet, View, Image, Pressable, StatusBar, TouchableOpacity } from 'react-native'
import { bodyColor, getPercentage, itemImageUrl, themeColor, storeUrl } from '../utils/utils'
import { Item } from '../redux';
import { toTitleCase } from '../utils';
import { Text } from 'react-native-paper';
import { Avatar, Input, Rating, SearchBar } from 'react-native-elements';
import ViewMoreText from 'react-native-view-more-text';
import { Icon } from '@rneui/themed';
import CustomCarousel from '../components/Carousel';
import CommentView from '../components/CommentView';
import CommentInputBox from '../components/CommentInputBox';
import { logError, logInfo } from '../utils/logger' // Import logger
import { connect } from 'react-redux';
import { ApplicationState } from '../redux';

const ItemDetail = (props: any) => {
  const { route, navigation } = props;
  const [state, setState] = useState("")
  const [commentUpdated, setCommentUpdated] = useState(false)
  const commentRef = useRef(null);
  const [parentId, setParentId] = useState<number>(0)
  const [storeName, setStoreName] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");
  const item: Item = route.params;

  // Function to update search query
  const updateSearch = (search: any) => {
    setState(search);
    logInfo(`Search query updated: ${search}`)
  };

  // Function to add new comments
  const addNewComment = (comment:string) => {
    setNewComment(comment);
    logInfo(`Comments refreshed`)
  }

  // Function to render "View More" text
  const renderViewMore = (onPress: any) => {
    return (
      <View style={styles.viewMoreLess}>
        <Icon name='chevron-small-down' color='black' type="entypo" />
        <Text onPress={onPress}>View more</Text>
      </View>
    )
  }

  // Function to render "View Less" text
  const renderViewLess = (onPress: any) => {
    return (
      <View style={styles.viewMoreLess}>
        <Icon name='chevron-small-up' type="entypo" />
        <Text onPress={onPress}>View less</Text>
      </View>
    )
  }

  // Function to handle comment focus
  const handleCommentFoucs = (parentId: number) => {
    commentRef.current?.blur();
    commentRef.current?.focus();
    setParentId(parentId)
    logInfo(`Comment focused with parentId: ${parentId}`)
  }

  // Fetch store details
  useEffect(() => {
    if (item) {
      axios.get(`${storeUrl}-detail/${item.wholesaleId}`)
        .then(res => {
          setStoreName(res.data.storeName);
          logInfo(`Store details fetched successfully for storeId: ${item.wholesaleId}`)
        })
        .catch(err => {
          logError(`Error fetching store details: ${!!err.response?.data.message ? err.response.data.message : err.message}`)
        })
    }
  }, [item]);

  // Function to handle add to slip
  const handleAddToSlip = () => {
    if (!props.isAuthenticated) {
      navigation.navigate('login');
      return;
    }
    navigation.navigate('AddToSlip', { item });
  }

  // Render component
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name='arrow-back' color='white' />
      </TouchableOpacity>
      <ScrollView style={{ backgroundColor: 'white' }} keyboardShouldPersistTaps={'handled'}>
        <View style={styles.imageParent}>
          <CustomCarousel style={styles.carousel} images={
            item.avatars && item.avatars.split(',').map(avtar => {
              return (
                <Image
                  style={styles.image}
                  source={{ uri: itemImageUrl + item.slug + "/" + avtar }}
                  resizeMode='cover' />
              )
            })}
          />
        </View>

        <View style={styles.body}>
          <View>
            <Text style={styles.title} variant="titleLarge">{toTitleCase(item.name.trim())}</Text>
          </View>

          <View style={styles.priceParent}>
            <Text style={styles.price} variant="titleLarge">{"\u20B9 " + (item.price - item.discount)}</Text>
            <Text style={{ ...styles.price, marginLeft: 20 }} variant="titleLarge">
              <Text style={styles.discount}>
                {Math.floor(getPercentage(item.discount, item.price) * 1) + "% "}
              </Text>
              {"OFF"}
            </Text>
          </View>

          <View>
            <Text style={styles.totalPrice}>{"\u20B9 " + item.price}</Text>
          </View>

          <View style={styles.rating}>
            <Text style={{ ...styles.subtitle, marginTop: 0, marginRight: 10 }}>{"Rating : "}</Text>
            <Rating type='custom' imageSize={25} readonly startingValue={item.rating} />
          </View>

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={styles.subtitle}>Store : </Text>
            <Text style={{ ...styles.subtitle, fontWeight: '500', fontSize: 16 }}>{storeName}</Text>
          </View>

          {item.capacity > 0 && (
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Text style={styles.subtitle}>Capacity : </Text>
              <Text style={{ ...styles.subtitle, fontWeight: '500', fontSize: 16 }}>{item.capacity} {item.itemSubCategory.unit}</Text>
            </View>
          )}

          <View>
            <Text style={styles.subtitle}>Description : </Text>
            <ViewMoreText
              numberOfLines={3}
              renderViewMore={renderViewMore}
              renderViewLess={renderViewLess}
            >
              <Text style={styles.description}>{item.description.trim()}</Text>
            </ViewMoreText>
          </View>

          <View style={{ display: 'flex', alignItems: 'center' }}>
            <Pressable
              onPress={handleAddToSlip}
              style={styles.button}
              accessibilityLabel="Learn more about this purple button"
            >
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white' }}>{"ADD TO SLIP"}</Text>
            </Pressable>
          </View>
        </View>

        {/* Comments Section */}
        <View>
          <CommentView handleReply={handleCommentFoucs} newComment={newComment} itemId={item.id} />
        </View>
      </ScrollView>
      <CommentInputBox
        commentRef={commentRef}
        itemId={item.id}
        parentId={parentId}
        addNewComment={addNewComment}
        commentContainer={styles.commentInputBody}
        style={styles.commentInput}
      />
    </>
  )
}

// Styles
const styles = StyleSheet.create({
  carousel : {
    backgroundColor: '#f5f9ff',
  },
  backButton: {
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
  },
  image: {
    width: '100%',
    height: 305
  },
  body: {
    paddingHorizontal: 15,
    paddingTop: 10,
    opacity: 0.8
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 'auto'
  },
  priceParent: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    marginTop: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    opacity: 0.8
  },
  discount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D6900',
  },
  totalPrice: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#939393',
    textDecorationLine: 'line-through'
  },
  rating: {
    marginTop: 10,
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  subtitle: {
    marginVertical: 5,
    fontSize: 16,
    fontWeight: '700'
  },
  button: {
    borderRadius: 20,
    height: 45,
    width: '100%',
    backgroundColor: themeColor,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    marginVertical: 20
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
  },
  commentInput: {
    fontSize: 14,
    borderColor: 'gray',
    height: 50
  },
  commentInputBody: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: bodyColor
  },
  viewMoreLess: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 5,
  }
})

const mapToStateProps = (state: ApplicationState) => {
  return {
    isAuthenticated: !!state.userReducer.token,
  }
}

export default connect(mapToStateProps)(ItemDetail)