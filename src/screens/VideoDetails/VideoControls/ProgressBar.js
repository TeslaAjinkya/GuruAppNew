import React, { Component } from 'react';
// import Slider from '@react-native-community/slider';
import { View, Text, StyleSheet } from 'react-native';
import { Slider } from 'react-native-elements';


export default class ProgressBar extends Component {

    getMinutesFromSeconds(time) {
        const minutes = time >= 60 ? Math.floor(time / 60) : 0;
        const seconds = Math.floor(time - minutes * 60);

        return `${minutes >= 10 ? minutes : '0' + minutes}:${
            seconds >= 10 ? seconds : '0' + seconds
            }`;
    }

    
    handleOnSlide = async (time) => {
        await this.props.onSlideCapture({ seekTime: time });
    }


    render() {
        const { duration, currentTime, onSlideStart, onSlideComplete, playableTime } = this.props

        const position = this.getMinutesFromSeconds(currentTime);
        const fullDuration = this.getMinutesFromSeconds(duration);
        const bufferredTime = this.getMinutesFromSeconds(playableTime);

        return (
            <View style={styles.wrapper}>
                <View style={styles.timeWrapper}>
                    <Text style={styles.timeLeft}>{position}</Text>
                    <Text style={styles.timeRight}>{fullDuration}</Text>
                </View>

                <View style={{
                    position: 'absolute',
                    top: 20,
                    left: 5, right: 5,

                }}>
                    <View>
                        <Slider
                            value={playableTime}
                            minimumValue={0}
                            maximumValue={duration}
                            step={1}
                            onValueChange={this.handleOnSlide}
                            onSlidingStart={onSlideStart}
                            onSlidingComplete={onSlideComplete}
                            minimumTrackTintColor={'#808080'}
                            maximumTrackTintColor={'#FFFFFF'}
                            // thumbTintColor={'#F44336'}
                            trackStyle={{ height: 5, }}
                            thumbStyle={{ height: 0, width: 0, borderRadius: 0 / 2 }}
                            thumbTouchSize={{ height: 0, width: 0 }}
                        />
                    </View>
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0, right: 0,
                        transform: [{ 'translate': [0, 0, 1] }]
                    }}>

                        <Slider
                            value={currentTime}
                            minimumValue={0}
                            maximumValue={duration}
                            step={1}
                            onValueChange={this.handleOnSlide}
                            onSlidingStart={onSlideStart}
                            onSlidingComplete={onSlideComplete}
                            minimumTrackTintColor={'#F44336'}
                            maximumTrackTintColor={'transparent'}
                            thumbTintColor={'#F44336'}
                            trackStyle={{ height: 5, }}
                            thumbStyle={{ height: 14, width: 14, borderRadius: 14 / 2 }}
                            thumbTouchSize={{ height: 15, width: 15 }}
                        />
                    </View>

                </View>


            </View>
        );

    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingHorizontal: 5,

    },
    timeWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 3,
        marginTop: 15
    },
    timeLeft: {
        flex: 1,
        fontSize: 14,
        color: '#FFFFFF',
        paddingLeft: 2,
    },
    timeRight: {
        flex: 1,
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'right',
        paddingRight: 2,
    },
});