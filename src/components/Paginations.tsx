import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
}

const Pagination = (props:any) => {

    const {
        totalItems,
        itemsPerPage,
        data
    } = props

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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

    return (
        <View>
            <FlatList
                // ... other FlatList props
                data={data}
                renderItem={({ item }) => <Text>{item}</Text>}
                numColumns={2}
                keyExtractor={(item) => item.id}
                // Pagination logic
                //data={data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity disabled={currentPage === 1} onPress={() => handlePageChange(currentPage - 1)}>
                    <Text>Previous</Text>
                </TouchableOpacity>
                {renderPageNumbers()}
                <TouchableOpacity disabled={currentPage === totalPages} onPress={() => handlePageChange(currentPage + 1)}>
                    <Text>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Pagination;