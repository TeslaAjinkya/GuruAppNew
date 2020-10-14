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
import { validateEmail, validatePassword } from '@values/validate';
import { signInRequestWithMobileNo } from "@login/LoginAction";
import _InputBox from '@inputBox/_InputBox';



class MobileScreen extends Component {
    constructor(props) {
        super(props);
        const token = this.props.route.params.token

        this.state = {
            mobileNumber: '',
            isMobileNumber: false,
            userName: '',
            isUserName:false,
            successLoginVersioMobile: 0,
            errorLoginVersionMobile: 0,
            userInfo: '',
            token:token
        }
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        const {
            successLoginVersioMobile, errorLoginVersionMobile
        } = nextProps;
        let newState = null;

        if (successLoginVersioMobile > prevState.successLoginVersioMobile) {

            newState = {
                ...newState,
                successLoginVersioMobile: nextProps.successLoginVersioMobile,
            };
        }
        if (errorLoginVersionMobile > prevState.errorLoginVersionMobile) {
            newState = {
                ...newState,
                errorLoginVersionMobile: nextProps.errorLoginVersionMobile,
            };
        }


        return newState;
    }


    async componentDidUpdate(prevProps, prevState) {

        if (this.state.successLoginVersioMobile > prevState.successLoginVersioMobile) {
            if (this.props.loginData.userProfile[0].verified === "Y") {
                this.showToast("Login Successfull", 'success')
                this.props.navigation.navigate('HomePage')
            }
        }

        if (this.state.errorLoginVersionMobile > prevState.errorLoginVersionMobile) {

            this.showToast(this.props.errorMsg, 'danger')

        }
    }


    onInputChanged = ({ inputKey, isValid, value }) => {
        let validationKey = "";
        switch (inputKey) {

            case "mobileNumber":
                validationKey = "isMobileNumber";
                break;

                case "userName":
                    validationKey = "isUserName";
                    break;

            default:
                break;
        }

        this.setState({
            [inputKey]: value,
            [validationKey]: isValid,
        });

    };

    renderLoader() {
        const { loaderView } = LoginStyle
        return (
            <View style={loaderView}>
                <ActivityIndicator size="large" color={color.lightGray} />
            </View>
        )
    }

    showToast = (msg, type, duration) => {
        Toast.show({
            text: msg ? msg : 'Server error, Please try again',
            type: type ? type : "danger",
            duration: duration ? duration : 2500
        });
    }

    onNextPress = () =>{
        const {
            mobileNumber,
            isMobileNumber,
            userName,
            isUserName,
            token
        } = this.state;
        
        let error = "";
        try {
            if (!isMobileNumber) {
                error = "Please enter valid Mobile Number";
                throw new Error();
            }
            if (!isUserName) {
                error = "Please enter Valid User Name";
                throw new Error();
            }
            else {
                this.props.signInRequestWithMobileNo({ userName, mobileNumber,token })
            }
        } catch (err) {
            console.log("err", err);

            this.showToast(error, 'danger')
           
        }
    }


    render() {
        const { userName, mobileNumber } = this.state
        const { container, appNameView, mainView, fbLogo, userNameView, passwordView, btnView, nextBtn, continueView, apiButtonMainView, fbView, apiButton,
            googleView, borderLine, dontHaveView } = LoginStyle

            const height = hp(18)
            const width = wp(100)+40
            const profileTop = height - hp(5)
        
        return (
            <SafeAreaView style={container}>
                <View>
                    <View style={{
                        backgroundColor: color.disabledLoginColor,
                        height: height, top: -10, left: -20,
                        width: width,
                        borderBottomLeftRadius: (height + width) / 2,
                        borderBottomRightRadius: (height + width) / 2
                    }}>
                                    
                    <View style={appNameView}>
                        <_Text fsLogoName bold textColor={color.black}>{strings.appName}</_Text>
                    </View>
                    </View>

                    <View style={mainView, { paddingTop: hp(15), }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <_InputBox label={"Mobile Number"}
                                maxLength={10}
                                minLength={10}
                                type="mobileNumber"
                                inputKey="mobileNumber"
                                keyboardType="email-address"
                                value={mobileNumber ? mobileNumber : null}
                                onChangeText={this.onInputChanged}></_InputBox>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop:hp(2)}}>
                            <_InputBox label={"User Name"}
                                maxLength={10}
                                minLength={3}
                                type="userName"
                                inputKey="userName"
                                value={userName ? userName : null}
                                onChangeText={this.onInputChanged}
                                style={{ borderRadius: 3 }} ></_InputBox>
                        </View>

                        <View style={btnView}>
                            <TouchableOpacity
                                //disabled={!mobileNumber || !userName}
                                onPress={() => this.onNextPress()}
                                style={[nextBtn, { backgroundColor: color.loginColor }]}>
                                <_Text textColor={color.white}>Next</_Text>
                            </TouchableOpacity>
                        </View>
                       </View>
                       </View>
                {
                    this.props.isFetching == true && this.renderLoader()
                }
            </SafeAreaView>

        );
    }
}




function mapStateToProps(state) {
    return {
        isFetching: state.loginReducer.isFetching,
        error: state.loginReducer.error,
        errorMsg: state.loginReducer.errorMsg,
        successLoginVersioMobile: state.loginReducer.successLoginVersioMobile,
        errorLoginVersionMobile: state.loginReducer.errorLoginVersionMobile,
        loginData: state.loginReducer.loginData,
    };
}


export default connect(mapStateToProps, {signInRequestWithMobileNo} )(MobileScreen);