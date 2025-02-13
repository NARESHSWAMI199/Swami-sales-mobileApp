import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { themeColor } from '../utils/utils';

const Pagination = (props:any) => {
    const { itemsPerPage, maxButtons } = props;
    const [startButton, setStartButton] = useState(0);
    const [endButton, setEndButton] = useState(startButton + maxButtons);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState<number>(10);
    const [totalElements, setTotalElements] = useState(props.totalElements);

    useEffect(() => {
        let totalPage = Math.floor(totalElements / itemsPerPage);
        totalPage = (totalElements % itemsPerPage !== 0) ? totalPage + 1 : totalPage;
        setTotalPages(totalPage);
        if (totalPage < itemsPerPage || itemsPerPage <= maxButtons) {
            setEndButton(totalPage);
        } else {
            setEndButton(startButton + maxButtons);
        }
    }, [totalElements]);

    useEffect(() => {
        setTotalElements(props.totalElements);
    }, [props.totalElements]);

    const handleNextPages = (current: number) => {
        if (current >= endButton) {
            setStartButton(current);
        }
        handlePageChange(current);
    };

    const handlePreviousPages = (current: number) => {
        if (current < startButton) {
            setStartButton(current - 4);
        }
        handlePageChange(current);
    };

    useEffect(() => {
        setEndButton(startButton + maxButtons);
    }, [startButton]);

    const handlePageChange = (page: number) => {
        props.handlePageChange(page);
        setCurrentPage(page);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = startButton; i < endButton; i++) {
            pageNumbers.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => handlePageChange(i)}
                    style={{
                        ...style.paginationButtons,
                        backgroundColor: i === currentPage ? themeColor : 'lightgray'
                    }}
                >
                    <Text style={{ color: i === currentPage ? 'white' : 'black' }}>{i + 1}</Text>
                </TouchableOpacity>
            );
        }
        return pageNumbers;
    };

    return (
        <>
            {totalPages > 0 &&
                <View style={style.pagination}>
                    {currentPage > 0 &&
                        <TouchableOpacity
                            disabled={currentPage === 0}
                            onPress={() => handlePreviousPages(currentPage - 1)}>
                            <Icon
                                style={style.paginationIcon}
                                name='chevron-left'
                                type='font-awesome'
                                color={'#565757'}
                                size={20}
                            />
                        </TouchableOpacity>
                    }
                    {renderPageNumbers()}
                    {currentPage < totalPages - 1 &&
                        <TouchableOpacity
                            disabled={currentPage === totalPages - 1}
                            onPress={() => handleNextPages(currentPage + 1)}
                        >
                            <Icon
                                style={style.paginationIcon}
                                name='chevron-right'
                                type='font-awesome'
                                color={'#565757'}
                                size={20}
                            />
                        </TouchableOpacity>
                    }
                </View>
            }
        </>
    );
};

const style = StyleSheet.create({
    pagination: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginVertical: 10,
    },
    paginationIcon: {
        marginHorizontal: 5,
    },
    paginationButtons: {
        height: 40,
        width: 40,
        margin: 5,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default Pagination;