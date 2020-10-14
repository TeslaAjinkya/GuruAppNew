import React, {Component, createRef} from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
    View,
    Text,
    Image,
    Button,
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    Modal,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { color } from '@values/colors';
import { strings } from '@values/strings';
import _Text from '@text/_Text';
import _CustomHeader from '@customHeader/_CustomHeader'
import Video from 'react-native-video';


export default class VideoStory extends Component {
    constructor(props) {
        super(props);

        const selectedVideo = this.props.route.params.video;
        this.postVideoRef = createRef();

        this.state = {
            video: selectedVideo
        };
    }

    render() {
        const { video } = this.state
        console.log("video", video);

        return (
            <SafeAreaView style={{ height: hp(100), backgroundColor: '#DDDDDD' }}>

                <View style={{ height: hp(6), backgroundColor: '#DDDDDD' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                            style={{top:hp(1),flex: 0.1, paddingLeft: hp(3),
                            }}>
                            <Image
                                defaultSource={require('../../../assets/img/close1.png')}
                                source={require('../../../assets/img/close1.png')}
                                style={{ height: hp(2.5), width: hp(2.5) }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: hp(75), justifyContent: 'center', alignItems: 'center' }}>
                    <Video
                        ref={this.postVideoRef}
                        source={{ uri: video }}
                        style={{
                            aspectRatio:1,
                            width: "100%"
                        }}
                        resizeMode={'cover'}
                        repeat={true}
                        controlTimeout={3000}
                        paused={false}
                    />
                </View>

                <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <TouchableOpacity>
                        <View style={{top:hp(2),
                            height: hp(5), width: hp(12), borderRadius: 25,
                            backgroundColor: color.white, borderWidth: 0.5, borderColor: color.textNote,
                            alignItems: "center", justifyContent: 'center',
                            marginRight: hp(3)
                        }}>
                            <_Text fsHeading fwHeading>Post</_Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}
