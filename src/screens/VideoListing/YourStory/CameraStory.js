import React, { Component } from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
    View, Text,
    Image, Button,
    ActivityIndicator,
    FlatList, SafeAreaView,
    Alert, TouchableOpacity,
} from 'react-native';
import { color } from '@values/colors';
import { strings } from '@values/strings';
import _Text from '@text/_Text';


export default class CameraStory extends Component {
    constructor(props) {
        super(props);
        const imageData = this.props.route.params.imageData;
        const image = this.props.route.params.image;

        this.state = {
            image: image,
        };
    }



    render() {
        const { image } = this.state

        return (
            <SafeAreaView style={{ height: hp(100), backgroundColor: '#DDDDDD' }}>

                <View style={{ height: hp(6), backgroundColor: '#DDDDDD' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                            style={{
                                top: hp(1), flex: 0.1, paddingLeft: hp(3),
                            }}>
                            <Image
                                defaultSource={require('../../../assets/img/close1.png')}
                                source={require('../../../assets/img/close1.png')}
                                style={{ height: hp(2.5), width: hp(2.5) }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: hp(80), top: hp(0.5), justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        style={{ height: hp(75), width: wp(100), resizeMode: 'cover' }}
                        source={image}
                        //source={require('../../../assets/img/story1.png')}
                        defaultSource={require('../../../assets/img/default.png')}
                    />
                </View>


                <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                    <TouchableOpacity>
                        <View style={{
                            top: hp(2),
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
