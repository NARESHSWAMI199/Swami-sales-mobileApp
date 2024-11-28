import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import ItemCard from '../components/ItemCard';
import { Item } from '../redux';
import { bodyColor, itemsUrl } from '../utils/utils';




function PagiantedItems(props: any) {
    const { categoryId, storeId } = props;
    const [showSpinner, setShowSpinner] = useState(false)
    const [items, setItems] = useState([])


    const[totalItems,setTotalItems] = useState<number>(1)
    const [itemsPerPage,setItemPerPage] = useState<number>(5);

    const [currentPage, setCurrentPage] = useState(0);

    const [totalPages,setTotalPages] = useState<number>(5);

    useEffect(()=>{
        setTotalPages(Math.ceil(totalItems / itemsPerPage))
    },[totalItems])
     

    const handlePageChange = (page: number) => {
        setCurrentPage(page-1);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => handlePageChange(i)}
                    style={{ padding: 10, margin: 5, backgroundColor: i === currentPage ? 'blue' : 'gray', borderRadius: 5 }}
                >
                    <Text style={{ color: 'white' }}>{i}</Text>
                </TouchableOpacity>
            );
        }
        return pageNumbers;
    };





    useEffect(() => {
        let data = {
            categoryId: categoryId,
            storeId: storeId,
            pageSize: itemsPerPage,
            pageNumber : currentPage
        }
        console.log("TabItems")
        axios.post(itemsUrl + "all", data)
            .then(res => {
                let response = res.data;
                setItems(response.content)
                setTotalItems(response.totalElements)
                setShowSpinner(false)
            })
            .catch(err => {
                setShowSpinner(false)
                console.log("TabItems.tsx  : ", err.message)
            })
    }, [currentPage])



    const handleNavigation = (item: Item) => {
        props.navigation.navigate('itemDetail', item);
    };



    return (<><ScrollView style={style.body}>
        <View style={style.outerView}>
            <Spinner
                visible={showSpinner}
                textContent={'Loading...'}
                textStyle={{ color: 'white' }}
            />
            {items.map((item: Item, i) => {
                return (<TouchableOpacity key={i} style={style.innerView} onPress={(e) => handleNavigation(item)}>
                    <ItemCard item={item} />
                </TouchableOpacity>)
            })}
        </View>
    </ScrollView>

    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity disabled={currentPage === 1} onPress={() => handlePageChange(currentPage - 1)}>
            <Text>Previous</Text>
        </TouchableOpacity>
        {renderPageNumbers()}
        <TouchableOpacity disabled={currentPage === totalPages} onPress={() => handlePageChange(currentPage + 1)}>
            <Text>Next</Text>
        </TouchableOpacity>
    </View>
    </>
    )
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
    }

})

export default PagiantedItems