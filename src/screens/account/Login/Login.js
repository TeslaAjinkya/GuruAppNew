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
import { signInRequestNormal, signInRequestFb, signInRequestGoogle } from "@login/LoginAction";
import _InputBox from '@inputBox/_InputBox';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment'

const { width, height } = Dimensions.get('window')
var base64ProfileUrl
var base64ProfileUrlGoogle


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            isPassword: false,
            emailId: '',
            isEmail: false,
            successLoginVersion: 0,
            errorLoginVersion: 0,
            userInfo: '',
        }
    }

    componentDidMount = () => {
        GoogleSignin.configure({
            offlineAccess: false,
            scopes: ['https://www.googleapis.com/auth/userinfo.profile'],
            webClientId: "576795723071-46tu64ouqibmm2sh0i0cvh1mhtrfau4m.apps.googleusercontent.com",
            iosClientId: "576795723071-kd0sv5df98fud6rg9f8btm15dnd5rig5.apps.googleusercontent.com"
        });

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const {
            successLoginVersion, errorLoginVersion
        } = nextProps;
        let newState = null;

        if (successLoginVersion > prevState.successLoginVersion) {

            newState = {
                ...newState,
                successLoginVersion: nextProps.successLoginVersion,
            };
        }
        if (errorLoginVersion > prevState.errorLoginVersion) {
            newState = {
                ...newState,
                errorLoginVersion: nextProps.errorLoginVersion,
            };
        }


        return newState;
    }


    async componentDidUpdate(prevProps, prevState) {

        if (this.state.successLoginVersion > prevState.successLoginVersion) {
            if (this.props.loginData.userProfile[0].verified && this.props.loginData.userProfile[0].verified === 'N') {
                this.props.navigation.navigate('MobileScreen', { token: this.props.loginData.accessToken ? this.props.loginData.accessToken : '' })
            }
            else if (this.props.loginData.userProfile[0].verified && this.props.loginData.userProfile[0].verified === 'Y') {
                this.showToast("Login Successfull", 'success')
                this.props.navigation.navigate('HomePage')
            } else {
                this.showToast("Login Successfull", 'success')
                this.props.navigation.navigate('HomePage')
            }
        }

        if (this.state.errorLoginVersion > prevState.errorLoginVersion) {
            this.showToast(this.props.errorMsg, 'danger')
        }
    }


    onInputChanged = ({ inputKey, isValid, value }) => {
        let validationKey = "";
        switch (inputKey) {

            case "emailId":
                validationKey = "isEmailId";
                break;

            case "password":
                validationKey = "isPassword";
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

    //  MANUAL LOGIN BY EMAIL PASSWORD

    loginPress() {
        const {
            password,
            isPassword,
            emailId,
            isEmailId,
        } = this.state;
        let error = "";
        try {

            if (!isEmailId) {
                error = "Please enter Valid EmailId";
                throw new Error();
            }
            if (password == "") {
                error = "Please enter Valid Password";
                throw new Error();
            }
            else {
                this.props.signInRequestNormal({ emailId, password })
            }
        } catch (err) {
            this.showToast(error, 'danger')
        }
    }


    // LOGIN BY GOOGLE

    googleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();

            const userInfo = await GoogleSignin.signIn();

            // await GoogleSignin.clearCachedToken(userInfo.idToken);

            //const { accessToken } = await GoogleSignin.getTokens();

            var first_name = userInfo.user.givenName
            var last_name = userInfo.user.familyName
            var email = userInfo.user.email
            var photo = userInfo.user.photo
            var token = userInfo.idToken

            await RNFetchBlob.fetch('GET', photo, {
            }).then((res) => {
                let status = res.info().status;
                if (status == 200) {
                    let base64Str = res.base64()
                    base64ProfileUrlGoogle = photo ? 'data:' + 'image/jpeg' + ';base64,' + base64Str : undefined;
                }
            })
            await this.props.signInRequestGoogle({ email, first_name, last_name, token, base64ProfileUrlGoogle })

        } catch (error) {
            console.log("error", error);

            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                this.showToast('You have cancelled Sign in progress', 'danger')
            } else if (error.code === statusCodes.IN_PROGRESS) {
                this.showToast('Sign in is in progress already', 'danger')
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                this.showToast('Play services not available or outdated', 'danger')
            } else {
                this.showToast(strings.serverFailedMsg, 'danger')
            }
        }
    };

    // FB LOGIN

    fbSignIn = () => {
        const that = this
        LoginManager.logInWithPermissions(["public_profile", 'email', 'user_birthday']).then(
            function (result) {
                if (result.isCancelled) {
                    that.showToast('You have cancelled Sign in progress', 'danger')
                } else {
                    AccessToken.getCurrentAccessToken().then((data) => {
                        const accessToken = data.accessToken;
                        if (accessToken) {
                            AsyncStorage.setItem('USER_DATA', JSON.stringify({ accessToken: data.accessToken, userID: data.userID }));
                        }

                        const responseInfoCallback = (error, result) => {
                            console.log("result=====", result);

                            if (error) {
                                that.showToast(error.toString(), 'danger')
                                console.log('Error fetching data=', error.toString());
                            } else {
                                console.log('Success fetching data=', result);
                                that.signInWithFb(result, accessToken)
                            }
                        };
                        const infoRequest = new GraphRequest(
                            '/me',
                            {
                                accessToken,
                                parameters: {
                                    fields: {
                                        string: 'email,name,first_name,middle_name,last_name,picture,birthday',
                                    },
                                },
                            },
                            responseInfoCallback,
                        );
                        new GraphRequestManager().addRequest(infoRequest).start();
                    });
                }
            },
            function (error) {
                that.showToast(error.toString(), 'danger')
            }
        );
    }


    signInWithFb = async (data, accessToken) => {

        const { email, first_name, last_name, birthday } = data
        const profilePic = data.picture && data.picture.data && data.picture.data.url ? data.picture.data.url : ''

        var dob = moment(birthday).format("DD-MM-YYYY")

        await RNFetchBlob.fetch('GET', profilePic, {
        }).then((res) => {
            let status = res.info().status;
            if (status == 200) {
                let base64Str = res.base64()
                base64ProfileUrl = profilePic ? 'data:' + 'image/png' + ';base64,' + base64Str : undefined;
            }
        })
        if (data.id) {
            await this.props.signInRequestFb({ email, first_name, last_name, dob, accessToken, base64ProfileUrl })
        }
        else {
            this.showToast("Server error, Please try again")
        }
    }


    render() {
        const { emailId, password } = this.state
        const { container, appNameView, mainView, fbLogo, userNameView, passwordView, btnView, getHelp,
            nextBtn, continueView, apiButtonMainView, fbView, apiButton,
            googleView, borderLine, dontHaveView } = LoginStyle

        const height = hp(18)
        const width = wp(100) + 40
        const profileTop = height - hp(5)

        return (
            <SafeAreaView style={container}>
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
                        <View style={appNameView}>
                            <_Text fsLogoName bold textColor={color.black}>{strings.appName}</_Text>
                        </View>
                    </View>

                    <View style={mainView}>
                        <View style={userNameView}>
                            <_InputBox label={"Email Id"}
                                maxLength={50}
                                minLength={3}
                                type="emailId"
                                inputKey="emailId"
                                value={emailId ? emailId : null}
                                onChangeText={this.onInputChanged} keyboardType="email-address"></_InputBox>
                        </View>

                        <View style={passwordView}>
                            <_InputBox maxLength={20}
                                minLength={6}
                                type="password"
                                inputKey="password"
                                value={password ? password : null}
                                secureText={true}
                                secureTextEntry
                                label={"Password"}
                                onChangeText={this.onInputChanged}></_InputBox>
                        </View>

                        <View style={btnView}>
                            <TouchableOpacity
                                onPress={() => this.loginPress()}
                                style={[nextBtn, { backgroundColor: color.loginColor }]}>
                                <_Text textColor={color.white}>Login</_Text>
                            </TouchableOpacity>
                        </View>
                        <View style={getHelp}>
                            <_Text fsSmall textColor={color.teritary}>Forgot password ?</_Text>

                            <TouchableOpacity onPress={() => this.props.navigation.navigate("ForgotPassword")}>
                                <_Text fsSmall textColor={color.loginColor}>{' '} Get Help</_Text>
                            </TouchableOpacity>
                        </View>
                        <View style={continueView}>
                            <_Text fsSmall textColor={color.lightGray}>Or continue with</_Text>
                        </View>

                        <View style={apiButtonMainView}>
                            <View style={fbView}>
                                <TouchableOpacity style={apiButton}
                                    onPress={() => this.fbSignIn()}>
                                    <Image style={fbLogo}
                                        source={require('../../../assets/img/facebookLogo.png')}
                                    />
                                    <_Text fsPrimary fsHeading textColor={"#878684"}>Facebook</_Text>
                                </TouchableOpacity>
                            </View>

                            <View style={googleView}>
                                <TouchableOpacity style={apiButton}
                                    onPress={() => this.googleSignIn()}
                                >
                                    <Image style={fbLogo}
                                        source={require('../../../assets/img/googleLogo.png')}
                                    />
                                    <_Text fsPrimary fsHeading textColor={"#878684"}>Google</_Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={borderLine}></View>
                    <View style={dontHaveView}>
                        <_Text fsSmall textColor={color.teritary}>Don't have an account ? </_Text>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("Register")}>
                            <_Text fsSmall textColor={color.loginColor}>Sign Up</_Text>
                        </TouchableOpacity>
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
        successLoginVersion: state.loginReducer.successLoginVersion,
        errorLoginVersion: state.loginReducer.errorLoginVersion,
        loginData: state.loginReducer.loginData,

    };
}


export default connect(mapStateToProps, { signInRequestNormal, signInRequestFb, signInRequestGoogle })(Login);

//google signin response b like

// {
//     idToken: string,
//     serverAuthCode: string,
//     scopes: Array<string>, // on iOS this is empty array if no additional scopes are defined
//     user: {
//       email: string,
//       id: string,
//       givenName: string,
//       familyName: string,
//       photo: string, // url
//       name: string // full name
//     }
//   }


//TO GENERATE HASH KEY FOR FACEBOOK

//keytool -exportcert -alias androiddebugkey -keystore android/app/debug.keystore | openssl sha1 -binary | openssl base64
