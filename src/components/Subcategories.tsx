import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { itemsUrl, storeUrl } from '../utils/utils';
import {ItemSubCategoryCard,StoreSubCategoryCard} from './SubCategoryCard';

const ItemSubCategories = () =>  {

    const [subcategories,setSubcategories] = useState([]);

    useEffect(()=>{
        axios.post(itemsUrl +"subcategory",{pageSize : 6})
        .then(res=>{
            let data = res.data;
            setSubcategories(data)
        }).catch(err => {
            console.log(err)
        })
    },[])

  return (<>
  <View style={style.main}>
        {subcategories.map((subcategory : any , index)=>{
           return <View key={index} style={style.inner}>
                <ItemSubCategoryCard key={index} subcategory = {subcategory} />
           </View>
        })}
    </View>
    </>
  )

}


const StoreSubCategories = () =>  {

    const [subcategories,setSubcategories] = useState([]);

    useEffect(()=>{
        axios.post(storeUrl +"subcategory",{pageSize : 6})
        .then(res=>{
            let data = res.data;
            setSubcategories(data)
        }).catch(err => {
            console.log(err)
        })
    },[])

  return (<>
  <View style={style.main}>
        {subcategories.map((subcategory : any , index)=>{
           return <View key={index} style={style.inner}>
                <StoreSubCategoryCard key={index} subcategory = {subcategory} />
           </View>
        })}
    </View>
    </>
  )

}


const style = StyleSheet.create({
    main : {
        display : 'flex',
        flexDirection : 'row',
        flexWrap : 'wrap',
        width : '100%',
        marginHorizontal : 1
    }, inner : {
        padding : 2,
        width : '33%',
    }
})

export { ItemSubCategories, StoreSubCategories };
