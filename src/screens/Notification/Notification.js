import React, { Component } from 'react';
import {
    View, Text, SafeAreaView, Image, ActivityIndicator,
    ScrollView, FlatList, TouchableOpacity
} from 'react-native';
import _CustomHeader from '@customHeader/_CustomHeader'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import _Text from '@text/_Text';
import { connect } from 'react-redux';
import { color } from '@values/colors';
import { urls } from '@api/urls';
import { strings } from '@values/strings';


const data = [
    { id: '1', title: "Your first notification", date: '2020-07-08', image: require('../../assets/img/best.jpg') },
    { id: '2', title: "Your first notification", date: '2020-07-08', image: require('../../assets/img/best.jpg') },
    { id: '3', title: "Your first notification", date: '2020-07-08', image: require('../../assets/img/best.jpg') },
    { id: '4', title: "Your first notification", date: '2020-07-08', image: require('../../assets/img/best.jpg') },


]

export default class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }




    showNotifications = (item, index) => {

        return (
            <TouchableOpacity disabled={true} >
                <View style={{ paddingTop: hp(0.5), paddingBottom: hp(0.5) }}>
                    <View style={{ flexDirection: 'row', flex: 1, marginLeft: hp(1.5), marginRight: hp(0.5) }}>
                        <View style={{ flex: 0.25, justifyContent: 'flex-start', }}>
                            <Image
                                style={{
                                    height: hp(10), width: hp(10), borderRadius: 10,
                                    borderWidth: 0.4, borderColor: color.gray
                                }}
                                source={item.image}
                                resizeMode='cover'
                            />
                        </View>

                        <View style={{ alignContent: 'center', justifyContent: 'center', flex: 0.75 }}>
                            <_Text numberOfLines={2} fwPrimary
                                fsMedium style={{ marginRight: hp(3) }}>
                                Title: {item.title}
                            </_Text>
                            <_Text numberOfLines={2} fsPrimary
                                style={{ marginRight: hp(3), top: 2, }}>
                                Message: {item.title}
                            </_Text>
                            <View style={{ top: 5, justifyContent: 'space-between', flexDirection: 'row' }}>
                                <_Text numberOfLines={2} note
                                    style={{ marginRight: hp(3) }}>
                                    Date:{item.date}
                                </_Text>

                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            paddingTop: hp(0.8), marginLeft: wp(22), marginRight: wp(3),
                            alignSelf: 'stretch',
                            borderBottomColor: '#D3D3D3',
                            borderBottomWidth: 1,
                        }}
                    />
                </View>
            </TouchableOpacity>
        )
    }


    render() {

        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: color.white }}>
                <View style={{ height: hp(6), backgroundColor: color.white }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                            style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center', }}>
                            <Image
                                defaultSource={require('../../assets/img/left.png')}
                                source={require('../../assets/img/left.png')}
                                style={{ height: hp(2.5), width: hp(2.5) }}
                            />
                        </TouchableOpacity>
                        <View style={{ flex: 0.8, alignItems: 'center' }}>
                            <_Text fsHeading bold textColor={color.tertiaryGray}>
                                {strings.notification}
                            </_Text>
                        </View>
                    </View>
                    <View style={{ borderBottomWidth: wp(0.2), borderBottomColor: color.videoBorderGray }}
                    />
                </View>

                <View style={{ justifyContent: 'center', width: wp(100), paddingVertical: hp(1), flex: 1 }}>
                    <FlatList
                        data={data}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={item => item.id}
                        renderItem={({ item, index }) => (
                            this.showNotifications(item, index)
                        )}
                    />
                </View>

            </SafeAreaView>
        );
    }
}
