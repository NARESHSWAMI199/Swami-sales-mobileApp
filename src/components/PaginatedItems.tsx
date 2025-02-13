import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import ItemCard from '../components/ItemCard';
import { Item } from '../redux';
import { bodyColor, itemsUrl } from '../utils/utils';
import Pagination from './Pagination';

const itemsPerPage = 10;
const maxButtons = 5;

function PaginatedItems(props: any) {
    const { categoryId, storeId } = props;
    const [showSpinner, setShowSpinner] = useState(false);
    const [items, setItems] = useState([]);
    const [totalElements, setTotalElements] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        setShowSpinner(true);
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
                setShowSpinner(false);
            })
            .catch(err => {
                setShowSpinner(false);
                console.log("PaginatedItems.tsx  : ", err.message);
            });
    }, [currentPage]);

    const handleNavigation = (item: Item) => {
        props.navigation.navigate('itemDetail', item);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            <ScrollView style={style.body}>
                <View style={style.outerView}>
                    <Spinner
                        visible={showSpinner}
                        textContent={'Loading...'}
                        textStyle={{ color: 'white' }}
                    />
                    {items.map((item: Item, i) => {
                        return (
                            <TouchableOpacity key={i} style={style.innerView} onPress={() => handleNavigation(item)}>
                                <ItemCard item={item} />
                            </TouchableOpacity>
                        );
                    })}
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
        backgroundColor: 'white'
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