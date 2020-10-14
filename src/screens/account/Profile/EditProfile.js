import React, { Component } from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
    View,
    Text,
    Image, Button, ActivityIndicator,
    FlatList, SafeAreaView,
    Modal,
    Alert, ScrollView,
    TouchableOpacity,
} from 'react-native';
import { color } from '@values/colors';
import { strings } from '@values/strings';
import _Text from '@text/_Text';
import { Toast, ActionSheet } from 'native-base';
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

import { connect } from 'react-redux'
import _InputBox from '@inputBox/_InputBox'
import DateTimePicker from "react-native-modal-datetime-picker";
import Moment from "moment";
import { urls } from '@api/urls';
import { updateProfile } from '@profile/ProfileAction'
import { viewProfile } from '@profile/ProfileAction';


var SelectedDatePicker = ''

const options = {
    title: 'Upload Profile Picture',
    customButtons: [{ name: 'profile', title: 'Choose Photo from Gallery' }],
};

var BUTTONS = ['Take Photo', 'Choose from Library', 'Cancel'];
var DESTRUCTIVE_INDEX = 2;
var CANCEL_INDEX = 2;


class EditProfile extends Component {
    constructor(props) {
        super(props);

        const userDetails = this.props.route.params.data[0]

        this.state = {
            isDatePickerVisible: false,
            datePicked: strings.dateOfBirth,
            maxDate: new Date(),
            profilePhoto: userDetails ? userDetails.userpic : '',
            profilePhotoTwo: '',
            firstName: userDetails ? userDetails.firstName : '',
            isFirstName: false,
            lastName: userDetails ? userDetails.lastName : '',
            isLastName: false,
            userName: userDetails ? userDetails.userName : '',
            isUserName: false,
            isDateBirth: false,
            mobileNumber: userDetails ? userDetails.mobileNumber : '',
            isMobileNumber: false,
            emailId: userDetails ? userDetails.emailId : '',
            isEmailId: false,
            dob: userDetails ? userDetails.dob : '',
            updateProfileData: '',
            errorUpdateProfileVersion: 0,
            successUpdateProfileVersion: 0,
            successViewProfileVersion: 0
        }
        userId = global.userId
        SelectedDatePicker = new Date()

    }

    static getDerivedStateFromProps(nextProps, prevState) {

        const { successUpdateProfileVersion, successViewProfileVersion, errorUpdateProfileVersion } = nextProps;
        let newState = null;

        if (successUpdateProfileVersion > prevState.successUpdateProfileVersion) {
            newState = {
                ...newState,
                successUpdateProfileVersion: nextProps.successUpdateProfileVersion,
                // firstName:prevState.firstName,
                // lastName:prevState.lastName,
                // userName:prevState.userName,
                // emailId:prevState.emailId,
                // mobileNumber:prevState.mobileNumber,
                // dob:prevState.dob,
                // profilePhoto:prevState.profilePhoto,
                // profilePhotoTwo:prevState.profilePhotoTwo.uri ?prevState.profilePhotoTwo.uri :''

            };
        }


        if (errorUpdateProfileVersion > prevState.errorUpdateProfileVersion) {
            newState = {
                ...newState,
                errorUpdateProfileVersion: nextProps.errorUpdateProfileVersion,
            };
        }
        if (successViewProfileVersion > prevState.successViewProfileVersion) {
            newState = {
                ...newState,
                successViewProfileVersion: nextProps.successViewProfileVersion,
            };
        }

        return newState;
    }

    async componentDidUpdate(prevProps, prevState) {
        const { errorUpdateProfileMsg, successUpdateProfileMsg } = this.props;

        var requestPayload = {
            payload: {
                userId: global.userId,
                startLimit: '0',
            },
        };

        if (this.state.successUpdateProfileVersion > prevState.successUpdateProfileVersion) {
            await this.props.viewProfile(requestPayload)
        }
        if (this.state.successViewProfileVersion > prevState.successViewProfileVersion) {
            this.showToast(successUpdateProfileMsg, 'success')
        }
        if (this.state.errorUpdateProfileVersion > prevState.errorUpdateProfileVersion) {
            Toast.show({
                text: errorUpdateProfileVersion.msg ? errorUpdateProfileVersion.msg : 'Server error, Please try again',
                type: "danger",
                duration: 2500
            });
        }
    }


    onInputChanged = ({ inputKey, isValid, value }) => {

        let validationKey = "";
        switch (inputKey) {
            case "firstName":
                validationKey = "isFirstName";
                break;

            case "lastName":
                validationKey = "isLastName";
                break;

            case "dob":
                validationKey = "isDob";
                break;

            default:
                break;
        }
        //debugger
        this.setState({
            [inputKey]: value,
            [validationKey]: isValid
        });
    };


    updateProfile = async () => {
        const { firstName, isFirstName, lastName, isLastName, isDob, dob, datePicked,
            profileData, profilePto, profilePhotoTwo, userName
        } = this.state;

        let error = "";
        try {
            if (!firstName) {
                error = 'Please enter First Name';
                throw new Error();
            }
            if (!lastName) {
                error = 'Please enter Last Name';
                throw new Error();
            }
            if (!userName) {
                error = 'Please enter User Name';
                throw new Error();
            } if (!dob) {
                error = 'Please select Date Of Birth';
                throw new Error();
            }
            var base46Profile = profilePhotoTwo ? 'data:' + profileData.mime + ';base64,' + profileData.data : undefined;
            // mime for crop picker
            // type for image picker nrmal

            var body = {
                firstName: firstName,
                lastName: lastName,
                profilePic: base46Profile ? base46Profile : '',
                dob: dob,
                userName: userName,
                userId: userId
            }

            await this.props.updateProfile(body)


        } catch (err) {

            Toast.show({
                text: error,
                type: "danger"
            });
        }
    }


    showToast = (msg, type, duration) => {
        Toast.show({
            text: msg ? msg : 'Server error, Please try again',
            type: type ? type : "danger",
            duration: duration ? duration : 2500
        });
    }


    uploadPic = () => {
        ImagePicker.showImagePicker(options, (response) => {
            if (response.error) {
            } else if (response.uri) {

                const source = { uri: response.uri };

                this.setState({
                    profilePhotoTwo: source,
                    profileData: response
                });
            }
        });
    }


    showActionSheet = () => {
        return ActionSheet.show(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                destructiveButtonIndex: DESTRUCTIVE_INDEX,
            },
            buttonIndex => {
                switch (buttonIndex) {
                    case 0: {
                        this.openCamera();
                        break;
                    }
                    case 1: {
                        this.openImagePicker();
                        break;
                    }
                }
            },
        );
    };


    openCamera = () => {
        ImagePicker.openCamera({
            width: wp(95),
            height: hp(35),
            cropping: false,
            includeBase64: true,
        }).then(image => {
            console.log("openCamera image", image);

            this.setState({
                profilePhotoTwo: image.path,
                profileData: image
            });
        });
    };


    openImagePicker = () => {
        ImagePicker.openPicker({
            width: wp(95),
            height: hp(35),
            includeBase64: true,
            cropping: false,
            mediaType: 'photo'
        }).then(image => {
            console.log("openImagePicker image", image);
            this.setState({
                profilePhotoTwo: image.path,
                profileData: image

            });
        });
    };


    showDatePicker = () => {
        this.setState({ isDatePickerVisible: true });
    };

    hideDatePicker = () => this.setState({ isDatePickerVisible: false });

    handleDatePicked = date => {
        Moment.locale("en");

        var dateStr = Moment(date).format('DD-MM-YYYY');

        SelectedDatePicker = new Date(Moment(dateStr, 'DD-MM-YYYY').format('MM-DD-YYYY'));

        this.setState({ dob: dateStr, datePicked: dateStr, isDatePickerVisible: false })
    };


    render() {

        const { datePicked, profilePhoto, profilePhotoTwo, firstName, lastName, userName, password, mobileNumber,
            emailId, disabledMobile, buttonDisabled, dob, isMobileNumber, isEmailId } = this.state
        const { isFetching } = this.props
        return (
            <SafeAreaView style={{ height: hp(100), backgroundColor: color.white }}>
                <View style={{ height: hp(6), backgroundColor: color.white }}>
                    <View
                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                            style={{
                                flex: 0.1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Image
                                defaultSource={require('../../../assets/img/left.png')}
                                source={require('../../../assets/img/left.png')}
                                style={{ height: hp(2.5), width: hp(2.5) }}
                            />
                        </TouchableOpacity>
                        <View style={{ flex: 0.8, alignItems: 'center' }}>
                            <_Text fsHeading bold textColor={color.tertiaryGray}>
                                {strings.editProfile}
                            </_Text>
                        </View>
                    </View>
                    <View
                        style={{
                            borderBottomWidth: wp(0.2),
                            borderBottomColor: color.videoBorderGray,
                        }}
                    />
                </View>

                <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ backgroundColor: color.white, height: hp(100), paddingTop: hp(2), alignItems: 'center' }}>

                        <View style={{ justifyContent: 'center', alignItems: 'center', top: 20 }}>
                            <TouchableOpacity onPress={() => this.showActionSheet()}>
                                {
                                    profilePhoto !== '' && profilePhotoTwo === '' ?
                                        <Image
                                            defaultSource={require('../../../assets/img/defaultImage.png')}
                                            source={{ uri: urls.baseUrl + profilePhoto }}
                                            style={{
                                                resizeMode: 'cover', borderWidth: 2, borderColor: color.borderOrange,
                                                height: hp(10), width: hp(10), borderRadius: hp(10) / 2
                                            }}
                                        /> :
                                        profilePhotoTwo !== '' ?
                                            <Image
                                                source={{ uri: profilePhotoTwo ? profilePhotoTwo : '' }}
                                                style={{
                                                    resizeMode: 'cover', borderWidth: 2, borderColor: color.borderOrange,
                                                    height: hp(10), width: hp(10), borderRadius: hp(10) / 2
                                                }}
                                            />
                                            :
                                            <Image
                                                defaultSource={require('../../../assets/img/defaultImage.png')}
                                                source={require('../../../assets/img/defaultImage.png')}
                                                style={{
                                                    resizeMode: 'cover', borderWidth: 2, borderColor: color.borderOrange,
                                                    height: hp(10), width: hp(10), borderRadius: hp(10) / 2
                                                }}
                                            />
                                }
                            </TouchableOpacity>
                            <_Text textColor={color.textNote} style={{ marginTop: hp(1) }}>Tap to change photo</_Text>
                        </View>

                        {/* <View>
                            <TouchableOpacity
                                hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                                onPress={() => this.uploadPic()}>
                                <Image
                                    source={require('../../../assets/img/edit2.png')}
                                    style={{
                                        resizeMode: 'cover', height: hp(2), width: hp(2),
                                        left: Platform.OS === 'ios' ? 50 : 45,
                                    }}
                                />
                            </TouchableOpacity>
                        </View> */}


                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: hp(8) }}>
                            <_InputBox label="First Name"
                                maxLength={20}
                                minLength={3}
                                type="firstName"
                                inputKey="firstName"
                                value={firstName ? firstName : null}
                                onChangeText={this.onInputChanged}
                                style={{ borderRadius: 3 }} ></_InputBox>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp(1.5) }}>
                            <_InputBox label="Last Name"
                                maxLength={20}
                                minLength={3}
                                type="lastName"
                                inputKey="lastName"
                                value={lastName ? lastName : null}
                                onChangeText={this.onInputChanged}
                                style={{ borderRadius: 3 }} ></_InputBox>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp(1.5) }}>
                            <_InputBox label="User Name"
                                maxLength={10}
                                minLength={10}
                                type="userName"
                                inputKey="userName"
                                value={userName ? userName : null}
                                onChangeText={this.onInputChanged}
                                style={{ borderRadius: 3 }} ></_InputBox>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp(1.5) }}>
                            <_InputBox label="Mobile Number"
                                disabled={true}
                                maxLength={10}
                                minLength={10}
                                type="mobileNumber"
                                inputKey="mobileNumber"
                                value={mobileNumber ? mobileNumber : null}
                                onChangeText={this.onInputChanged}
                                style={{ borderRadius: 3 }} ></_InputBox>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp(1.5) }}>
                            <_InputBox label="Email Id"
                                disabled={true}
                                maxLength={50}
                                minLength={10}
                                type="emailId"
                                inputKey="emailId"
                                value={emailId ? emailId : null}
                                onChangeText={this.onInputChanged}
                                style={{ borderRadius: 3 }} ></_InputBox>
                        </View>
                        <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: !dob ? 20 : 5 }}>
                            {dob !== '' && <Text style={{ color: color.textNote, marginLeft: !dob ? -5 : 2 }}>Date of Birth</Text>}

                            <TouchableOpacity onPress={() => this.showDatePicker()}>
                                <Text
                                    style={{
                                        fontSize: !dob ? 14 : hp(2), color: !dob ? color.textNote : color.teritaryGray,
                                        padding: 7, marginLeft: !dob ? -3 : 0
                                    }}>
                                    {!dob ? this.state.datePicked : this.state.dob}
                                </Text>
                                <View style={{
                                    borderTopColor: color.lightGray, borderTopWidth: hp(0.1),
                                    width: wp(90)
                                }} />
                            </TouchableOpacity>
                        </View>


                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp(2) }}>
                            <DateTimePicker
                                isVisible={this.state.isDatePickerVisible}
                                onConfirm={this.handleDatePicked}
                                onCancel={this.hideDatePicker}
                                format="DD-MM-YYYY"
                                maximumDate={this.state.maxDate}
                                date={SelectedDatePicker}
                            />
                        </View>


                        <View style={{ alignItems: 'center', height: hp(10), marginTop: hp(5) }}>
                            <TouchableOpacity onPress={() => this.updateProfile()}
                                style={{
                                    width: wp(90), borderRadius: 3, height: hp(6), alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: color.loginColor
                                }}>
                                <_Text textColor={color.white}>Update Profile</_Text>
                            </TouchableOpacity>
                        </View>


                    </View>
                    {
                        isFetching ? <View style={{ position: 'absolute', backgroundColor: 'transparent', height: hp(100), width: wp(100), alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator size="large" color={color.teritaryGray} />
                        </View> : null
                    }


                </ScrollView>

            </SafeAreaView>
        );
    }
}


function mapStateToProps(state) {
    return {
        isFetching: state.profileReducer.isFetching,
        updateProfileData: state.profileReducer.updateProfileData,
        errorUpdateProfile: state.profileReducer.errorUpdateProfile,
        errorUpdateProfileMsg: state.profileReducer.errorViewProfileMsg,
        successUpdateProfileMsg: state.profileReducer.successUpdateProfileMsg,
        successUpdateProfileVersion: state.profileReducer.successUpdateProfileVersion,
        errorUpdateProfileVersion: state.profileReducer.errorUpdateProfileVersion,
        successViewProfileVersion: state.profileReducer.successViewProfileVersion,

    };
}
const mapDispatchToProps = dispatch => ({
    updateProfile: payload => dispatch(updateProfile(payload)),
    viewProfile: payload => dispatch(viewProfile(payload)),

});
export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)
