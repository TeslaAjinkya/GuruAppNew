import React, { Component } from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
    View,
    Text, Image,
    Button, ActivityIndicator,
    FlatList, SafeAreaView,
    Modal, Alert,
    TouchableOpacity,
} from 'react-native';
import { color } from '@values/colors';
import { strings } from '@values/strings';
import _Text from '@text/_Text';


export default class GiftSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <SafeAreaView style={{ height: hp(100), backgroundColor: color.white }}>

                <View style={{ height: hp(6), backgroundColor: color.white }}>
                    <View
                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                            style={{
                                flex: 0.1, paddingLeft: hp(3),
                            }}>
                            <Image
                                defaultSource={require('../../assets/img/close1.png')}
                                source={require('../../assets/img/close1.png')}
                                style={{ height: hp(2.5), width: hp(2.5) }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={require('../../assets/gif/success1.gif')}
                        style={{ height: hp(20), width: hp(20) }}
                    />
                    <View style={{ position: 'absolute', }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center', top: 5 }}>THANK YOU!</Text>
                    </View>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={require('../../assets/gif/success2.gif')}
                        style={{ height: hp(50), width: hp(50) }}
                    />
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>YOU HAVE SUCCESSFULLY SENT GIFT !!!</Text>
                    {/* <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', top: 5 }}>TO AJINKYA</Text> */}

                </View>

            </SafeAreaView>
        );
    }
}
