import React, {Component} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {urls} from '@api/urls';
import {connect} from 'react-redux';
import {color} from '@values/colors';

import {
  View,
  Text,
  Image,
  Button,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Modal,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {strings} from '@values/strings';
import _Text from '@text/_Text';
import _Card from '@card/_Card';
import {viewBalance} from '@viewBalance/ViewBalanceAction';

import {Col, Row, Grid, Toast} from 'native-base';

var userId = '';

class ViewBalance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balanceData: ' ',
      successViewBalanceVersion: 0,
      errorViewBalanceVersion: 0,
    };
    userId = global.userId;
  }
  componentDidMount() {
    var requestpayload = {
      payload: {
        userId: global.userId,
      },
    };
    this.props.viewBalance(requestpayload);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {successViewBalanceVersion, errorViewBalanceVersion} = nextProps;
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
    const {viewBalanceData, errorViewBalanceMsg} = this.props;

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

  getCard(img, title, amount) {
    return (
      <_Card borderRadius={7} propWidth={wp(94)}>
        <View style={{height: hp(13)}}>
          <Grid>
            <Col
              style={{
                justifyContent: 'center',
                width: wp(25),
                alignItems: 'center',
              }}>
              <Image source={img} style={{height: hp(6), width: hp(6)}} />
            </Col>
            <Col style={{justifyContent: 'center'}}>
              <_Text
                numberOfLines={1}
                textColor={color.tertiaryGray}
                fsHeading
                fwHeading>
                {title}
              </_Text>
              <_Text
                numberOfLines={1}
                textColor={color.tertiaryGray}
                fsExtraLarge
                bold>
                ₹ {amount}
              </_Text>
            </Col>
            <Col
              style={{
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingBottom: hp(1),
              }}>
              <TouchableOpacity
                style={{
                  width: wp(25),
                  borderRadius: 4,
                  backgroundColor: color.loginColor,
                  height: hp(5),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <_Text fwSmall textColor={color.white}>
                  Redeem
                </_Text>
              </TouchableOpacity>
            </Col>
          </Grid>
        </View>
      </_Card>
    );
  }
  render() {
    const {isFetching, errorViewBalance} = this.props;
    const {balanceData} = this.state;
    console.log('balanceData', balanceData);

    return (
      <SafeAreaView
        style={{height: hp(100), backgroundColor: color.backgroundColor}}>
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
                {strings.balance}
              </_Text>
            </View>
            <TouchableOpacity style={{flex: 0.1, alignItems: 'flex-start'}}>
              <_Text>FAQ</_Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: wp(0.2),
              borderBottomColor: color.videoBorderGray,
            }}
          />
        </View>

        <View style={{height: hp(94), margin: hp(3)}}>
          {balanceData !== '' && errorViewBalance !== true ? (
            <View style={{width: wp(100), height: hp(94), alignSelf: 'center'}}>
              {this.getCard(
                require('../../../assets/img/wallet.png'),
                'Wallet Balance',
                balanceData[0].walletBalance,
              )}

              <View style={{marginTop: hp(1)}}>
                {this.getCard(
                  require('../../../assets/img/giftLight.png'),
                  'Gift Balance',
                  balanceData[0].giftAmount,
                )}
              </View>
            </View>
          ) : null}
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
        </View>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.viewBalanceReducer.isFetching,
    viewBalanceData: state.viewBalanceReducer.viewBalanceData,
    errorViewBalance: state.viewBalanceReducer.errorViewBalance,
    errorViewBalanceMsg: state.viewBalanceReducer.errorViewBalanceMsg,
    successViewBalanceVersion:
      state.viewBalanceReducer.successViewBalanceVersion,
    errorViewBalanceVersion: state.viewBalanceReducer.errorViewBalanceVersion,
  };
}

const mapDispatchToProps = dispatch => ({
  viewBalance: requestpayload => dispatch(viewBalance(requestpayload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewBalance);
