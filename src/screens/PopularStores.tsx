import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import StoreCard from '../components/StoreCard';
import { Store } from '../redux';
import { bodyColor, storeUrl } from '../utils/utils';
import PropTypes from 'prop-types';
import { logError, logInfo } from '../utils/logger'; // Import logger

function PopularStores({ navigation }) {
  // State variables
  const [stores, setStores] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);

  // Effect to fetch stores on component mount
  useEffect(() => {
    fetchStores();
  }, []);

  // Function to fetch stores
  const fetchStores = async () => {
    setShowSpinner(true);
    logInfo(`Fetching popular stores`);
    try {
      const { data } = await axios.post(storeUrl + "all", { pageSize: 12 });
      setStores(data.content);
      logInfo(`Popular stores fetched successfully`);
    } catch (err) {
      logError(`Error fetching popular stores: ${err.message}`);
    } finally {
      setShowSpinner(false);
    }
  };

  // Function to handle navigation to store detail
  const handleNavigation = (store) => {
    logInfo(`Navigating to store detail: ${store.id}`);
    navigation.navigate('storeDetail', store);
  };

  // Render component
  return (
    <ScrollView style={styles.body}>
      <View style={styles.storeParent}>
        <Spinner
          visible={showSpinner}
          textContent={'Loading...'}
          textStyle={{ color: 'white' }}
        />
        {stores.map((store, i) => (
          <TouchableOpacity
            key={i}
            style={styles.storeView}
            onPress={() => handleNavigation(store)}
          >
            <StoreCard store={store} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

PopularStores.propTypes = {
  navigation: PropTypes.object.isRequired,
};

// Styles
const styles = StyleSheet.create({
  body: {
    backgroundColor: bodyColor,
    height: '100%',
    flex: 1,
  },
  titleHeadings: {
    marginHorizontal: 10,
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 20,
    color: 'black',
  },
  storeParent: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  storeView: {
    width: 120,
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 2,
  },
});

export default PopularStores;