import React, {Component, createRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  RefreshControl,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import _Text from '@text/_Text';
import {connect} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {color} from '@values/colors';
import {strings} from '@values/strings';
import _Card from '@card/_Card';
import {Col, Row, Grid, Toast} from 'native-base';

var userId = '';
var giftName = '';
var giftAmount = '';
var createrId = '';
var videoId = '';
var giftId = '';
var paymentMode = '';
var paymentBalance = '';
var createrName = '';
var createrLogo = '';
const Data = [
  {
    id: 1,
    name: 'Request Transaction',
    img: require('../../../assets/img/transaction.png'),
  },
  {
    id: 2,
    name: 'Send Money to Bank',
    img: require('../../../assets/img/transaction.png'),
  },
  {
    id: 3,
    name: 'Add Money to Wallet',
    img: require('../../../assets/img/transaction.png'),
  },
  {
    id: 4,
    name: 'Send gift',
    img: require('../../../assets/img/transaction.png'),
  },
];

class SendGifts extends Component {
  constructor(props) {
    super(props);
    userId = global.userId;
    paymentMode = this.props.route.params.paymentMode;
    giftId = this.props.route.params.giftId;
    giftName = this.props.route.params.giftName;
    giftAmount = this.props.route.params.giftAmount;
    createrId = this.props.route.params.createrId;
    videoId = this.props.route.params.videoId;
    paymentBalance = this.props.route.params.paymentBalance;
    createrName = this.props.route.params.createrName;
    createrLogo = this.props.route.params.createrLogo;
  }

  getScreen(item) {
    if (item.id == 4) {
      if (paymentBalance !== 0) {
        setTimeout(() => {
          this.props.navigation.navigate('Gift', {
            paymentMode: paymentMode,
            giftId: giftId,
            giftName: giftName,
            giftAmount: giftAmount,
            createrId: createrId,
            videoId: videoId,
            paymentBalance: paymentBalance,
            createrName: createrName,
            createrLogo: createrLogo,
          });
        }, 200);
      } else {
        Toast.show({
          text: 'You have Insufficent balance to proceed',
          type: 'danger',
        });
      }
    } else if (item.id == 1) {
      this.props.navigation.navigate('Transactions');
    } else if (item.id == 2) {
      Toast.show({
        text: 'Work on Progress',
        type: 'danger',
      });
    } else if (item.id == 3) {
      Toast.show({
        text: 'Work on Progress',
        type: 'danger',
      });
    }
  }

  getView(item, index) {
    return (
      <TouchableOpacity
        onPress={() => this.getScreen(item)}
        style={{height: hp(6), marginTop: hp(0.5), marginBottom: hp(1)}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            margin: hp(1.5),
            alignItems: 'center',
          }}>
          <View style={{flex: 0.08}}>
            <Image
              defaultSource={require('../../../assets/img/user.png')}
              source={item.img}
              style={{height: hp(2.5), width: hp(2.5)}}
            />
          </View>
          <View style={{flex: 0.87}}>
            <_Text
              fsPrimary
              textColor={color.loginColor}
              style={{paddingLeft: wp(3)}}>
              {item.name}
            </_Text>
          </View>
          <View style={{flex: 0.05}}>
            <Image
              source={require('../../../assets/img/forwardArrow.png')}
              style={{height: hp(2), width: hp(2)}}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <SafeAreaView
        style={{flex: hp(100), backgroundColor: color.backgroundColor}}>
        <View style={{height: hp(6), backgroundColor: color.white}}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
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
                style={{height: hp(2.5), width: hp(2.5)}}
              />
            </TouchableOpacity>
            <View style={{flex: 0.9, alignItems: 'center'}}>
              <_Text fsHeading bold textColor={color.tertiaryGray}>
                {paymentMode == 1 ? 'Wallet Payment' : 'Gift Payment'}
              </_Text>
            </View>
            <View style={{flex: 0.1}} />
          </View>
          <View
            style={{
              borderBottomWidth: wp(0.2),
              borderBottomColor: color.videoBorderGray,
            }}
          />
        </View>
        <View style={{height: hp(94), backgroundColor: color.backgroundColor}}>
          <View style={{marginTop: hp(5), marginLeft: wp(5)}}>
            <_Text fsHeading>Available Balance</_Text>
            <_Text fsLarge bold style={{marginTop: hp(1)}}>
              ₹ {paymentBalance}
            </_Text>
          </View>
          <View style={{marginTop: hp(2)}}>
            <FlatList
              data={Data}
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => this.getView(item, index)}
              keyExtractor={(item, index) => item.id}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default SendGifts;
