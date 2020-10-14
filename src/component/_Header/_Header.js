import React, { Component } from 'react';
import { color } from '@values/colors';
import { View, Image, Platform } from 'react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Header, Left, Body, Right, Button, Title } from 'native-base';
import { urls } from '@api/urls';
import AsyncStorage from '@react-native-community/async-storage';

class _Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      showBack,
      onSearchPress,
      onProfilePress,
      title,
      showSearch,
      profilePic,
    } = this.props;

    return (
      <Header
        style={{
          width: '100%',
          height: hp(5),
          paddingVertical: Platform.OS === 'ios' ? 15 : 0,
          marginTop: Platform.OS === 'ios' ? -30 : 0,
          marginBottom: 12,
          backgroundColor: 'white',
        }}>
        <Left>
          <Button transparent>
            {showBack ? (
              <Image
                style={{ height: hp(2.5), width: hp(2.5) }}
                source={require('../../assets/img/back.png')}
              />
            ) : (
                <Image
                  style={{ height: hp(4), width: hp(4) }}
                  source={require('../../assets/img/logo.png')}
                />
              )}
          </Button>
        </Left>
        <Body>
          <Title style={{ color: color.black }}>
            {title ? title : 'GuruApp'}
          </Title>
        </Body>
        <Right>
          {showSearch ? (
            <Button transparent onPress={onSearchPress}>
              <Image
                style={{ height: hp(2.5), width: hp(2.5) }}
                source={require('../../assets/img/search.png')}
              />
            </Button>
          ) : null}

          <Button transparent>
            <Image
              style={{ height: hp(3), width: hp(2.5) }}
              source={require('../../assets/img/notification.png')}
            />
          </Button>
          <Button transparent onPress={onProfilePress}>
            <Image
              resizeMode={'cover'}
              style={{
                height: Platform.OS === 'ios' ? hp(4) : hp(4.5),
                width: Platform.OS === 'ios' ? hp(4) : hp(4.5),
                borderRadius: Platform.OS === 'ios' ? hp(4) / 2 : hp(4.5) / 2,
                borderWidth: wp(0.5),
                borderColor: color.borderOrange,
                backgroundColor: color.white,

              }}
              //source={require('../../assets/img/story4.png')}
              defaultSource={require('../../assets/img/defaultImage.png')}
              source={{ uri: urls.baseUrl + profilePic }}
            />
          </Button>
        </Right>
      </Header>
    );
  }
}

export default _Header;
