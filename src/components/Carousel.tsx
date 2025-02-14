import React, { useState } from 'react'
import { Image, Text, View } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel';
import { logError, logInfo } from '../utils/logger' // Import logger

function CustomCarousel(props:any) {
    // State variable for current item index
    const [itemIndex,setIndex] = useState(0)

    // Function to handle index change
    const handleIndex = (index: number) => {
        setIndex(index)
        logInfo(`Carousel index set to ${index}`)
    }

    // Render component
    return (
        <View style={{
            display : 'flex',
            justifyContent : 'center',
            alignItems : 'center'
        }}>
            <Carousel
                loop
                width={375}
                height={320}
                autoPlay={false}
                data={props.images}
                scrollAnimationDuration={1000}
                onProgressChange={(_, absoluteProgress) => {
                    handleIndex(Math.round(absoluteProgress));
                }}
                renderItem={({ index,item }) => (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                        }}
                    >
                        <>
                        {item}
                        </>
                    </View>
                )}
            />

            <AnimatedDotsCarousel
                length={props.images.length}
                currentIndex={itemIndex}
                maxIndicators={props.images.length}
                interpolateOpacityAndColor={false}
                activeIndicatorConfig={{
                    color: '#EC3C4C',
                    margin: 3,
                    opacity: 1,
                    size: 8,
                }}
                inactiveIndicatorConfig={{
                    color: '#F96B2B',
                    margin: 3,
                    opacity: 0.5,
                    size: 8,
                }}
                decreasingDots={[
                    {
                        config: { color: '#F96B2B', margin: 3, opacity: 0.5, size: 6 },
                        quantity: 1,
                    },
                    {
                        config: { color: '#F96B2B', margin: 3, opacity: 0.5, size: 4 },
                        quantity: 1,
                    },
                ]}
            />
        </View> 
    )
}

export default CustomCarousel