import React, { Component } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { urls } from '@api/urls';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Modal,
  Alert,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  CheckBox,
  Title,
  Segment,
  Content,
  Card,
  CardItem,
} from 'native-base';
import { color } from '@values/colors';
import { strings } from '@values/strings';
import _Text from '@text/_Text';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  getSentTransaction,
  getReceivedTransaction,
} from '@transactions/TransactionsAction';
import { connect } from 'react-redux';

const data = [
  {
    id: 1,
    img: require('../../../assets/img/profilepic2.png'),
    userName: 'Ajinkya',
    date: '2nd april 2020',
    giftName: 'Trophy',
    amount: 10,
  },
  {
    id: 2,
    img: require('../../../assets/img/profilepic1.png'),
    userName: 'John',
    date: '2nd april 2020',
    giftName: 'Sunglasses',
    amount: 2,
  },
  {
    id: 3,
    img: require('../../../assets/img/profilepic1.png'),
    userName: 'Doe',
    date: '2nd april 2020',
    giftName: 'Heart',
    amount: 0,
  },
  {
    id: 4,
    img: require('../../../assets/img/profilepic4.png'),
    userName: 'Netflix',
    date: '2nd april 2020',
    giftName: 'Trophy',
    amount: 10,
  },
  {
    id: 5,
    img: require('../../../assets/img/profilepic3.png'),
    userName: 'Alt Balaji',
    date: '2nd april 2020',
    giftName: 'Diamond',
    amount: 200,
  },
  {
    id: 6,
    img: require('../../../assets/img/profilepic4.png'),
    userName: 'Angry Birds',
    date: '2nd april 2020',
    giftName: 'Chocolate',
    amount: 500,
  },
];

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSent: true,
      isReceived: false,
      sentTxDataSource: [],
      receivedTxDataSource: [],
      successSentTxVersion: false,
      errorSentTxVersion: false,
      successReceivedTxVersion: false,
      errorReceivedTxVersion: false,
    };

    userId = global.userId;
  }

  componentDidMount = async () => {
    var requestpayload = {
      payload: {
        userId: userId,
        transactionFlag: 0,
        startLimit: 0,
      },
    };
    var requestpayloadTwo = {
      payload: {
        userId: userId,
        transactionFlag: 1,
        startLimit: 0,
      },
    };
    await this.props.getSentTransaction(requestpayload);
    await this.props.getReceivedTransaction(requestpayloadTwo);
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      successSentTxVersion,
      errorSentTxVersion,
      successReceivedTxVersion,
      errorReceivedTxVersion,
    } = nextProps;
    let newState = null;

    if (successSentTxVersion > prevState.successSentTxVersion) {
      newState = {
        ...newState,
        successSentTxVersion: nextProps.successSentTxVersion,
      };
    }

    if (errorSentTxVersion > prevState.errorSentTxVersion) {
      newState = {
        ...newState,
        errorSentTxVersion: nextProps.errorSentTxVersion,
      };
    }

    if (successReceivedTxVersion > prevState.successReceivedTxVersion) {
      newState = {
        ...newState,
        successReceivedTxVersion: nextProps.successReceivedTxVersion,
      };
    }

    if (errorReceivedTxVersion > prevState.errorReceivedTxVersion) {
      newState = {
        ...newState,
        errorReceivedTxVersion: nextProps.errorReceivedTxVersion,
      };
    }

    return newState;
  }

  componentDidUpdate(prevProps, prevState) {
    const { sentTxData, receivedTxData } = this.props;

    if (this.state.successSentTxVersion > prevState.successSentTxVersion) {
      this.setState({ sentTxDataSource: sentTxData });
    }
    if (
      this.state.successReceivedTxVersion > prevState.successReceivedTxVersion
    ) {
      this.setState({ receivedTxDataSource: receivedTxData });
    }
  }

  setSelectedTab = (key) => {
    if (key === 0) {
      this.setState({
        isSent: true,
        isReceived: false,
      });
    } else if (key === 1) {
      var requestpayload = {
        payload: {
          userId: userId,
          transactionFlag: 1,
          startLimit: 0,
        },
      };
      //this.props.getReceivedTransaction(requestpayload)

      this.setState({
        isReceived: true,
        isSent: false,
      });
    }
  };

  getView(item, index) {
    return (
      <View style={{ paddingTop: hp(1), paddingBottom: hp(1) }}>
        <View style={{ flexDirection: 'row', flex: 1, paddingHorizontal: wp(5), alignItems: 'center' }}>
          <View style={{ flex: 0.2, justifyContent: 'flex-start' }}>
            <Image
              style={{
                height: hp(6),
                width: hp(6),
                borderRadius: hp(6) / 2,
                borderWidth: wp(0.5),
                borderColor: color.borderOrange,
                resizeMode: 'cover',
              }}
              source={{
                uri: item.profilePic ? urls.baseUrl + item.profilePic : null,
              }}
            />
          </View>

          <View style={{ flex: 0.55, marginLeft: wp(0.5) }}>
            <_Text fsPrimary bold numberOfLines={2}>
              {item.userName}
            </_Text>
            <_Text fsSmall fwSmall numberOfLines={1} style={{ marginTop: hp(0.4) }}>
              {"Gift Name:" + " " + item.giftName}
            </_Text>
            <_Text fsSmall numberOfLines={1} style={{ marginTop: hp(0.4) }}>
              {item.date.slice(0, 10)}
            </_Text>
          </View>

          <View style={{ flex: 0.35, alignItems: 'flex-end', justifyContent: 'center' }}>
            <_Text fsLarge bold numberOfLines={1}>
              {' '}
              ₹ {item.amount}
            </_Text>
            {item.amount == 0 && (
              <_Text
                fsSmall
                textColor={"red"}
                style={{ paddingTop: 3 }}>
                Free
              </_Text>
            )}
          </View>
        </View>
        <View
          style={{
            paddingTop: 10,
            marginLeft: 15,
            marginRight: 15,
            alignSelf: 'stretch',
            borderBottomColor: '#D3D3D3',
            borderBottomWidth: 1,
          }}
        />
      </View>
    );
  }

  showTransactions = (transactions) => {

    return (
      <FlatList
        // horizontal={true}
        style={{ marginTop: hp(2), marginBottom: hp(2) }}
        data={transactions.giftdata}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={this.FlatListItemSeparator}
        renderItem={({ item, index }) => this.getView(item)}
        keyExtractor={(item, index) => item.id}
      />
    );
  };

  noDataFound = (message) => {
    return (
      <View
        style={{
          height: hp(60),
          backgroundColor: 'transparent',
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../../../assets/gif/noData.gif')}
          style={{ height: hp(20), width: hp(20), resizeMode: 'cover' }}
        />
        <_Text style={{ paddingTop: 5 }}>{message}</_Text>
      </View>
    );
  };

  render() {
    const {
      isReceived,
      isSent,
      sentTxDataSource,
      receivedTxDataSource,
    } = this.state;
    const { isFetching, sentTxData, receivedTxData, errorSentTxMsg } = this.props;


    return (
      <SafeAreaView style={{ height: hp(100), backgroundColor: color.white }}>
        <View style={{ height: hp(6), backgroundColor: color.white }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
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
                style={{ height: hp(2.5), width: hp(2.5) }}
              />
            </TouchableOpacity>
            <View style={{ flex: 0.8, alignItems: 'center' }}>
              <_Text fsHeading bold textColor={color.tertiaryGray}>
                {strings.transactions}
              </_Text>
            </View>
          </View>
          <View
            style={{
              borderBottomWidth: wp(0.2),
              borderBottomColor: color.videoBorderGray,
            }}
          />
        </View>

        <Segment
          style={{
            height: 50,
            width: wp(100),
            alignSelf: 'stretch',
            backgroundColor: color.white,
          }}>
          <View>
            <Button
              first
              onPress={() => this.setSelectedTab(0)}
              style={{
                top: 7,
                width: wp(50),
                borderColor: 'white',
                borderRightWidth: 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}
              active={isSent ? true : false}>
              <_Text
                fwPrimary
                fsPrimary
                textColor={isSent ? color.black : color.textNote}>
                SENT
              </_Text>
            </Button>

            {isSent && (
              <View
                style={{
                  top: 10,
                  alignSelf: 'center',
                  borderColor: 'red',
                  width: wp(25),
                  borderWidth: 1,
                  borderRadius: 3,
                }}
              />
            )}
          </View>

          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: color.textNote,
              alignSelf: 'center',
              height: 30,
            }}
          />

          <View>
            <Button
              last
              style={{
                top: 7,
                width: wp(50),
                borderColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}
              onPress={() => this.setSelectedTab(1)}
              active={isReceived ? true : false}>
              <_Text
                fwPrimary
                fsPrimary
                textColor={isReceived ? color.black : color.textNote}>
                RECEIVED
              </_Text>
            </Button>

            {isReceived && (
              <View
                style={{
                  top: 10,
                  alignSelf: 'center',
                  borderColor: 'red',
                  width: wp(25),
                  borderWidth: 1,
                  borderRadius: 3,
                }}
              />
            )}
          </View>
        </Segment>

        {/* {isSent && <View style={{ alignSelf: 'flex-start', borderColor: 'red', width: wp(50), borderWidth: 1, }} />}
        {isReceived && <View style={{ alignSelf: 'flex-end', borderColor: 'red', width: wp(50), borderWidth: 1, }} />} */}

        {isSent &&
          !isFetching &&
          sentTxDataSource.length === 0 &&
          this.noDataFound('No Transaction Found')}
        {isReceived &&
          !isFetching &&
          receivedTxDataSource.length === 0 &&
          this.noDataFound('No Transaction Found')}

        {isSent &&
          !isFetching &&
          sentTxDataSource.length !== 0 &&
          this.showTransactions(sentTxDataSource)}
        {isReceived &&
          !isFetching &&
          receivedTxDataSource.length !== 0 &&
          this.showTransactions(receivedTxData)}

        {isFetching && (
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
        )}
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.transactionReducer.isFetching,
    sentTxData: state.transactionReducer.sentTxData,
    errorSentTx: state.transactionReducer.errorSentTx,
    errorSentTxMsg: state.transactionReducer.errorSentTxMsg,
    successSentTxVersion: state.transactionReducer.successSentTxVersion,
    errorSentTxVersion: state.transactionReducer.errorSentTxVersion,

    receivedTxData: state.transactionReducer.receivedTxData,
    errorReceivedTx: state.transactionReducer.errorReceivedTx,
    errorReceivedTxMsg: state.transactionReducer.errorReceivedTxMsg,
    successReceivedTxVersion: state.transactionReducer.successReceivedTxVersion,
    errorReceivedTxVersion: state.transactionReducer.errorReceivedTxVersion,
  };
}

const mapDispatchToProps = (dispatch) => ({
  getSentTransaction: (requestBody) =>
    dispatch(getSentTransaction(requestBody)),
  getReceivedTransaction: (requestBody) =>
    dispatch(getReceivedTransaction(requestBody)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
