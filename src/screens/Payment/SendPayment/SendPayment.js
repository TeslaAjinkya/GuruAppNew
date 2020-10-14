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
  ColorPropType,
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
import {viewBalance} from '@viewBalance/ViewBalanceAction';


var userId = '';
var giftName = '';
var giftAmount = '';
var createrId = '';
var videoId = '';
var giftId = '';
var createrName = ""
var createrLogo = ""

class SendPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      balanceData: ' ',
      successViewBalanceVersion: 0,
      errorViewBalanceVersion: 0,
    
    };
    userId = global.userId;
    giftId = this.props.route.params.selectedGift.giftId;
    giftName = this.props.route.params.selectedGift.giftName;
    giftAmount = this.props.route.params.selectedGift.amount;
    createrId = this.props.route.params.createrId;
    videoId = this.props.route.params.videokey;
    createrName = this.props.route.params.createrName
    createrLogo = this.props.route.params.createrLogo 
    
  }

  componentDidMount() {
    var requestpayload = {
      payload: {
        userId: userId,
      },
    };

    this.props.viewBalance(requestpayload);
  }

  goToSendGifts(id, paymentBalance) {
    setTimeout(() => {
      this.props.navigation.navigate('SendGifts', {
        paymentMode: id,
        giftId: giftId,
        giftName: giftName,
        giftAmount: giftAmount,
        createrId: createrId,
        videoId: videoId,
        paymentBalance: paymentBalance,
        createrName:createrName,
        createrLogo:createrLogo
      });
    }, 200);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      successViewBalanceVersion,
      errorViewBalanceVersion,
    
    } = nextProps;
    let newState = null;

    if (successViewBalanceVersion > prevState.successViewBalanceVersion) {
      newState = {
        ...newState,
        successViewBalanceVersion: nextProps.successViewBalanceVersion,
      };
    }

    if (errorViewBalanceVersion > prevState.errorViewBalanceVersion) {
      newState = {
        ...newState,
        errorViewBalanceVersion: nextProps.errorViewBalanceVersion,
      };
    }
  

    return newState;
  }

  componentDidUpdate(prevProps, prevState) {
    const {viewBalanceData, errorViewBalanceMsg, giftErrorMsg} = this.props;

    if (
      this.state.successViewBalanceVersion > prevState.successViewBalanceVersion
    ) {
      this.setState({balanceData: viewBalanceData.userData});
    }

    if (
      this.state.errorViewBalanceVersion > prevState.errorViewBalanceVersion
    ) {
      Toast.show({
        text: errorViewBalanceMsg,
        type: 'danger',
      });
    }

  
  }

  getCard(img, title, amount, id) {
    return (
      <_Card borderRadius={7} propWidth={wp(92)}>
        <TouchableOpacity
          onPress={() => this.goToSendGifts(id, amount)}
          style={{height: hp(18)}}>
          <Grid>
            <Col
              style={{
                justifyContent: 'center',
                width: wp(22),
                alignItems: 'center',
              }}>
              <Image source={img} style={{height: hp(6), width: hp(6)}} />
            </Col>
            <Col style={{justifyContent: 'center'}}>
              <_Text numberOfLines={1} textColor={color.tertiaryGray} fsHeading>
                {title}
              </_Text>
              <_Text
                numberOfLines={1}
                textColor={color.tertiaryGray}
                fsLarge
                bold>
                ₹ {amount}
              </_Text>
              <_Text
                st
                yle={{marginTop: hp(1)}}
                numberOfLines={1}
                textColor={color.loginColor}
                fsPrimary>
                Issued by Payment banks
              </_Text>
            </Col>
          </Grid>
        </TouchableOpacity>
      </_Card>
    );
  }

  render() {
    const {balanceData} = this.state;
    const {isFetching, errorViewBalance} = this.props;
    return (
      <SafeAreaView style={{flex: hp(100), backgroundColor: color.backgroundColor}}>
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
                {strings.paymentMode}
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

        <View
          style={{
            width: wp(100),
            height: hp(94),
            alignSelf: 'center',
            marginTop: hp(4),
          }}>
          {this.getCard(
            require('../../../assets/img/wallet.png'),
            'Wallet Balance',
            balanceData[0].walletBalance,
            1,
          )}

          <View style={{marginTop: hp(1)}}>
            {this.getCard(
              require('../../../assets/img/giftLight.png'),
              'Gift Balance',
              balanceData[0].giftAmount,
              2,
            )}
          </View>
        </View>

        {isFetching ? (
          <View
            style={{
              position: 'absolute',
              height: hp(100),
              width: wp(100),
              backgroundColor: 'transparent',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size="large" color={color.tertiaryGray} />
          </View>
        ) : null} 
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.sendPaymentReducer.isFetching,
    viewBalanceData: state.sendPaymentReducer.viewBalanceData,
    errorViewBalance: state.sendPaymentReducer.errorViewBalance,
    errorViewBalanceMsg: state.sendPaymentReducer.errorViewBalanceMsg,
    successViewBalanceVersion:
      state.sendPaymentReducer.successViewBalanceVersion,
    errorViewBalanceVersion: state.sendPaymentReducer.errorViewBalanceVersion,

   
  };
}

const mapDispatchToProps = dispatch => ({
  viewBalance: requestpayload => dispatch(viewBalance(requestpayload)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SendPayment);
