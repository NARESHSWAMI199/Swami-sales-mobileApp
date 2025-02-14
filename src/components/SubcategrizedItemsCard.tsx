import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Subcategory } from '../redux';
import Items from '../screens/Items';
import { toTitleCase } from '../utils';
import { logError, logInfo } from '../utils/logger'; // Import loggers

function SubCategirzedItemsCard(props: any) {
    const [subcategory, setSubcategory] = useState({
        id: 0,
        subcategory: ''
    });

    useEffect(() => {
        setSubcategory(props.subcategory)
        logInfo(`Subcategory set: ${props.subcategory.subcategory}`);
    }, [props.subcategory])

    return (
        <View>
            <Text style={style.titleHeadings}>
                {toTitleCase(subcategory.subcategory)}
            </Text>
            <Items {...props} size={3} showCategory={false} subcategoryId={subcategory.id} />
        </View>
    )
}

const style = StyleSheet.create({
    titleHeadings: {
        marginHorizontal: 10,
        fontWeight: 'bold',
        fontSize: 16,
        marginVertical: 20,
    },
})

export default SubCategirzedItemsCard