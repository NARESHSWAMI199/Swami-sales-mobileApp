import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { storeUrl } from '../utils/utils';
import { useEffect, useState } from 'react';
import { toTitleCase } from '../utils';
import axios from 'axios';
import { logError, logInfo } from '../utils/logger'; // Import loggers

const style = StyleSheet.create({
    card: {
        width: '22%',
        shadowColor: "#000",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        paddingBottom: 8,
        shadowOpacity: 0.25,
        shadowRadius: 4.84,
        borderRadius: 20,
        elevation: 5,
        backgroundColor: 'white',
        textAlign: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 5,
    },
    cardCover: {
        width: 50,
        overflow: 'hidden',
        height: 50,
    },
    itemTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 8,
    },
    storeCategoryParent: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
        background: 'url("https://png.pngtree.com/png-clipart/20211202/ourmid/pngtree-christmas-luminous-effect-lamp-string-png-image_4048227.png")'
    },
})

const StoreCategoryCard = () => {
    const [categories, setCategories] = useState([])

    /** Get wholesale using user slug. */
    useEffect(() => {
        const getCategories = async () => {
            await axios.post(storeUrl + "categories", { orderBy: 'category' })
                .then(res => {
                    let categories = res.data;
                    setCategories(categories)
                    logInfo(`Fetched ${categories.length} store categories`);
                })
                .catch(err => {
                    logError(`Error fetching store categories: ${err.message}`);
                })
        }
        getCategories()
    }, [])

    return (
        <View style={style.storeCategoryParent}>
            {categories.map((category: any, i) => {
                return (
                    <View style={style.card} key={i}>
                        <Card.Cover
                            style={style.cardCover}
                            resizeMode='cover' source={{ uri: category.icon }} />
                        <Text variant="titleLarge" style={style.itemTitle} >
                            {toTitleCase(category.category)}
                        </Text>
                    </View>
                )
            })}
        </View>
    )
}

export default StoreCategoryCard;