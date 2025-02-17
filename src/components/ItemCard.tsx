import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Badge, Rating } from 'react-native-elements';
import { Text } from 'react-native-paper';
import { toTitleCase } from '../utils';
import { itemImageUrl } from '../utils/utils';
import { logError, logInfo } from '../utils/logger'; // Import loggers

const ItemCard = (props: any) => {
    const {
        price,
        name,
        avatars,
        slug,
        discount,
        rating,
        itemSubCategory,
        itemCategory,
        capacity,
    } = props.item;

    // Log item details
    // logInfo(`Rendering ItemCard for ${name}`);

    const avatar = itemImageUrl + slug + "/" + avatars?.split(',')[0];

    return (
        <View style={style.main}>
          <View style={style.card}>
            <View style={style.cover}>
                <Image
                    style={style.cardCover}
                    resizeMode='contain'
                    source={{ uri: !!avatars ? avatar : props.url }} />
                <View style={style.discountLabel}>
                    <Text style={style.discountText}>{Math.floor((discount / price) * 100) + "% OFF"}</Text>
                </View>
            </View>
            <View style={style.badgeContainer}>
                {!!itemSubCategory ?
                    <Badge
                        textStyle={style.badgeText}
                        badgeStyle={style.badgeStyle}
                        status='primary'
                        value={toTitleCase(itemSubCategory.subcategory)}
                    /> :
                    <Badge
                        status='success'
                        value={itemCategory.category}
                        textStyle={style.badgeText}
                        badgeStyle={style.badgeStyle}
                    />}
                {!!itemSubCategory && !!itemSubCategory.unit && itemSubCategory.unit !== "null" ?
                    <Badge
                        textStyle={style.badgeText}
                        badgeStyle={style.unitBadgeStyle}
                        status='primary'
                        value={toTitleCase(capacity + itemSubCategory.unit)}
                    /> : null}
            </View>
            <Text style={style.itemTitle}>
                {toTitleCase(name.substring(0, 20)).trim()}
            </Text>
            <View style={style.ratingContainer}>
                <Rating type='custom' imageSize={15} readonly startingValue={rating} />
            </View>
            <View style={style.priceContainer}>
                <Text style={style.price}>{"\u20B9 " + (price - discount)}</Text>
                <Text style={style.actualPrice}>{"\u20B9 " + price}</Text>
            </View>
        </View>
        </View>
    );
}

const style = StyleSheet.create({
    main : {
        maxHeight: 300,
        minHeight: 250,
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignContent: 'center',
        backgroundColor: 'white'
        },
    cover: {
        height: 100,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
        marginHorizontal : 2
    },
    cardCover: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f5f9ff',
        borderRadius: 0.1 // this covering perfect for zooming instead of resizeMode = 'cover'
    },
    discountLabel: {
        position: 'absolute',
        top: 10,
        left: 0, // Removed spaces from left
        backgroundColor: '#4CAF50', // Improved green color for premium feel
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },
    discountText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    badgeContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    badgeText: {
        color: '#001475',
        fontSize: 10,
    },
    badgeStyle: {
        paddingHorizontal: 5,
        backgroundColor: '#f2f5fa',
    },
    unitBadgeStyle: {
        paddingHorizontal: 5,
        backgroundColor: '#f1f7ed',
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#333',
    },
    ratingContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginVertical: 5,
    },
    priceContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
    },
    actualPrice: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#939393',
        textDecorationLine: 'line-through',
        marginLeft: 5,
    },
});

export default ItemCard;