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
import { Toast, Container } from 'native-base';
import { connect } from 'react-redux'
import _InputBox from '@inputBox/_InputBox';
import moment from 'moment'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MobileScreen from '@forgotPassword/MobileScreen'
import EmailScreen from '@forgotPassword/EmailScreen'


const Tab = createMaterialTopTabNavigator();

function ForgotPasswordTabs() {
    return (
        <Tab.Navigator
            tabBarOptions={{
                labelStyle: { fontSize: hp(1.7), marginTop: hp(10), padding: 0, color: color.lightGray },
                indicatorStyle: { backgroundColor: color.black },
            }}>

            <Tab.Screen name="Mobile No." component={MobileScreen} />

            <Tab.Screen name="Email id" component={EmailScreen} />

        </Tab.Navigator>

    );
}



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
                <Container >
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


                    <ForgotPasswordTabs />


                </Container>
            </SafeAreaView>
        );
    }
}
