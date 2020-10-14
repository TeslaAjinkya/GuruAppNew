import React, { Component } from 'react';
import { View, Image, Text, SafeAreaView, TouchableOpacity, Platform, Button, Dimensions, ScrollView, ActivityIndicator } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import _InputBox from '@inputBox/_InputBox'
import { Toast, Card, ActionSheet } from 'native-base'
import { strings } from '@values/strings'
import DateTimePicker from "react-native-modal-datetime-picker";
import _Text from '@text/_Text'
import { color } from '@values/colors';
import Moment from "moment";
import { Avatar } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';

import { registerUser } from '@register/UserDetailsAction'
import { connect } from 'react-redux'

var BUTTONS = ['Take Photo', 'Choose from Library', 'Cancel'];
var DESTRUCTIVE_INDEX = 2;
var CANCEL_INDEX = 2;



var currentDatePicker = "";
var SelectedDatePicker = "";
const DATE_FORMAT = "DD/MM/YYYY";
const FORMAT = "MM/DD/YYYY";
let currentDate = new Date();
let maxDate = currentDate;
var dateMsg = strings.dateOfBirth

var { width, height } = Dimensions.get('window')
const options = {
  title: 'Upload Profile Picture',
  customButtons: [{ name: 'profile', title: 'Choose Photo from Gallery' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};


class UserDetails extends Component {
  constructor(props) {

    super(props)
    this.state = {
      isDatePickerVisible: false,
      datePicked: dateMsg,
      maxDate: currentDate,
      profilePhoto: "",

      //
      firstName: "",
      isFirstName: false,
      lastName: "",
      isLastName: false,
      userName: "",
      isUserName: false,
      password: "",
      isPassword: false,
      isDateBirth: false,
      mobileNumber: "",
      isMobileNumber: false,
      emailId: "",
      isEmailId: false,
      disabledMobile: false,
      disabledEmail: false,
      buttonDisabled: true,
      dob: '',
      profileData: '',
      errorRegisterVersion: 0,
      successRegisterVersion: 0,
      imageUrl: '', imageData: ''

    }

    SelectedDatePicker = currentDate
  }

  componentDidMount() {
    const { mobileNumber, isMobileNumber, emailId, isEmailId } = this.state
    if (this.props.route.params.param.key === "mobileNo") {
      this.setState({ mobileNumber: this.props.route.params.param.mobileNumber, isMobileNumber: true, disabledMobile: true })
    }
    else {
      this.setState({ emailId: this.props.route.params.param.emailId, isEmailId: true, disabledEmail: true })
    }
  }


  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      successRegisterVersion, errorRegisterVersion
    } = nextProps;
    let newState = null;

    if (successRegisterVersion > prevState.successRegisterVersion) {
      newState = {
        ...newState,
        successRegisterVersion: nextProps.successRegisterVersion,
      };
    }
    if (errorRegisterVersion > prevState.errorRegisterVersion) {
      newState = {
        ...newState,
        errorRegisterVersion: nextProps.errorRegisterVersion,
      };
    }

    return newState;
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.state.successRegisterVersion > prevState.successRegisterVersion) {

      this.showToast("Registered Successfully", 'success', 2500)

      this.props.navigation.navigate('Login')
    }

    if (this.state.errorRegisterVersion > prevState.errorRegisterVersion) {
      console.log("in if ----");
      this.showToast(this.props.registerErrorMsg, 'danger')
    }
  }



  showToast = (msg, type, duration) => {
    Toast.show({
      text: msg ? msg : 'Server error, Please try again',
      type: type ? type : "danger",
      duration: duration ? duration : 2500
    });
  }

  onLoginPress() {
    this.props.navigation.navigate('Login')
  }

  showDatePicker = () => {
    this.setState({ isDatePickerVisible: true });
  };

  hideDatePicker = () => this.setState({ isDatePickerVisible: false });

  handleDatePicked = date => {

    Moment.locale("en");
    var dateStr = Moment(date).format(DATE_FORMAT);
    this.setState({ datePicked: dateStr, dob: dateStr })
    SelectedDatePicker = new Date(Moment(dateStr, DATE_FORMAT).format(FORMAT));

    this.hideDatePicker();
  };

  onInputChanged = ({ inputKey, isValid, value }) => {

    let validationKey = "";
    switch (inputKey) {
      case "firstName":
        validationKey = "isFirstName";
        break;

      case "lastName":
        validationKey = "isLastName";
        break;

      case "userName":
        validationKey = "isUserName";
        break;

      case "password":
        validationKey = "isPassword";
        break;

      case "emailId":
        validationKey = "isEmailId";
        break;

      case "mobileNumber":
        validationKey = "isMobileNumber";
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


  registerBtn = () => {
    const {
      firstName,
      isFirstName,
      lastName,
      isLastName,
      userName,
      isUserName,
      password,
      isPassword,
      isMobileNumber,
      mobileNumber,
      emailId,
      isEmailId,
      datePicked,
      profileData, profilePhoto
    } = this.state;

    console.warn("this.state", this.state);


    let error = "";
    try {
      // if (!profilePhoto) {
      //   error = "Please upload Profile Photo";
      //   throw new Error();
      // }
      if (!isFirstName) {
        error = "Please enter First Name";
        throw new Error();
      }
      if (!isLastName) {
        error = "Please enter Last Name";
        throw new Error();
      }
      if (!isUserName) {
        error = "Please enter Valid User Name";
        throw new Error();
      }
      if (!isPassword) {
        error = "Please enter Valid Password";
        throw new Error();
      }
      if (!isMobileNumber) {
        error = "Please enter Valid Mobile Number";
        throw new Error();
      }
      if (!isEmailId) {
        error = "Please enter Valid EmailId";
        throw new Error();
      }

      if (datePicked == dateMsg) {
        error = "Please enter Valid Date Of Birth";
        throw new Error();
      }
      else {

        var base46Profile = profilePhoto ? 'data:' + profileData.mime + ';base64,' + profileData.data : undefined;
        var verified = 'Y'
        var api = "0"

        var body = {
          firstName: firstName,
          lastName: lastName,
          profilePic: base46Profile ? base46Profile : '',
          mobileNumber: mobileNumber,
          emailId: emailId,
          username: userName,
          password: password,
          dob: datePicked,
          verified: 'Y',
          api: "0"
        }

        this.props.registerUser({ body }, { firstName, lastName, base46Profile, mobileNumber, emailId, userName, password, datePicked, verified, api })

      }
      //  this.props.navigation.navigate('HomePage')
      //this.props.checkDuplicateEntry(payload);

    } catch (err) {
      console.log("error register", err);

      Toast.show({
        text: error,
        type: "danger"
      });
    }
  }

  // uploadPic = () => {
  //   ImagePicker.showImagePicker(options, (response) => {

  //     console.log('Response = ', response);

  //     if (response.didCancel) {
  //       console.warn('User cancelled image picker');
  //     } else if (response.error) {
  //       console.warn('ImagePicker Error: ', response.error);
  //     } else if (response.customButton) {
  //       console.warn('User tapped custom button: ', response.customButton);
  //     } else if (response.uri) {

  //       const source = { uri: response.uri };
  //       this.setState({
  //         profilePhoto: source,
  //         profileData: response
  //       });
  //     }
  //   });


  // }


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
        //  imageUrl: image.path, imageData: image
        profilePhoto: image.path,
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
    }).then(image => {
      console.log("openImagePicker image", image);
      this.setState({
        // imageUrl: image.path, imageData: image 
        profilePhoto: image.path,
        profileData: image

      });
    });
  };

  render() {
    const { datePicked, profilePhoto, firstName, lastName, userName, password, mobileNumber,
      emailId, disabledEmail, disabledMobile, buttonDisabled, dob, isMobileNumber, isEmailId }
      = this.state
    const height = hp(18)
    const width = wp(100) + 40
    const profileTop = height - hp(5)
    const { isFetching } = this.props


    return (
      <SafeAreaView>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={{
            backgroundColor: color.white, height: hp(100), alignItems: 'center',
            //paddingTop:hp(5)
          }}>
            {/* <View>
              <_Text fsLogoName bold textColor={color.black}>{strings.appName}</_Text>
              </View> */}
            <View style={{
              backgroundColor: color.disabledLoginColor,
              height: height,
              //top: -10,
              width: width,
              borderBottomLeftRadius: (height + width) / 2,
              borderBottomRightRadius: (height + width) / 2
            }}>
              <View style={{ justifyContent: 'center', alignItems: 'center', top: profileTop }}>
                <TouchableOpacity
                  onPress={() => this.showActionSheet()}
                >
                  {
                    profilePhoto ?
                      <Image
                        defaultSource={require('../../assets/img/profilepic2.png')}
                        source={{ uri: profilePhoto ? profilePhoto : undefined }}
                        style={{ resizeMode: 'cover', borderWidth: 2, borderColor: color.borderOrange, height: hp(10), width: hp(10), borderRadius: hp(10) / 2 }}
                      /> : <Image
                        source={require('../../assets/img/defaultImage.png')}
                        style={{ resizeMode: 'cover', borderWidth: 2, borderColor: color.borderOrange, height: hp(10), width: hp(10), borderRadius: hp(10) / 2 }}
                      />
                  }

                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={{ marginLeft: hp(14), marginTop: hp(1.5) }}
              hitSlop={{ top: 30, bottom: 30, left: 10, right: 10 }}
              onPress={() => this.showActionSheet()}
            >
              <Image
                source={require('../../assets/img/edit2.png')}
                style={{ height: 20, width: 20, }}
              />
            </TouchableOpacity>


            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: hp(5) }}>
              <_InputBox label="First Name"
                maxLength={20}
                minLength={3}
                type="firstName"
                inputKey="firstName"
                value={firstName ? firstName : null}
                onChangeText={this.onInputChanged}
                style={{ borderRadius: 3 }} ></_InputBox>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
              <_InputBox label="Last Name"
                maxLength={20}
                minLength={3}
                type="lastName"
                inputKey="lastName"
                value={lastName ? lastName : null}
                onChangeText={this.onInputChanged}
                style={{ borderRadius: 3 }} ></_InputBox>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
              <_InputBox label="User Name"
                maxLength={10}
                minLength={10}
                type="userName"
                inputKey="userName"
                value={userName ? userName : null}
                onChangeText={this.onInputChanged}
                style={{ borderRadius: 3 }} ></_InputBox>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
              <_InputBox label="Password"
                secureText={true}
                maxLength={20}
                minLength={6}
                type="password"
                inputKey="password"
                value={password ? password : null}
                onChangeText={this.onInputChanged}
                style={{ borderRadius: 3 }} ></_InputBox>

            </View>

            {!this.props.route.params.param.mobileNumber &&
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
                <_InputBox label="Mobile Number"
                  maxLength={10}
                  minLength={10}
                  disabled={disabledMobile}
                  type="mobileNumber"
                  inputKey="mobileNumber"
                  value={mobileNumber ? mobileNumber : null}
                  onChangeText={this.onInputChanged}
                  style={{ borderRadius: 3 }} ></_InputBox>
              </View>
            }
            {!this.props.route.params.param.emailId && <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
              <_InputBox label="Email Id"
                maxLength={50}
                minLength={10}
                disabled={disabledEmail}
                type="emailId"
                inputKey="emailId"
                value={emailId ? emailId : null}
                onChangeText={this.onInputChanged}
                style={{ borderRadius: 3 }} ></_InputBox>
            </View>}
            <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: !dob ? 20 : 5 }}>
              {dob !== '' && <Text style={{ color: color.textNote, marginLeft: !dob ? -5 : 2 }}>Date of Birth</Text>}

              <TouchableOpacity onPress={() => this.showDatePicker()}>
                {/* <_Text dobFontSize style={{ padding: 7, marginLeft: -5 }} textColor={color.textNote}>
                        {!dob ? this.state.datePicked : this.state.dob}
                      </_Text> */}
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
              {/* <TouchableOpacity onPress={this.showDatePicker} style={{ backgroundColor: color.extraLightGray,
                                           justifyContent:'center',
                                           paddingLeft:wp(1),
                                           height: hp(6), width: wp(85),
                                            color: color.tertiaryGray,
                                           borderWidth: 0.8, 
                                           borderColor: color.secondaryGray}}>
                  <_Text fsSmall style={{ paddingRight: 25}} textColor={color.tertiaryGray}>{this.state.datePicked}</_Text>
                </TouchableOpacity> */}
              <DateTimePicker
                isVisible={this.state.isDatePickerVisible}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDatePicker}
                format="DD/MM/YYYY"
                maximumDate={this.state.maxDate}
                date={SelectedDatePicker}
              />
            </View>


            <View style={{ alignItems: 'center', height: hp(10), marginTop: hp(5) }}>
              <TouchableOpacity onPress={() => this.registerBtn()}
                //disabled={buttonDisabled} 
                style={{
                  width: wp(90), borderRadius: 3, height: hp(6), alignItems: 'center', justifyContent: 'center',
                  backgroundColor: color.loginColor
                }}>
                <_Text textColor={color.white}>Sign Up</_Text>
              </TouchableOpacity>
            </View>
            <View style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <_Text fsSmall textColor={color.teritary}>Already have an Account ? </_Text>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => this.onLoginPress()}>
                  <_Text fsSmall textColor={color.loginColor}>Log In</_Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
          {
            isFetching ? <View style={{ position: 'absolute', backgroundColor: 'transparent', height: hp(100), width: wp(100), alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="large" color={color.teritaryGray} />
            </View> : null
          }


        </ScrollView>
      </SafeAreaView >
    )
  }
}


function mapStateToProps(state) {
  return {
    isFetching: state.userDetailsReducer.isFetching,
    error: state.userDetailsReducer.error,
    registerErrorMsg: state.userDetailsReducer.registerErrorMsg,
    successRegisterVersion: state.userDetailsReducer.successRegisterVersion,
    errorRegisterVersion: state.userDetailsReducer.errorRegisterVersion,
    registerData: state.userDetailsReducer.registerData,
  };
}


export default connect(mapStateToProps, { registerUser })(UserDetails);