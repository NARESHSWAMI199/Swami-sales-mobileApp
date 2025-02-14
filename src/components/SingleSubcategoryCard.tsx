import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { toTitleCase } from '../utils';
import { dummyImageUrl } from '../utils/utils';
import { logError, logInfo } from '../utils/logger'; // Import loggers

const SingleSubcategoryCard = (props: any) => {
    const [subcategory, setSubcategory] = useState<any>({})

    useEffect(() => {
        setSubcategory(props.subcategory)
        logInfo(`Subcategory set: ${props.subcategory.subcategory}`);
    }, [props.subcategory])

    return (
        <View style={style.card} >
            <View style={style.cover}>
                <Image
                    style={style.cardCover}
                    resizeMode='contain'
                    source={{ uri: !!subcategory.icon ? subcategory.icon : dummyImageUrl }} />
            </View>
            <Text style={style.itemTitle} >
                {toTitleCase(subcategory.subcategory)}
            </Text>
        </View>
    );
}

const style = StyleSheet.create({
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        // paddingHorizontal : 1,
        paddingBottom: 5
    },
    cardCover: {
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#d4defc',
        flex: 1
    },
    itemTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 5,
        textAlign: 'center'
    },
    cover: {
        height: 110,
        flex: 1,
        borderRadius: 10
    },
})

export default SingleSubcategoryCard;