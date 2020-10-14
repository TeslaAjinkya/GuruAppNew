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

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailId: '',
            isEmail: false,
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




    render() {
        const { emailId, isEmail } = this.state
        const height = hp(18)
        const width = wp(100) + 40
        const profileTop = height - hp(5)


        return (
            <SafeAreaView style={{ height: hp(100), backgroundColor: color.white }}>
                <View>
                    <View style={{
                        backgroundColor: color.disabledLoginColor,
                        height: height,
                        // top: -10,
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

                <View style={{ paddingTop: hp(16) }}>
                    <View style={{ marginTop: hp(1) }}>
                        <_InputBox label={"Email Id"}
                            maxLength={50}
                            minLength={3}
                            type="emailId"
                            inputKey="emailId"
                            value={emailId ? emailId : null}
                            onChangeText={this.onInputChanged} keyboardType="email-address">
                        </_InputBox>
                    </View>
                </View>

                <View style={{ marginTop: hp(5), alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('ResetPassword')}
                        style={{
                            width: wp(90), borderRadius: 3, height: hp(7), alignItems: 'center', justifyContent: 'center',
                            backgroundColor: color.loginColor
                        }}>
                        <_Text textColor={color.white}>Request OTP</_Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        );
    }
}
