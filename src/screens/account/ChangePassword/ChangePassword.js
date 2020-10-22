import React, { Component } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { urls } from '@api/urls';
import { color } from '@values/colors';
import { strings } from '@values/strings';
import _Text from '@text/_Text';
import { connect } from 'react-redux';
import _InputBox from '@inputBox/_InputBox';


export default class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmPassword: '',
            password: ''

        };
    }

    render() {
        const { confirmPassword, password } = this.state

        return (
            <SafeAreaView style={{ backgroundColor: color.white }}>
                <View style={{ height: hp(6), backgroundColor: color.white }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                            style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center', }}>
                            <Image
                                defaultSource={require('../../../assets/img/left.png')}
                                source={require('../../../assets/img/left.png')}
                                style={{ height: hp(2.5), width: hp(2.5) }}
                            />
                        </TouchableOpacity>
                        <View style={{ flex: 0.8, alignItems: 'center' }}>
                            <_Text fsHeading bold textColor={color.tertiaryGray}>
                                {strings.changePassword}
                            </_Text>
                        </View>
                    </View>
                    <View style={{ borderBottomWidth: wp(0.2), borderBottomColor: color.videoBorderGray }}
                    />
                </View>

                <View style={{ marginTop: hp(5) }}>
                    <_InputBox label={"Password"}
                        maxLength={20}
                        minLength={6}
                        type="password"
                        inputKey="password"
                        secureText={true}
                        value={password ? password : null}
                        onChangeText={this.onInputChanged}>
                    </_InputBox>
                </View>

                <View style={{ marginTop: hp(3) }}>
                    <_InputBox label={"New Password"}
                        maxLength={20}
                        minLength={6}
                        type="password"
                        inputKey="password"
                        secureText={true}
                        value={password ? password : null}
                        onChangeText={this.onInputChanged}>
                    </_InputBox>
                </View>

                <View style={{ marginTop: hp(2) }}>
                    <_InputBox label={"Confirm New Password"}
                        maxLength={20}
                        minLength={6}
                        secureText={true}
                        type="confirmPassword"
                        inputKey="confirmPassword"
                        value={confirmPassword ? confirmPassword : null}
                        onChangeText={this.onInputChanged}>
                    </_InputBox>
                </View>


                <View style={{ marginTop: hp(7), alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{
                            width: wp(90), borderRadius: 3, height: hp(7), alignItems: 'center', justifyContent: 'center',
                            backgroundColor: color.loginColor
                        }}>
                        <_Text textColor={color.white}>Change Password</_Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}
