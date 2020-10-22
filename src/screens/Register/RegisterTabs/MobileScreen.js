import React, { Component } from 'react';
import { View, Image, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import _InputBox from '@inputBox/_InputBox'
import _Container from '@container/_Container'
import { Container, Toast } from 'native-base'
import { color } from '@values/colors';
import _Text from '@text/_Text'
import { strings } from '@values/strings';
import { validateMob } from '@registerTabs/RegisterAction'
import { connect } from 'react-redux'


class MobileScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mobileNumber: "",
      isMobileNumber: false,
      successMobValidateVersion: 0,
      errorMobValidateVersion: 0
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      successMobValidateVersion, errorMobValidateVersion
    } = nextProps;
    let newState = null;

    if (successMobValidateVersion > prevState.successMobValidateVersion) {
      newState = {
        ...newState,
        successMobValidateVersion: nextProps.successMobValidateVersion,
      };
    }
    if (errorMobValidateVersion > prevState.errorMobValidateVersion) {
      newState = {
        ...newState,
        errorMobValidateVersion: nextProps.errorMobValidateVersion,
      };
    }

    return newState;
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.state.successMobValidateVersion > prevState.successMobValidateVersion) {
      this.props.navigation.navigate('OtpScreen', { mobileNo: prevState.mobileNumber })
    }

    if (this.state.errorMobValidateVersion > prevState.errorMobValidateVersion) {
      Toast.show({
        text: this.props.mobValidateErrorMsg ? this.props.mobValidateErrorMsg : strings.serverFailedMsg,
        type: 'danger',
        duration: 2500
      })
    }
  }


  onInputChanged = ({ inputKey, isValid, value }) => {

    let validationKey = "";
    switch (inputKey) {
      case "mobileNumber":
        validationKey = "isMobileNumber";
        break;

      default:
        break;
    }
    this.setState({
      [inputKey]: value,
      [validationKey]: isValid
    });
  };


  onLoginMobilePress() {
    this.props.navigation.navigate('Login')
  }

  mobileTabButtonPress = () => {
    const {
      mobileNumber,
      isMobileNumber
    } = this.state;
    let error = "";
    try {
      if (!isMobileNumber) {
        error = "Please Enter Valid Mobile Number";
        throw new Error();
      }
      else {
        var body = {
          "payload": {
            enteredKey: mobileNumber,
            validateFlag: 0
          }
        }
        this.props.validateMob(body)
      }
    } catch (err) {
      console.log("err", err);

      Toast.show({
        text: error,
        type: "danger"
      });
    }
  }

  render() {
    const { mobileNumber } = this.state
    return (
      <View style={{ height: hp(100), backgroundColor: color.white }}>
        <View style={{ justifyContent: 'center', height: hp(15), alignItems: 'center' }}>
          <_InputBox label={"Mobile Number"}
            maxLength={10}
            minLength={10}
            type="mobileNumber"
            inputKey="mobileNumber"
            keyboardType='phone-pad'
            returnKeyType='done'
            value={mobileNumber ? mobileNumber : null}
            onChangeText={this.onInputChanged}
            style={{ borderRadius: 3 }} ></_InputBox>
        </View>
        <View style={{ alignItems: 'center', height: hp(10), top: 20 }}>
          <TouchableOpacity
            onPress={() => this.mobileTabButtonPress()}
            style={{ width: wp(90), borderRadius: 3, height: hp(6), alignItems: 'center', justifyContent: 'center', backgroundColor: color.loginColor }}
          >
            <_Text textColor={color.white}>Next</_Text>
          </TouchableOpacity>
        </View>
        <View style={{ top: 15, justifyContent: 'flex-start', alignItems: 'center', }}>
          <View style={{ flexDirection: 'row' }}>
            <_Text fsSmall textColor={color.teritary}>Already have an account ? </_Text>
            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => this.onLoginMobilePress()}>
              <_Text fsSmall textColor={color.loginColor}>{' '}Log In</_Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.registerReducer.isFetching,
    mobValidateError: state.registerReducer.mobValidateError,
    mobValidateErrorMsg: state.registerReducer.mobValidateErrorMsg,
    successMobValidateVersion: state.registerReducer.successMobValidateVersion,
    errorMobValidateVersion: state.registerReducer.errorMobValidateVersion,

  };
}


const mapDispatchToProps = dispatch => ({
  validateMob: requestBody => dispatch(validateMob(requestBody)),

});

export default connect(mapStateToProps, mapDispatchToProps)(MobileScreen);