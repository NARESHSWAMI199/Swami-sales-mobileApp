import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import StoreCard from '../components/StoreCard';
import { Store } from '../redux';
import { bodyColor, storeUrl } from '../utils/utils';
import PropTypes from 'prop-types';

function PopularStores({ navigation }) {
  const [stores, setStores] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setShowSpinner(true);
    try {
      const { data } = await axios.post(storeUrl + "all", { pageSize: 12 });
      setStores(data.content);
    } catch (err) {
      console.error("PopularStores: ", err.message);
    } finally {
      setShowSpinner(false);
    }
  };

  const handleNavigation = (store) => {
    navigation.navigate('storeDetail', store);
  };

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