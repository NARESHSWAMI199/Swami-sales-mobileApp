import React, { useState } from 'react'
import { Image, Text, View, StyleSheet } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import AnimatedDotsCarousel from 'react-native-animated-dots-carousel'
import { logError, logInfo } from '../utils/logger' // Import logger

function CustomCarousel(props: any) {
    // State variable for current item index
    const [itemIndex, setIndex] = useState(0)

    // Function to handle index change
    const handleIndex = (index: number) => {
        setIndex(index)
        logInfo(`Carousel index set to ${index}`)
    }

    // Render component
    return (
        <View style={styles.carouselContainer}>
            <Carousel
                loop
                width={375}
                height={320}
                autoPlay={false}
                data={props.images}
                scrollAnimationDuration={1000}
                onProgressChange={(_, absoluteProgress) => {
                    handleIndex(Math.round(absoluteProgress))
                }}
                renderItem={({ index, item }) => (
                    <View key={index} style={styles.carouselItem}>
                        <>
                        {item}
                        </>
                        <View style={styles.dotsOverlay}>
                            <AnimatedDotsCarousel
                                length={props.images.length}
                                currentIndex={itemIndex}
                                maxIndicators={props.images.length}
                                interpolateOpacityAndColor={false}
                                activeIndicatorConfig={{
                                    color: '#4A4A4A', // Muted dark color
                                    margin: 3,
                                    opacity: 1,
                                    size: 8,
                                }}
                                inactiveIndicatorConfig={{
                                    color: '#7A7A7A', // Muted dark color
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
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    carouselContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
        backgroundColor: '#fff', // Add background color
        borderRadius: 10, // Add border radius
        overflow: 'hidden', // Ensure content stays within the container
    },
    carouselItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        position: 'relative', // Add position relative
    },
    dotsOverlay: {
        position: 'absolute', // Position dots overlay absolutely
        bottom: 20, // Position at the bottom
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default CustomCarousel