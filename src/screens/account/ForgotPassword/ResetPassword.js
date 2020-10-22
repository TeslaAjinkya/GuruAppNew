import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View, ActivityIndicator,
    TextInput,
    Button,
    TouchableOpacity,
    Image, SafeAreaView,
    Alert, Dimensions, Keyboard, ColorPropType
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LoginStyle from '@login/LoginStyle'
import _Text from '@text/_Text'
import { color } from '@values/colors';
import { strings } from '@values/strings'
import { Toast } from 'native-base';
import { connect } from 'react-redux'
import _InputBox from '@inputBox/_InputBox';
import moment from 'moment'
import OTPInputView from '@twotalltotems/react-native-otp-input'

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailId: '',
            isEmail: false,
            confirmPassword: '',
            password: ''
        };
    }



    onInputChanged = ({ inputKey, isValid, value }) => {
        let validationKey = "";
        switch (inputKey) {

            case "emailId":
                validationKey = "isEmailId";
                break;

            default:
                break;
        }

        this.setState({
            [inputKey]: value,
            [validationKey]: isValid,
        });

    };

    loginPress = () => {
        console.log("ok");
    }


    render() {
        const { emailId, isEmail, confirmPassword, password } = this.state
        const height = hp(18)
        const width = wp(100) + 40
        const profileTop = height - hp(5)


        return (
            <SafeAreaView style={{ height: hp(100), backgroundColor: color.white }}>
                <View>
                    <View style={{
                        backgroundColor: color.disabledLoginColor,
                        height: height,
                        //top: -10,
                        left: -20,
                        width: width,
                        borderBottomLeftRadius: (height + width) / 2,
                        borderBottomRightRadius: (height + width) / 2
                    }}>
                        <View style={{ height: hp(20), justifyContent: 'center', alignItems: 'center' }}>
                            <_Text fsLogoName bold textColor={color.black}>{strings.appName}</_Text>
                        </View>
                    </View>

                </View>
                <View style={{ paddingTop: hp(5), justifyContent: 'center', alignItems: 'center' }}>
                    <OTPInputView
                        style={{ width: wp(85), height: hp(15) }}
                        pinCount={4}
                        code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                        onCodeChanged={code => { this.setState({ code }) }}
                        autoFocusOnLoad

                        codeInputFieldStyle={{
                            height: hp(12), width: wp(20), color: color.tertiaryGray,
                            marginRight: wp(2), fontSize: hp(3),
                            borderRadius: 10, borderWidth: 1.5, borderColor: "#b8b4b4",
                        }}

                        codeInputHighlightStyle={{ fontSize: hp(4), borderColor: color.loginColor }}

                        onCodeFilled={(code => {
                            console.log(`Code is ${code}, you are good to go!`)
                        })}
                    />

                    <View style={{ marginTop: hp(3) }}>
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

                    <View style={{ marginTop: hp(2) }}>
                        <_InputBox label={"Confirm Password"}
                            maxLength={20}
                            minLength={6}
                            secureText={true}
                            type="confirmPassword"
                            inputKey="confirmPassword"
                            value={confirmPassword ? confirmPassword : null}
                            onChangeText={this.onInputChanged}>
                        </_InputBox>
                    </View>

                </View>

                <View style={{ marginTop: hp(7), alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{
                            width: wp(90), borderRadius: 3, height: hp(7), alignItems: 'center', justifyContent: 'center',
                            backgroundColor: color.loginColor
                        }}>
                        <_Text textColor={color.white}>Reset Password</_Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        );
    }
}
