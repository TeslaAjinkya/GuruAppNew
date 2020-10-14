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
import {urls} from '@api/urls';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import {sendGift} from '@sendPayment/GiftAction';

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
var radio_props = [];
var bank = [];
class Gift extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      successGiftDataVersion: 0,
      errorGiftDataVersion: 0,
    };
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
    
    radio_props = [
      {label: 'Use ₹' + ' ' + giftAmount + ' ' + 'of your Wallet', value: 0},
    ];
    bank = [{value: 0}];
  }

  getCard(bankName, owner, expires) {
    return (
      <_Card style={{marginTop: 0}} borderRadius={7} propWidth={wp(97)}>
        <View
          style={{
            height: hp(20),
            justifyContent: 'center',
            paddingLeft: wp(4),
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <RadioForm
              radio_props={bank}
              initial={-1}
              disabled={true}
              labelHorizontal={true}
              labelStyle={{
                fontSize: 18,
                color: color.tertiaryGray,
                fontWeight: '900',
              }}
              formHorizontal={true}
              buttonSize={15}
              buttonOuterSize={25}
              buttonColor={'#2196f3'}
              animation={true}
              onPress={value => {
                this.setState({value: value});
              }}
            />
            <View style={{flexDirection: 'column'}}>
              <_Text fsPrimary textColor={color.tertiaryGray}>
                {bankName}
              </_Text>
              <_Text fsPrimary textColor={color.tertiaryGray}>
                {owner}
              </_Text>
              <_Text fsPrimary textColor={color.tertiaryGray}>
                {expires}
              </_Text>
              <TextInput
                placeholder="Enter CVV"
                style={{
                  height: 40,
                  width: wp(30),
                  borderColor: 'gray',
                  marginTop: hp(1),
                  borderWidth: 1,
                }}
                // onChangeText={text => onChangeText(text)}
                // value={value}
              />
            </View>
          </View>
        </View>
      </_Card>
    );
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {successGiftDataVersion, errorGiftDataVersion} = nextProps;
    let newState = null;

    if (successGiftDataVersion > prevState.successGiftDataVersion) {
      newState = {
        ...newState,
        successGiftDataVersion: nextProps.successGiftDataVersion,
      };
    }

    if (errorGiftDataVersion > prevState.errorGiftDataVersion) {
      newState = {
        ...newState,
        errorGiftDataVersion: nextProps.errorGiftDataVersion,
      };
    }

    return newState;
  }

  componentDidUpdate(prevProps, prevState) {
    const {giftErrorMsg} = this.props;

    if (this.state.successGiftDataVersion > prevState.successGiftDataVersion) {
      this.setState({giftModalVisible:false})
      this.props.navigation.navigate('GiftSuccess');
    }

    if (this.state.errorGiftDataVersion > prevState.errorGiftDataVersion) {
      this.setState({giftModalVisible:false})
      Toast.show({
        text: giftErrorMsg,
        type: 'danger',
      });
    }
  }

  sendPayment() {
    if (paymentMode == 2) {
        
      var payload = {
        payload: {
          userId: userId,
          creatorId: createrId,
          giftId: giftId,
          videoId: videoId,
          giftFlag: true,
          walletFlag: true,
        },
      };

      this.props.sendGift(payload);
    } else if (paymentMode == 1) {
        
      var payload = {
        payload: {
          userId: userId,
          creatorId: createrId,
          giftId: giftId,
          videoId: videoId,
          giftFlag: false,
          walletFlag: true,
        },
      };
      this.props.sendGift(payload);
    }
  }

  render() {
    const height = hp(18);
    const width = wp(100) + 40;
    const profileTop = height - hp(23);
    const  {isFetching} = this.props
    return (
      <SafeAreaView
        style={{flex: hp(100), backgroundColor: color.backgroundColor}}>
            <>
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
                {paymentMode == 1 ? 'Send Gift' : 'Send Gift'}
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
        <View style={{height: hp(94)}}>
          <>
            <View
              style={{
                flexDirection: 'row',
                marginTop: hp(3),
                paddingLeft: wp(3),
                paddingRight: wp(3),
              }}>
              <_Text
                fsPrimary
                textColor={color.tertiaryGray}
                numberOfLines={1}
                style={{flex: 0.5}}>
                Gift Name : {giftName}
              </_Text>
              <View style={{flex: 0.5, alignItems: 'flex-end'}}>
                <_Text
                  fsPrimary
                  textColor={color.tertiaryGray}
                  numberOfLines={1}>
                  Amount : ₹ {giftAmount}
                </_Text>
              </View>
            </View>
            {giftAmount == 0 ? (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: hp(1),
                  alignSelf: 'flex-end',
                  paddingRight: wp(4),
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../../assets/img/free.png')}
                  style={{height: hp(4), width: hp(4)}}
                />
                <_Text textColor={'#FF0000'} style={{paddingLeft: wp(1)}}>
                  Free
                </_Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: hp(1),
                  alignSelf: 'flex-end',
                  paddingRight: wp(4),
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../../assets/img/coin.png')}
                  style={{height: hp(4), width: hp(4)}}
                />
                <_Text textColor={'#05bd08'} style={{paddingLeft: wp(1)}}>
                  Buy
                </_Text>
              </View>
            )}
          </>
          <_Card style={{marginTop: hp(2)}} borderRadius={7} propWidth={wp(97)}>
            <View
              style={{
                height: hp(8),
                justifyContent: 'center',
                paddingLeft: wp(5),
              }}>
              <RadioForm
                radio_props={radio_props}
                initial={-1}
                labelHorizontal={true}
                labelStyle={{
                  fontSize: 18,
                  color: color.tertiaryGray,
                  fontWeight: '900',
                }}
                formHorizontal={true}
                buttonSize={15}
                buttonOuterSize={25}
                buttonColor={'#2196f3'}
                animation={true}
                onPress={value => {
                  this.setState({value: value});
                }}
              />
            </View>
          </_Card>
          <View>
            <_Text
              fsSmall
              bold
              textColor={color.tertiaryGray}
              style={{marginTop: hp(2), paddingLeft: wp(2)}}>
              CREDIT AND DEBIT CARDS
            </_Text>
            <View style={{marginTop: hp(2)}} />
            {this.getCard(
              'ICICI Bank ******7362',
              'Chinmaya',
              ' Expires 07/2025',
            )}
            {this.getCard(
              'HDFC Bank ******0062',
              'Chinmaya',
              ' Expires 09/2020',
            )}
            
          </View>
          
          <View
            style={{
              marginTop: hp(2),
              alignItems: 'center',
              marginBottom: hp(2),
            }}>
            <TouchableOpacity
              disabled={
                giftAmount !== 0
                  ? this.state.value !== ''
                    ? false
                    : true
                  : false
              }
              onPress={() => this.sendPayment()}
              style={{
                backgroundColor:giftAmount !== 0
                    ? this.state.value !== ''
                      ? color.loginColor
                      : color.disabledLoginColor
                    : color.loginColor,
                width: wp(90),
                borderRadius: 3,
                height: hp(7),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <_Text textColor={color.white}>Continue</_Text>
            </TouchableOpacity>
            {
                isFetching ?   <View style={{position:'absolute', height: hp(7), backgroundColor:'transparent', justifyContent:'center', alignItems:'center',  width: wp(90),}}>
                <ActivityIndicator size="large" color={color.tertiaryGray} />
               </View> :null
            }
          
          </View>
          
        </View>
        </>
        
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.giftReducer.isFetching,
    getGiftData: state.giftReducer.getGiftData,
    giftError: state.giftReducer.giftError,
    giftErrorMsg: state.giftReducer.giftErrorMsg,
    successGiftDataVersion: state.giftReducer.successGiftDataVersion,
    errorGiftDataVersion: state.giftReducer.errorGiftDataVersion,
  };
}
const mapDispatchToProps = dispatch => ({
  sendGift: payload => dispatch(sendGift(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Gift);
