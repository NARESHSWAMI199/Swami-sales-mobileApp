import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { itemImageUrl, storeImageUrl, storeUrl } from '../utils/utils';
import { toTitleCase } from '../utils';
import { Avatar, Badge, Rating } from 'react-native-elements';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Subcategory } from '../redux';
import { logError, logInfo } from '../utils/logger'; // Import loggers

const StoreCard = (props: any) => {
    const {
        name,
        description,
        avatar,
        slug,
        address,
        rating,
        storeCategory,
        storeSubCategory
    } = props.store

    const avtar = storeImageUrl + slug + "/" + avatar;

    // Log store details
    logInfo(`Rendering StoreCard for ${name}`);

    return (
        <View style={style.card}>
            <Card.Cover
                style={style.cardCover}
                resizeMode='contain'
                source={{ uri: !!avatar ? avtar : props.url }} />

            <View style={style.badge}>
                <Badge
                    textStyle={{
                        color: '#001475',
                        fontSize: 10
                    }}
                    badgeStyle={{
                        paddingHorizontal: 5,
                        backgroundColor: '#f1f7ed'
                    }}
                    status='primary'
                    value={storeSubCategory?.subcategory}
                />
            </View>
            <View>
                <Text variant="titleLarge" style={style.itemTitle} >
                    {toTitleCase(name.substring(0, 10))}
                </Text>
            </View>

            <View>
                <Rating type='custom' imageSize={15} readonly startingValue={rating} />
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    card: {
        width: '100%',
        height: 180,
        marginBottom: 10,
    },
    cardCover: {
        width: '100%',
        height: 100,
        overflow: 'hidden'
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
    },
    itemTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    badge: {
        marginVertical: 5
    }
})

export default StoreCard;