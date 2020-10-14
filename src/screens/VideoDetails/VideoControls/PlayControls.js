import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';


export default class PlayControls extends Component {
    constructor(props) {
        super(props)
        this.state = {
            previousDisabled: false,
            nextDisabled: false,
        }
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
        const { previousDisabled, nextDisabled } = this.state

        const { playing, showPreviousAndNext, showSkip, onPlay, onPause, skipForwards,
            skipBackwards, onNext, onPrevious } = this.props


        return (

            <View style={styles.wrapper}>
                {showPreviousAndNext && (
                    <TouchableOpacity
                        style={[styles.touchable, previousDisabled && styles.touchableDisabled]}
                        onPress={onPrevious}
                        disabled={previousDisabled}>
                        <Image source={require('../../../assets/img/heart.png')}
                            style={{ height: 30, width: 30 }}
                        />
                    </TouchableOpacity>
                )}

                {showSkip && (
                    <TouchableOpacity style={styles.touchable} onPress={skipBackwards}>
                        <Image 
                        defaultSource={require('../../../assets/img/backward.png')}
                        source={require('../../../assets/img/backward.png')}
                            style={{ height: 30, width: 30 }}
                        />
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.touchable}
                    // onPress={playing ? onPause : onPlay}
                    onPress={() => this.playOrPause()}
                >
                    {playing ?
                        <Image
                        defaultSource={require('../../../assets/img/pause.png')}
                        source={require('../../../assets/img/pause.png')}
                            style={{ height: 28, width: 28 }}
                        />
                        :
                        <Image
                            defaultSource={require('../../../assets/img/play.png')}
                            source={require('../../../assets/img/play.png')}
                            style={{ height: 28, width: 28 }}
                        />
                    }
                </TouchableOpacity>

                {showSkip && (
                    <TouchableOpacity style={styles.touchable} onPress={skipForwards}>
                        <Image 
                        defaultSource={require('../../../assets/img/forward.png')}
                        source={require('../../../assets/img/forward.png')}
                            style={{ height: 30, width: 30 }}
                        />
                    </TouchableOpacity>
                )}

                {showPreviousAndNext && (
                    <TouchableOpacity
                        style={[styles.touchable, nextDisabled && styles.touchableDisabled]}
                        onPress={onNext}
                        disabled={nextDisabled}>
                        <Image
                        defaultSource={require('../../../assets/img/googleLogo.png')}
                         source={require('../../../assets/img/googleLogo.png')}
                            style={{ height: 30, width: 30 }}
                        />
                    </TouchableOpacity>
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        paddingHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flex: 3,
    },
    touchable: {
        padding: 5,
    },
    touchableDisabled: {
        opacity: 0.3,
    },
});