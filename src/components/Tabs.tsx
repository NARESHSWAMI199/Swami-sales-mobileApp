import { Tab, TabView, Text, createTheme } from '@rneui/themed';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { itemsUrl } from '../utils/utils';
import { logError, logInfo } from '../utils/logger'; // Import loggers

interface Category {
    id: number,
    category: string,
    icon: string
}

const CategoryTabs = (props: any) => {
    const [index, setIndex] = useState(0);
    const [categories, setCategories] = useState([])

    useEffect(() => {
        axios.post(itemsUrl + "categories", { orderBy: 'id' })
            .then(res => {
                let categories = res.data;
                setCategories(categories)
                logInfo(`Fetched ${categories.length} categories`);
            })
            .catch(err => {
                logError(`Error fetching categories: ${!!err.response?.data.message ? err.response.data.message : err.message}`);
            })
    }, [])

    return (
        <View>
            <Tab value={index} onChange={(e) => setIndex(e)} variant='primary'>
                <Tab.Item
                    titleStyle={{ fontSize: 14, color: props.color, minWidth: 40 }}
                >
                    <Avatar
                        rounded
                        size={20}
                        source={{
                            uri: 'https://cdn-icons-png.freepik.com/512/7835/7835563.png'
                        }}
                    />
                    {"All"}
                </Tab.Item>

                {categories.map((category: Category, i) => {
                    return <Tab.Item
                        key={i}
                        titleStyle={{
                            fontSize: 14,
                            color: props.color,
                            minWidth: 40
                        }}
                    >
                        <Avatar
                            rounded
                            size={20}
                            source={{
                                uri: category.icon
                            }}
                        />
                        {category.category}
                    </Tab.Item>
                })}

            </Tab>

            <TabView value={index} onChange={setIndex} animationType="spring">
                <TabView.Item style={{ backgroundColor: 'red', width: '100%' }}>
                    <Text h1>Recent</Text>
                </TabView.Item>
                <TabView.Item style={{ backgroundColor: 'blue', width: '100%' }}>
                    <Text h1>Favorite</Text>
                </TabView.Item>
                <TabView.Item style={{ backgroundColor: 'green', width: '100%' }}>
                    <Text h1>Cart</Text>
                </TabView.Item>
            </TabView>
        </View>
    )
}

const theme = createTheme({
    darkColors: {
        primary: '#fff',
    },
    mode: 'light',
});

export default CategoryTabs;