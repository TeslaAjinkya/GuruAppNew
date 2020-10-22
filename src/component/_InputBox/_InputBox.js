import React, { Component } from 'react';
import { View, TouchableOpacity, Image } from 'react-native'
import { Container, Header, Content, Input, Item, Label } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color } from '@values/colors';
import { validateEmail, validateMobNum, validateName, validatePassword, validateUserName } from "@values/validate";
export default class _InputBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: undefined,
      isValid: undefined,
      showPassword: false,
      secureInput: false
    };
  }
  setSecureInput = () => {
    if (this.props.secureText) {
      this.setState({
        secureInput: !this.state.secureInput,
      });
    }
  };


  onChangeText = text => {
    const {
      type,
      inputKey,
      onChangeText,
      minLength,
      maxLength,
      inputId
    } = this.props;
    let isValid = false;

    if (text && text.length > 0) {
      switch (type) {

        case "mobileNumber":
          isValid = validateMobNum(text);
          break;

        case "emailId":
          isValid = validateEmail(text);
          break;

        case "password":
          isValid = validatePassword(text);
          break;

        case "firstName":
          isValid = validateName(text);
          break;

        case "lastName":
          isValid = validateName(text);
          break;

        case "userName":
          isValid = validateUserName(text);
          break;

        default:
          break;
      }
    }
    this.setState({ isValid, text });
    onChangeText && onChangeText({ inputKey, isValid, value: text, inputId });
  };

  render() {
    const { label, secureText, maxLength, value,
      returnKeyType, style, keyboardType, onFocus,
      minLength, disabled } = this.props

    const { secureInput } = this.state

    return (
      <View style={{ alignItems: 'center' }}>
        <View style={{
          backgroundColor: 'white', alignItems: "center", width: wp(90),
          justifyContent: "center"
        }} >
          <Item
            floatingLabel
            style={{
              borderBottomColor: color.textNote,
              borderBottomWidth: 1,
            }}
          >
            <Label
              style={{
                fontSize: 14,
                paddingRight: 25,
                justifyContent: "center", color: color.textNote,
              }}
            >
              {label}
            </Label>
            <Input
              secureTextEntry={secureText && !secureInput}
              maxLength={maxLength}
              onChangeText={this.onChangeText}
              value={value}
              disabled={disabled ? disabled : false}
              onFocus={onFocus}
              minLength={minLength}
              returnKeyType={returnKeyType ? returnKeyType : 'done'}
              keyboardType={keyboardType || "default"}
              style={{
                width: wp(85), fontSize: hp(2), alignSelf: 'center',
                color: disabled === true ? color.textNote : color.teritaryGray
              }} />
          </Item>
          {secureText && (
            <View style={{
              position: 'absolute',
              right: 12,
              top: 20,
              bottom: 0,
              justifyContent: 'center',
            }}>
              <TouchableOpacity onPress={() => this.setSecureInput(secureInput)}>
                <Image
                  style={{ resizeMode: 'contain', width: 25, height: 30, }}
                  source={secureInput ? require('../../assets/img/visible.png') : require('../../assets/img/hide.png')}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
}