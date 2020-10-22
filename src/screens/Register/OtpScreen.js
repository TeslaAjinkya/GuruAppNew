import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Card, Input } from 'native-base'
import _InputBox from '@inputBox/_InputBox'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color } from '@values/colors';
import _Text from '@text/_Text'
import { SafeAreaView } from 'react-native-safe-area-context';

var param = ""
const cardMarginVertical = 4;
const cardMarginHorizontal = 10;
class OtpScreen extends Component {
    constructor(props) {
        super(props)
        if (this.props.route.params.mobileNo) {
            param = {
                key: "mobileNo",
                mobileNumber: this.props.route.params.mobileNo,
                success: true
            }
        }
        else {
            param = {
                key: "emailId",
                emailId: this.props.route.params.emailId,
                success: true
            }
        }


    }

    otpButtonPressed = () => {
        this.props.navigation.navigate('UserDetails', { param })
    }

    render() {
        return (
            <SafeAreaView>
                <View style={{ height: hp(100), backgroundColor: color.white, justifyContent: 'center' }}>
                    <View style={{ alignItems: 'center', marginTop: -hp(10) }}>
                        <Image
                            resizeMode={"contain"}
                            style={{ width: wp(30), height: hp(20), justifyContent: 'center', alignSelf: 'center' }}
                            source={require('../../assets/img/otpEmail.png')}
                        />
                        <_Text fsLarge bold textColor={color.tertiaryGray}>Verification</_Text>
                        <_Text fsHeading textColor={color.lightGray} style={{ marginTop: 20 }}>Enter OTP code sent to your {param.mobileNumber ? 'mobile number' : 'email'}</_Text>
                        <_Text fsHeading textColor={color.gray} style={{ marginTop: 5 }}>{param.mobileNumber ? param.mobileNumber : param.emailId}</_Text>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: hp(5) }}>
                        <Card style={{ width: wp(95), height: hp(30), borderRadius: 20 }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ height: hp(12), width: wp(20), marginLeft: wp(3), }}>
                                    <Input
                                        maxLength={1}
                                        minLength={1}
                                        placeholderTextColor={color.lightGray}
                                        keyboardType={"default"}
                                        style={{
                                            textAlign: 'center',
                                            paddingLeft: wp(5),
                                            fontWeight: 'bold',
                                            height: hp(12), width: wp(20), fontSize: hp(3), color: color.tertiaryGray,
                                            paddingRight: 25, borderWidth: 1.5, borderColor: "#b8b4b4",
                                            borderRadius: 10
                                        }} />
                                </View>
                                <View style={{ height: hp(12), width: wp(20), marginLeft: wp(3) }}>
                                    <Input
                                        maxLength={1}
                                        minLength={1}
                                        placeholderTextColor={color.lightGray}
                                        keyboardType={"default"}
                                        style={{
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            paddingLeft: wp(5),
                                            height: hp(12), width: wp(20), fontSize: hp(3), color: color.tertiaryGray,
                                            paddingRight: 25, borderWidth: 1.5, borderColor: "#b8b4b4",
                                            borderRadius: 10
                                        }} />
                                </View>
                                <View style={{ height: hp(12), width: wp(20), alignItems: 'center', justifyContent: 'center', marginLeft: wp(3) }}>
                                    <Input
                                        maxLength={1}
                                        minLength={1}
                                        placeholderTextColor={color.lightGray}
                                        keyboardType={"default"}
                                        style={{
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            paddingLeft: wp(5),
                                            height: hp(12), width: wp(20), fontSize: hp(3), color: color.tertiaryGray,
                                            paddingRight: 25, borderWidth: 1.5, borderColor: "#b8b4b4",
                                            borderRadius: 10
                                        }} />
                                </View>
                                <View style={{ height: hp(12), width: wp(20), marginLeft: wp(3) }}>
                                    <Input
                                        maxLength={1}
                                        minLength={1}
                                        placeholderTextColor={color.lightGray}
                                        keyboardType={"default"}
                                        style={{
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            paddingLeft: wp(5),
                                            height: hp(12), width: wp(20), fontSize: hp(3), color: color.tertiaryGray,
                                            paddingRight: 25, borderWidth: 1.5, borderColor: "#b8b4b4",
                                            borderRadius: 10
                                        }} />
                                </View>
                            </View>
                            <View style={{ alignItems: 'center', height: hp(10) }}>
                                <TouchableOpacity onPress={() => this.otpButtonPressed()} style={{ width: wp(50), borderRadius: 3, height: hp(7), alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: color.loginColor }}>
                                    <_Text textColor={color.white}>Next</_Text>
                                </TouchableOpacity>
                            </View>
                        </Card>

                    </View>

                </View>
            </SafeAreaView>
        )
    }
}

export default OtpScreen