import React, { Component, createRef } from 'react';
import {
    Text, View, Image, StyleSheet, Animated,
    Modal, SafeAreaView, TouchableOpacity, FlatList, Dimensions, Platform
} from 'react-native';
import _Container from '@container/_Container'
import Register from '@register/Register'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import _Text from '@text/_Text'
import Post from '@post/Post'
import { color } from '@values/colors';
import { Slider } from 'react-native-elements';



function secondsToTime(time) {
    return ~~(time / 60) + ":" + (time % 60 < 10 ? "0" : "") + time % 60;
}


export default class PostVideoControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

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

    playOrPause = async () => {
        if (this.props.playing) {
            await this.props.onPause()
        }
        else {
            await this.props.onPlay()
        }
    }


    render() {

        const { playing, currentTime, onSlideStart, onSlideComplete, duration, playableTime } = this.props

        const position = this.getMinutesFromSeconds(currentTime);
        const fullDuration = this.getMinutesFromSeconds(duration);


        return (
            <View style={styles2.controls}>
                <TouchableOpacity onPress={() => this.playOrPause()}>
                    {playing ?
                        <Image
                            source={require('../../assets/img/pause.png')}
                            defaultSource={require('../../assets/img/pause.png')}
                            style={{ height: 15, width: 15 }}
                        />
                        :
                        <Image
                            defaultSource={require('../../assets/img/play.png')}
                            source={require('../../assets/img/play.png')}
                            style={{ height: 15, width: 15 }}
                        />
                    }
                </TouchableOpacity>

                <View style={{
                    left: 10, right: 10, width: wp(65)
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
                            trackStyle={{ height: 5, }}
                            thumbStyle={{ height: 0, width: 0, borderRadius: 0 / 2 }}
                            thumbTouchSize={{ height: 0, width: 0 }}
                        />
                    </View>
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0, right: 10,
                        width: wp(65),
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
                            thumbTouchSize={{ height: 16, width: 16 }}
                        />
                    </View>

                </View>

                <View style={styles2.timeWrapper}>
                    <Text style={styles2.time}>{position} / </Text>
                    <Text style={styles2.time}>{fullDuration}</Text>
                </View>
            </View>

        )
    }
}


const styles2 = StyleSheet.create({
    controls: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        height: 48,
        left: 0,
        top: hp(22),
        bottom: 0,
        right: 0,
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 10,
    },
   
    timeWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
        marginLeft:10
    },
    time: {
        fontSize: 13,
        fontWeight: 'bold',
        color: "#FFF",
        paddingLeft: 2,
    },

});

// <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'flex-end' }}>
// <TouchableOpacity
//     style={styles2.touchable}
//     onPress={() => this.playOrPause()}
// >
//     {playing ?
//         <Image
//             source={require('../../assets/img/pause.png')}
//             defaultSource={require('../../assets/img/pause.png')}
//             style={{ height: 15, width: 15 }}
//         />
//         :
//         <Image
//             defaultSource={require('../../assets/img/play.png')}
//             source={require('../../assets/img/play.png')}
//             style={{ height: 15, width: 15 }}
//         />
//     }
// </TouchableOpacity>

// <View style={styles2.timeWrapper}>
//     <Text style={styles2.time}>{position}</Text>
//     <Text style={styles2.time}>{fullDuration}</Text>
// </View>

// <View style={{
//     position: 'absolute',
//     left: 30, right: 30, width: wp(80)
// }}>
//     <View>
//         <Slider
//             value={playableTime}
//             minimumValue={0}
//             maximumValue={duration}
//             step={1}
//             onValueChange={this.handleOnSlide}
//             onSlidingStart={onSlideStart}
//             onSlidingComplete={onSlideComplete}
//             minimumTrackTintColor={'#808080'}
//             maximumTrackTintColor={'#FFFFFF'}
//             trackStyle={{ height: 5, }}
//             thumbStyle={{ height: 0, width: 0, borderRadius: 0 / 2 }}
//             thumbTouchSize={{ height: 0, width: 0 }}
//         />
//     </View>
//     <View style={{
//         position: 'absolute',
//         top: 0,
//         left: 30, right: 20,
//         width: wp(80),
//         transform: [{ 'translate': [0, 0, 1] }]
//     }}>

//         <Slider
//             value={currentTime}
//             minimumValue={0}
//             maximumValue={duration}
//             step={1}
//             onValueChange={this.handleOnSlide}
//             onSlidingStart={onSlideStart}
//             onSlidingComplete={onSlideComplete}
//             minimumTrackTintColor={'#F44336'}
//             maximumTrackTintColor={'transparent'}
//             thumbTintColor={'#F44336'}
//             trackStyle={{ height: 5, }}
//             thumbStyle={{ height: 14, width: 14, borderRadius: 14 / 2 }}
//             thumbTouchSize={{ height: 16, width: 16 }}
//         />
//     </View>

// </View>
// </View>
