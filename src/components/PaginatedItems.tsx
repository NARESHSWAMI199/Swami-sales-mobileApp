import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import ItemCard from '../components/ItemCard';
import { Item } from '../redux';
import { bodyColor, itemsUrl, themeColor } from '../utils/utils';
import { Icon } from 'react-native-elements';



let maxButtons = 5
const itemsPerPage = 99
function PagiantedItems(props: any) {
    const { categoryId, storeId } = props;
    const [showSpinner, setShowSpinner] = useState(false)
    const [items, setItems] = useState([])
    const [startButton,setStartButton] = useState(0)
    const[totalItems,setTotalItems] = useState<number>(1)
    const [endButton,setEndButton] = useState(startButton+maxButtons)
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages,setTotalPages] = useState<number>(10);


    useEffect(()=>{
        let totalPage =  (totalItems > itemsPerPage) ? 
            Math.floor((totalItems / itemsPerPage) + (totalItems % itemsPerPage)) : 
            Math.floor(totalItems/itemsPerPage);
        setTotalPages(totalPage)
        if(totalPage < itemsPerPage){
            setEndButton(totalPage)
         }else{
            setEndButton(startButton+maxButtons)
         }
    },[totalItems])
     

    useEffect(()=>{
       setEndButton(startButton+5)
    },[startButton])

    const handlePageChange = (page: number) => {
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
                        backgroundColor: i === currentPage ? themeColor : 'gray'
                    }}
                >
                    <Text style={{ color: 'white' }}>{i+1}</Text>
                </TouchableOpacity>
            );
        }
        return pageNumbers;
    };


    const handleNextPages = (current:number) => {
        if(current >= endButton){
            console.log(current)
            setStartButton(current)
        }
        setCurrentPage(current)

    }

    const handlePreviousPages = (current:number) =>{
        if(current < startButton){
            console.log(current)
            setStartButton(current-4)
        }
        setCurrentPage(current)
    }



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
{totalPages > 0 &&
    <View style={style.pagination}>
        <TouchableOpacity 
            disabled={currentPage ===0} 
            onPress={() => handlePreviousPages(currentPage - 1)}>
        <Icon
            style={style.paginationIcon}
            name='chevron-left'
            type='font-awesome'
            color={'#565757'}
            size={20}
        />
        </TouchableOpacity>
        {renderPageNumbers()}
        <TouchableOpacity 
            disabled={currentPage === totalPages-1}
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
    </View>
    }
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
    },
    pagination : {
        display:'flex',
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        flex : 1
    },
    paginationIcon : {
        marginHorizontal : 2
    },
    paginationButtons : {
        height : 40,
        width : 40,
        margin: 5, 
        borderRadius: 50,
        alignItems : 'center',
        justifyContent : 'center',
    }
    

})

export default PagiantedItems