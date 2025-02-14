import { Icon } from '@rneui/themed';
import React, { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Badge, Rating } from 'react-native-elements';
import { Text, Appbar } from 'react-native-paper';
import ViewMoreText from 'react-native-view-more-text';
import PaginatedItems from '../components/PaginatedItems';
import { Store } from '../redux';
import { toTitleCase } from '../utils';
import { storeImageUrl } from '../utils/utils';
import { logError, logInfo } from '../utils/logger'; // Import logger

const StoreDetail = (props: any) => {
  const { route, navigation } = props;
  const [state, setState] = useState("");

  const store: Store = route.params;

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

  // Render component
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle={statusBarStyle} />
      <ScrollView style={{ backgroundColor }}>
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

          <Text style={styles.title} variant="titleLarge">{toTitleCase(store.name.trim())} </Text>
          <View style={styles.rating}>
            <Text style={{ ...styles.subtitle, marginTop: 0, marginRight: 10 }}>{"Rating : "}</Text>
            <Rating type='custom' imageSize={25} readonly startingValue={store.rating} />
          </View>

          <View>
            <Text style={styles.titleHeadings}>Our Latest Products</Text>
            <PaginatedItems {...props} storeId={store.id} />
            <View style={styles.aboutUsContainer}>
              <Text style={styles.subtitle}>About us:</Text>
              <ViewMoreText
                numberOfLines={3}
                renderViewMore={renderViewMore}
                renderViewLess={renderViewLess}
              >
                <Text style={styles.description}>{store.description.trim()}</Text>
              </ViewMoreText>
            </View>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.fixedBackButton}>
        <Icon name='arrow-back' color='white' />
      </TouchableOpacity>
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
    paddingHorizontal: 10,
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
    marginBottom: 10,
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
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700'
  },
  titleHeadings: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 20,
  },
  aboutUsContainer: {
    marginTop: 20,
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
  }
});

export default StoreDetail;