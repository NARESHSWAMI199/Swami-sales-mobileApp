import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import StoreCard from '../components/StoreCard';
import { ApplicationState, Store } from '../redux';
import { bodyColor, storeUrl } from '../utils/utils';
import PropTypes from 'prop-types';
import { logError, logInfo } from '../utils/logger'; // Import logger

function PopularStores({ navigation, location }) {
  // State variables
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Effect to fetch stores on component mount
  useEffect(() => {
    fetchStores();
  }, []);

  // Function to fetch stores
  const fetchStores = async () => {
    setLoading(true);
    logInfo(`Fetching popular stores`);
    try {
      const { data } = await axios.post(storeUrl + "all", { pageSize: 12, zipCode: location?.postalCode });
      setStores(data.content);
      logInfo(`Popular stores fetched successfully`);
    } catch (err) {
      logError(`Error fetching popular stores: ${!!err.response?.data.message ? err.response.data.message : err.message}`);
    } finally {
      setLoading(false);
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
        {loading ? (
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color={bodyColor} />
          </View>
        ) : (
          stores.map((store, i) => (
            <TouchableOpacity
              key={i}
              style={styles.storeView}
              onPress={() => handleNavigation(store)}
            >
              <StoreCard store={store} />
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

PopularStores.propTypes = {
  navigation: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeView: {
    width: 120,
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 2,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  location: state.userReducer.location
})

export default connect(mapStateToProps)(PopularStores)