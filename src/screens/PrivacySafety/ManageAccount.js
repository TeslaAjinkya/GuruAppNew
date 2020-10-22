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
  constructor(props) {
    super(props);

    const data = this.props.route.params.profile

    this.state = {
      profileData: data,
      showAccountDropDown: false
    };
  }


  FlatListItemSeparator = () => {
    const { profileData, showAccountDropDown } = this.state

    return (
      <View style={{
        height: hp(0.09), width: '100%', backgroundColor: showAccountDropDown ? 'white' : color.lightGray,
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
    if (item.id === 1) {
      this.setState({ showAccountDropDown: !this.state.showAccountDropDown })
    }


  }




  getView(item, index) {

    const { profileData, showAccountDropDown } = this.state

    return (
      <TouchableOpacity onPress={() => this.getScreen(item)}
        style={{
          height: hp(6),
          marginTop: showAccountDropDown && item.id === 2 ? hp(14) : hp(1),
          marginBottom: hp(1)
        }}>
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
            {item.id !== 1 && <Image
              source={require('../../assets/img/forwardArrow.png')}
              style={{ height: hp(2), width: hp(2) }}
            />
            }
            {item.id == 1 && !showAccountDropDown && <Image
              source={require('../../assets/img/downArrow.png')}
              style={{ height: hp(2), width: hp(2) }}
            />}
            {item.id == 1 && showAccountDropDown &&
              <Image
                source={require('../../assets/img/upArrow.png')}
                style={{ height: hp(2), width: hp(2) }}
              />
            }

          </View>
        </View>

        <View style={{
          height: hp(0.09), width: '100%', backgroundColor: showAccountDropDown && item.id === 1 ? 'white' : color.lightGray,
        }}
        />
        {showAccountDropDown && item.id === 1 && this.accounDropDownView()}
      </TouchableOpacity>
    );
  }


  accounDropDownView = () => {
    const { profileData } = this.state

    return (
      <View style={{
        height: hp(15), top: 5,
        alignItems: 'center',
      }}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('ChangePassword')}
        >
          <View
            style={{
              flexDirection: 'row',
              marginTop: 5, height: hp(7), width: wp(80), borderRadius: 8, backgroundColor: color.primaryGray,
              alignItems: 'center', justifyContent: 'center',
            }}>
            <View style={{ flex: 0.10 }} >
              <Image
                source={require('../../assets/img/user.png')}
                style={{ height: hp(4), width: hp(4) }}
              />
            </View>
            <View style={{ flex: 0.80 }}>
              <_Text fsPrimary textColor={color.tertiaryGray} style={{ paddingLeft: wp(3) }} >
                Change Password
            </_Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('EditProfile')}
        >
          <View
            onStartShouldSetResponder={() => this.props.navigation.navigate('EditProfile',)}
            style={{
              flexDirection: 'row',
              marginTop: 10, height: hp(7), width: wp(80), borderRadius: 8, backgroundColor: color.primaryGray,
              alignItems: 'center', justifyContent: 'center',
            }}>
            <View style={{ flex: 0.10 }}>
              <Image
                source={require('../../assets/img/user.png')}
                style={{ height: hp(4), width: hp(4) }}
              />
            </View>
            <View style={{ flex: 0.80 }}>
              <_Text fsPrimary textColor={color.tertiaryGray} style={{ paddingLeft: wp(3) }} >
                Edit Profile
            </_Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }



  render() {
    const { profileData, showAccountDropDown } = this.state
    return (
      <SafeAreaView style={{ height: hp(100), backgroundColor: color.white }}>

        <_CustomHeader
          title={profileData.firstName + ' ' + profileData.lastName}
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
            // ItemSeparatorComponent={showAccountDropDown && item.id == 1 ? null : this.FlatListItemSeparator}
            renderItem={({ item, index }) => this.getView(item, index)}
            keyExtractor={(item, index) => item.id}
          />


        </View>


      </SafeAreaView>
    )
  }
}
export default ManageAccount