import React, { Component } from 'react';
import { View, Image, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import _InputBox from '@inputBox/_InputBox'
import _Container from '@container/_Container'
import { Container, Toast } from 'native-base'
import { color } from '@values/colors';
import _Text from '@text/_Text'
import { strings } from '@values/strings';
import { validateEmail } from '@registerTabs/RegisterAction'
import { connect } from 'react-redux'


class EmailScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      emailId: "",
      isEmailId: false,
      errorEmailValidateVersion: 0,
      successEmailValidateVersion: 0
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      successEmailValidateVersion, errorEmailValidateVersion
    } = nextProps;
    let newState = null;

    if (successEmailValidateVersion > prevState.successEmailValidateVersion) {
      newState = {
        ...newState,
        successEmailValidateVersion: nextProps.successEmailValidateVersion,
      };
    }
    if (errorEmailValidateVersion > prevState.errorEmailValidateVersion) {
      newState = {
        ...newState,
        errorEmailValidateVersion: nextProps.errorEmailValidateVersion,
      };
    }

    return newState;
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.state.successEmailValidateVersion > prevState.successEmailValidateVersion) {
      this.props.navigation.navigate('OtpScreen', { emailId: prevState.emailId })
    }

    if (this.state.errorEmailValidateVersion > prevState.errorEmailValidateVersion) {
      Toast.show({
        text: this.props.emailValidateErrorMsg ? this.props.emailValidateErrorMsg : strings.serverFailedMsg,
        type: 'danger',
        duration: 2500
      })
    }
  }


  onInputEmailChanged = ({ inputKey, isValid, value }) => {

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
      [validationKey]: isValid
    });
  };

  onLoginEmailPress() {
    this.props.navigation.navigate('Login')
  }


  emailTabButtonPress() {
    const {
      emailId,
      isEmailId
    } = this.state;
    let error = "";
    try {
      if (!isEmailId) {
        error = "Please enter Valid Email Id";
        throw new Error();
      }
      else {
        var body = {
          "payload": {
            enteredKey: emailId.toLowerCase(),
            validateFlag: 1
          }
        }
        this.props.validateEmail(body)
      }
    } catch (err) {
      Toast.show({
        text: error,
        type: "danger"
      });
    }
  }


  render() {
    const { emailId, isEmailId } = this.state
    return (
      <View style={{ height: hp(100), backgroundColor: color.white }}>
        <View style={{ justifyContent: 'center', height: hp(15), alignItems: 'center' }}>
          <_InputBox label={"Email Id"}
            maxLength={50}
            minLength={10}
            type="emailId"
            inputKey="emailId"
            returnKeyType='done'
            value={emailId ? emailId : null}
            onChangeText={this.onInputEmailChanged}
            style={{ borderRadius: 3 }} ></_InputBox>
        </View>
        <View style={{ alignItems: 'center', height: hp(10) }}>
          <TouchableOpacity onPress={() => this.emailTabButtonPress()} style={{ width: wp(90), borderRadius: 3, height: hp(6), alignItems: 'center', justifyContent: 'center', backgroundColor: color.loginColor }}>
            <_Text textColor={color.white}>Next</_Text>
          </TouchableOpacity>
        </View>
        <View style={{ justifyContent: 'flex-start', height: hp(30), alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <_Text fsSmall textColor={color.teritary}>Already have an Account ? </_Text>
            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => this.onLoginEmailPress()}>
              <_Text fsSmall textColor={color.loginColor}>Log In</_Text>
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
    emailValidateError: state.registerReducer.emailValidateError,
    emailValidateErrorMsg: state.registerReducer.emailValidateErrorMsg,
    successEmailValidateVersion: state.registerReducer.successEmailValidateVersion,
    errorEmailValidateVersion: state.registerReducer.errorEmailValidateVersion,

  };
}


const mapDispatchToProps = dispatch => ({
  validateEmail: requestBody => dispatch(validateEmail(requestBody)),

});

export default connect(mapStateToProps, mapDispatchToProps)(EmailScreen);