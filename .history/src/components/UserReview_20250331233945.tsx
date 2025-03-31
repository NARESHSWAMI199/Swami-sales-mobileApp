import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from '@rneui/themed';
import { longToDate, themeColor } from '../utils/utils';
import { Rating } from 'react-native-elements';
import { logInfo } from '../utils/logger';


const UserReview = ({ reviewObj, onLike, onDisLike,changed }: any) => {
  const [showFullMessage, setShowFullMessage] = useState(false);
  const [review,setReview] = useState(reviewObj?.itemReview);


  useEffect(() => {
    if (!!review && review?.message.length < 100) {
      setShowFullMessage(true);
    }
    setReview(reviewObj.itemReview)
    setReview(reviewObj.itemReview)

  }, [changed]);

  const toggleMessage = () => {
    setShowFullMessage(!showFullMessage);
  };

  return (
    <>
  {!!review && !!review.message &&
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.ratingCount}>
          <Rating
            readonly
            startingValue={review.rating}
            imageSize={15}
          />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{reviewObj?.username}</Text>
        </View>
      </View>
      <Text style={styles.message}>
        {showFullMessage ? review.message : `${review.message.substring(0, 100)}...`}
      </Text>
      {review.message?.length > 100 && (
        <TouchableOpacity onPress={toggleMessage}>
          <Text style={styles.viewMoreText}>{showFullMessage ? 'View Less' : 'View More'}</Text>
        </TouchableOpacity>
      )}
      <View style={styles.footer}>
        <Text style={styles.createdAt}>Posted before {longToDate(review.createdAt)}</Text>
        <View style={styles.likesDislikes}>
          <TouchableOpacity style={styles.likes} onPress={() => onLike(review.id)}>
            <Icon name="thumb-up" type="material" size={20} color={review.isLiked ? themeColor : 'gray'} />
            <Text style={styles.likesText}>{review.likes}</Text>
          </TouchableOpacity>
          <View style={styles.dislikes}>
          <TouchableOpacity style={styles.likes} onPress={() => onDisLike(review.id)}>
            <Icon name="thumb-down" type="material" size={20} color={review.isDisliked ? themeColor : 'gray'} />
            <Text style={styles.dislikesText}>{review.dislikes}</Text>
          </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  }
</>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight : 2
  },
  userInfo: {
    marginLeft: 5,
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
  },
  message: {
    marginVertical: 1,
    fontSize: 14,
    padding: 10,
    borderRadius: 5,
    fontWeight: 'bold',
  },
  viewMoreText: {
    color: 'blue',
    marginTop: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createdAt: {
    fontSize: 12,
    color: 'gray',
  },
  likesDislikes: {
    flexDirection: 'row',
  },
  likes: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  likesText: {
    marginLeft: 5,
    fontSize: 14,
  },
  dislikes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dislikesText: {
    marginLeft: 5,
    fontSize: 14,
  },
});

export default UserReview;
