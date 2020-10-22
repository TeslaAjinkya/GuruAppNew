import React, { Component } from 'react';
import Carousel, { Pagination, ParallaxImage, SliderEntry } from 'react-native-snap-carousel';
import jsonData from '../StoriesData';
import styles from '../Styles';
import { Modal, Dimensions, SafeAreaView, Platform } from 'react-native';
import { View, Text, Button, Icon } from 'native-base';

const SLIDER_1_FIRST_ITEM = 0;
const sliderWidth = Dimensions.get('window').width;
const itemHeight = Dimensions.get('window').height;


class Carausal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM
        };
    }
    goToNextSlide = (val) => {
        console.log("val");
        setTimeout(() => this._slider1Ref.snapToNext(), 250)
    }
    goToPrevSlide = (val) => {
        console.log(val);
        setTimeout(() => this._slider1Ref.snapToPrev(), 250)
    }
    closeModal = () => {
        this.setState({ modalVisible: false });
    }

    _renderItem = ({ item, index }, parallaxProps) => {
        return (
            <View style={styles.item}>
                <ParallaxImage
                    source={{ uri: item.illustration }}
                    containerStyle={styles.imageContainer}
                    style={styles.image}
                    parallaxFactor={0.4}
                    {...parallaxProps}
                />

            </View >
        );
    }
    render() {
        return (
            <SafeAreaView >
                <Button onPress={this.props.closeModal}
                    style={{
                        width: 50, zIndex: 999, height: 50, borderRadius: 25,
                        justifyContent: 'center', position: 'absolute',
                        top: Platform.OS === 'ios' ? 20 : 0, right: 0,
                        backgroundColor: 'white'
                    }}>
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 26 }}>X</Text>
                </Button>
                <View style={styles.exampleContainer}>

                    <Carousel
                        ref={c => this._slider1Ref = c}
                        hasParallaxImages={true}
                        loop={true}
                        loopClonesPerSide={2}
                        autoplay={true}
                        autoplayDelay={1000}
                        autoplayInterval={4000}
                        sliderWidth={sliderWidth}
                        sliderHeight={itemHeight}
                        itemWidth={sliderWidth}
                        data={jsonData.ENTRIES1}
                        renderItem={this._renderItem}
                        hasParallaxImages={true}
                        enableMomentum={true}
                        activeSlideOffset={2}
                        onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}

                    />
                    <Pagination
                        dotsLength={jsonData.ENTRIES1.length}
                        activeDotIndex={this.state.slider1ActiveSlide}
                        containerStyle={styles.paginationContainer}
                        dotColor={'red'}
                        dotStyle={styles.paginationDot}
                        inactiveDotColor={'black'}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                        carouselRef={this._slider1Ref}
                        tappableDots={this._slider1Ref}
                    // enableMomentum={true}

                    />
                </View>
            </SafeAreaView>
        );
    }
}

export default Carausal;