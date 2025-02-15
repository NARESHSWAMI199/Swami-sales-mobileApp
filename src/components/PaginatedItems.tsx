import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ItemCard from '../components/ItemCard';
import { Item } from '../redux';
import { bodyColor, itemsUrl } from '../utils/utils';
import Pagination from './Pagination';
import { logError, logInfo } from '../utils/logger'; // Import loggers

const itemsPerPage = 10;
const maxButtons = 5;

function PaginatedItems(props: any) {
    const { categoryId, storeId } = props;
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        setLoading(true);
        let data = {
            categoryId: categoryId,
            storeId: storeId,
            pageSize: itemsPerPage,
            pageNumber: currentPage
        };
        axios.post(itemsUrl + "all", data)
            .then(res => {
                let response = res.data;
                setItems(response.content);
                setTotalElements(response.totalElements);
                setLoading(false);
                logInfo(`Fetched ${response.content.length} items for page ${currentPage}`);
            })
            .catch(err => {
                setLoading(false);
                logError(`Error fetching items:${!!err.response?.data.message ? err.response.data.message : err.message}`);
            });
    }, [currentPage]);

    const handleNavigation = (item: Item) => {
        logInfo(`Navigating to item detail for ${item.name}`);
        props.navigation.navigate('itemDetail', item);
    };

    const handlePageChange = (page: number) => {
        logInfo(`Changing to page ${page}`);
        setCurrentPage(page);
    };

    return (
        <>
            <ScrollView style={style.body}>
                <View style={style.outerView}>
                    {loading ? (
                        <ActivityIndicator size="large" color={bodyColor} />
                    ) : (
                        items.map((item: Item, i) => {
                            return (
                                <TouchableOpacity key={i} style={style.innerView} onPress={() => handleNavigation(item)}>
                                    <ItemCard item={item} />
                                </TouchableOpacity>
                            );
                        })
                    )}
                </View>
            </ScrollView>
            <View style={style.pagination}>
                <Pagination
                    handlePageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalElements={totalElements}
                    maxButtons={maxButtons}
                />
            </View>
        </>
    );
}

const style = StyleSheet.create({
    body: {
        backgroundColor: bodyColor,
        height: '100%',
        flex: 1
    },
    outerView: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '98%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerView: {
        width: '32%',
        margin: 2
    },
    pagination: {
        marginVertical: 20,
        alignItems: 'center'
    }
});

export default PaginatedItems;