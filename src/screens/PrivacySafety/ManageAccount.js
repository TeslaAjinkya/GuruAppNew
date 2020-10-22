import React, { Component } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  View,
  Text,
  Image,
  Button,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Modal, Platform,
  Alert,
  TouchableOpacity, Linking
} from 'react-native';
import { color } from '@values/colors';
import { strings } from '@values/strings';
import _Text from '@text/_Text';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { Toast } from 'native-base';
import _CustomHeader from '@customHeader/_CustomHeader'



const Data = [
  {
    id: 1,
    img: require('../../assets/img/user.png'),
    title: 'Manage account',
  },
  {
    id: 2,
    img: require('../../assets/img/wallet.png'),
    title: 'Wallet',
  },
  {
    id: 3,
    img: require('../../assets/img/privacyPolicy.png'),
    title: 'Followers',
  },
  {
    id: 4,
    img: require('../../assets/img/privacyPolicy.png'),
    title: 'Following',
  },
  {
    id: 5,
    img: require('../../assets/img/privacyPolicy.png'),
    title: 'Help & Support',
  },
  {
    id: 6,
    img: require('../../assets/img/privacyPolicy.png'),
    title: 'Rate Us',
  },
  {
    id: 7,
    img: require('../../assets/img/logout.png'),
    title: 'Log out',
  },
];

class ManageAccount extends Component {

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: hp(0.09),
          width: '100%',
          backgroundColor: color.lightGray,
        }}
      />
    );
  };



  setLoginData() {
    global.userId = "";
    AsyncStorage.setItem('userId', "")
    AsyncStorage.setItem('email', "")
    AsyncStorage.setItem('firstName', "")
    AsyncStorage.setItem('lastName', "")
    AsyncStorage.setItem('userName', "")
    AsyncStorage.setItem('mobileNumber', "")
    AsyncStorage.setItem('dob', "")
    AsyncStorage.setItem('userpic', "")
    //AsyncStorage.setItem('walletBalance', data.walletBalance.toString())
    AsyncStorage.setItem('subscribersCount', "")
  }


  getScreen(item) {
    if (item.id == 7) {
      Alert.alert(
        'Do You Want To Logout',
        '',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'LOG OUT',
            onPress: () => {
              this.setLoginData()
              this.props.navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    { name: 'Login' },
                  ],
                })
              );
            },
          },
        ],
        { cancelable: false },
      );
    }
    if (item.id == 2) {
      this.props.navigation.navigate('ViewBalance')
    }
    if (item.id == 6) {
      Platform.OS === 'ios' ? Linking.openURL('https://www.google.com') : Linking.openURL('https://play.google.com/store/apps')
    }
    // if (item.id === 4) {
    //   this.props.navigation.navigate('Transactions')
    // }
    // if (item.id === 2) {
    //   this.props.navigation.navigate('ChangePassword')
    // }


  }




  getView(item, index) {
    return (
      <TouchableOpacity onPress={() => this.getScreen(item)} style={{ height: hp(6), marginTop: hp(1), marginBottom: hp(1) }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            margin: hp(1.5),
            alignItems: 'center',
          }}>
          <View style={{ flex: 0.08 }}>
            <Image
              defaultSource={require('../../assets/img/user.png')}
              source={item.img}
              style={{ height: hp(2.5), width: hp(2.5) }}
            />
          </View>
          <View style={{ flex: 0.87 }}>
            <_Text fsPrimary textColor={color.tertiaryGray} style={{ paddingLeft: wp(3) }} >
              {item.title}
            </_Text>
          </View>
          <View style={{ flex: 0.05 }}>
            <Image
              source={require('../../assets/img/forwardArrow.png')}
              style={{ height: hp(2), width: hp(2) }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <SafeAreaView style={{ height: hp(100), backgroundColor: color.white }}>

        <_CustomHeader
          title={'Ajinkya'}
          onLeftButtonPress={() => this.props.navigation.goBack()}
        />

        <View
          style={{
            height: hp(94),
            marginLeft: wp(2),
            marginRight: wp(2),
            marginTop: hp(1),
            backgroundColor: color.white,
          }}>
          <FlatList
            data={Data}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            renderItem={({ item, index }) => this.getView(item, index)}
            keyExtractor={(item, index) => item.id}
          />
        </View>
      </SafeAreaView>
    )
  }
}
export default ManageAccount