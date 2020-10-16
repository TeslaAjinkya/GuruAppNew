import React, { Component, createRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  ColorPropType,
} from 'react-native';
import _Text from '@text/_Text';
import _FlatList from '@flatList/_FlatList';
import Share from 'react-native-share';
import { strings } from '@values/strings';
import { Card, Toast } from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { color } from '@values/colors';
import Video from 'react-native-video';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import _ from 'lodash';
import SubscribeChannelStyle from '@subscribeChannel/SubscribeChannelStyle';

import { urls } from '@api/urls';
import _Card from '@card/_Card';
import _CardContent from '@cardContent/_CardContent';
import {
  getSubscribedVideoList,
  getSubscribedChannelList,
  resetAllReducer
} from '@subscribeChannel/SubscribeChannelAction';
import { getShareCount, getLikeDislikeCount } from '@videoListing/VideoListingAction';
import * as Animatable from 'react-native-animatable';

var actionArray = [];
var userId = "";


class SubscribeChannel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      successSubscriptionDataVersion: 0,
      errorSubscriptionDataVersion: 0,
      subscriptionDataSource: '',
      creatorId: '',
      subscribedChannelDataSource: [],
      successSubscribedChannelDataVersion: 0,
      errorSubscribedChannelDataVersion: 0,

      errorShareCountVersion: 0,
      successShareCountVersion: 0,
      successLikeDislikeCountVersion: 0,
      errorLikeDislikeCountVersion: 0,
      errorMsg: '',
      likes: '',
      errorVideoViewsVersion: 0,
      successVideoViewsVersion: 0,
      page: 0,
      clickedLoadMore: false,

    };
    userId = global.userId
  }

  onPullRefresh = async () => {
    var requestPayload = {
      payload: {
        userId: userId,
        creatorId: this.state.creatorId ? this.state.creatorId : '',
        startLimit: 0,
      },
    };

    var body = {
      payload: {
        userId: userId,
      },
    };

    await this.props.getSubscribedChannelList(body);
    await this.props.getSubscribedVideoList(requestPayload);

    this.setState({ page: 0 })

  };

  // componentWillUnmount() {
  //   this.props.resetReducer();
  // }

  async componentDidMount() {
    var requestPayload = {
      payload: {
        userId: userId,
        creatorId: '',
        startLimit: 0,
      },
    };

    var body = {
      payload: {
        userId: userId,
      },
    };

    await this.props.getSubscribedChannelList(body);

    await this.props.getSubscribedVideoList(requestPayload);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      successSubscriptionDataVersion,
      errorSubscriptionDataVersion,
      errorSubscribedChannelDataVersion,
      successSubscribedChannelDataVersion,
      successLikeDislikeCountVersion,
      errorLikeDislikeCountVersion,
      errorShareCountVersion,
      successShareCountVersion,
      successVideoViewsVersion,
      errorVideoViewsVersion
    } = nextProps;
    let newState = null;

    if (
      successSubscriptionDataVersion > prevState.successSubscriptionDataVersion
    ) {
      newState = {
        ...newState,
        successSubscriptionDataVersion:
          nextProps.successSubscriptionDataVersion,
      };
    }

    if (errorSubscriptionDataVersion > prevState.errorSubscriptionDataVersion) {
      newState = {
        ...newState,
        errorSubscriptionDataVersion: nextProps.errorSubscriptionDataVersion,
      };
    }

    if (
      successSubscribedChannelDataVersion >
      prevState.successSubscribedChannelDataVersion
    ) {
      newState = {
        ...newState,
        successSubscribedChannelDataVersion:
          nextProps.successSubscribedChannelDataVersion,
      };
    }

    if (
      errorSubscribedChannelDataVersion >
      prevState.errorSubscribedChannelDataVersion
    ) {
      newState = {
        ...newState,
        errorSubscribedChannelDataVersion:
          nextProps.errorSubscribedChannelDataVersion,
      };
    }

    if (successShareCountVersion > prevState.successShareCountVersion) {
      newState = {
        ...newState,
        successShareCountVersion: nextProps.successShareCountVersion,
      };
    }

    if (errorShareCountVersion > prevState.errorShareCountVersion) {
      newState = {
        ...newState,
        errorShareCountVersion: nextProps.errorShareCountVersion,
      };
    }

    if (
      successLikeDislikeCountVersion > prevState.successLikeDislikeCountVersion
    ) {
      newState = {
        ...newState,
        successLikeDislikeCountVersion:
          nextProps.successLikeDislikeCountVersion,
      };
    }

    if (errorLikeDislikeCountVersion > prevState.errorLikeDislikeCountVersion) {
      newState = {
        ...newState,
        errorLikeDislikeCountVersion: nextProps.errorLikeDislikeCountVersion,
      };
    }

    if (successVideoViewsVersion > prevState.successVideoViewsVersion) {
      newState = {
        ...newState,
        successVideoViewsVersion: nextProps.successVideoViewsVersion,
      };
    }

    if (errorVideoViewsVersion > prevState.errorVideoViewsVersion) {
      newState = {
        ...newState,
        errorVideoViewsVersion: nextProps.errorVideoViewsVersion,
      };
    }
    return newState;
  }

  componentDidUpdate(prevProps, prevState) {
    const { subscriptionData, subscribedChannelData } = this.props;

    if (this.state.successSubscriptionDataVersion > prevState.successSubscriptionDataVersion) {
      // this.setState({ subscriptionDataSource: subscriptionData });
      this.setState({
        subscriptionDataSource:
          this.state.page === 0 ? subscriptionData : [...this.state.subscriptionDataSource, ...subscriptionData],
      });


    }

    if (this.state.errorSubscriptionDataVersion > prevState.errorSubscriptionDataVersion) {
      this.setState({ errorMsg: this.props.errorMsg.msg });
      // Toast.show({
      //   text: this.props.errorMsg.msg,
      //   type: 'danger',
      // });
    }

    if (
      this.state.successLikeDislikeCountVersion >
      prevState.successLikeDislikeCountVersion
    ) {

      if (this.state.subscriptionDataSource && this.props.likeDislikeData) {

        var array = _.find(actionArray, {
          videoid: this.props.likeDislikeData.videoId,
        });
        if (array == undefined) {
          actionArray.push({
            videoid: this.props.likeDislikeData.videoId,
            action: this.props.likeDislikeData.action ? 1 : 0,
          });
        } else {
          _.find(actionArray, {
            videoid: this.props.likeDislikeData.videoId,
          }).action = this.props.likeDislikeData.action ? 1 : 0;
        }

        var Index = _.findIndex(this.state.subscriptionDataSource, {
          videoid: parseInt(this.props.likeDislikeData.videoId),
        });

        if (Index !== -1) {

          this.state.subscriptionDataSource[Index].likeCount = parseInt(
            this.props.likeDislikeData.likesCount,
          );
          this.state.subscriptionDataSource[Index].dislikeCount = parseInt(
            this.props.likeDislikeData.dislikesCount,
          );

          var flag =
            this.props.likeDislikeData.operation == '1'
              ? this.props.likeDislikeData.action
                ? '1'
                : '0'
              : this.props.likeDislikeData.operation == '2'
                ? this.props.likeDislikeData.action
                  ? '2'
                  : '0'
                : '0';
          this.state.subscriptionDataSource[Index].operation = flag;

          this.setState(
            {
              likes: this.props.likeDislikeData.likesCount,
              disLike: this.props.likeDislikeData.dislikesCount,
            },
            () => {
              console.log(JSON.stringify(this.state.subscriptionDataSource));
            },
          );
        }
      }
    }

    if (this.state.errorLikeDislikeCountVersion > prevState.errorLikeDislikeCountVersion) {
      Toast.show({
        text: this.props.likeDislikeErrorMsg,
        type: 'danger',
      });
    }

    if (this.state.successSubscribedChannelDataVersion > prevState.successSubscribedChannelDataVersion) {
      this.setState({ subscribedChannelDataSource: subscribedChannelData });
    }

    if (
      this.state.errorSubscribedChannelDataVersion >
      prevState.errorSubscribedChannelDataVersion
    ) {
      Toast.show({
        text: this.props.errorSubscribedChannelMsg.msg,
        type: 'danger',
      });
    }

    if (this.state.successShareCountVersion > prevState.successShareCountVersion) {

      if (this.state.subscriptionDataSource && this.props.shareData) {
        var Index = _.findIndex(this.state.subscriptionDataSource, {
          videoid: parseInt(this.props.shareData.videoId),
        });

        this.state.subscriptionDataSource[Index].sharesCount = parseInt(
          this.props.shareData.sharesCount,
        );

        this.setState(
          {
            shares: this.props.shareData.sharesCount,
          },
          () => {
            console.log(JSON.stringify(this.state.subscriptionDataSource));
          },
        );
      }
    }

    if (this.state.errorShareCountVersion > prevState.errorShareCountVersion) {
      Toast.show({
        text: this.props.shareErrorMsg,
        type: 'danger',
      });
    }

    // VIEWS COUNT
    if (this.state.successVideoViewsVersion > prevState.successVideoViewsVersion) {
      var Index = _.findIndex(this.state.subscriptionDataSource, { videoid: parseInt(this.props.videoViewsData.videoId) });

      console.log("Index", Index);

      if (Index >= 0) {
        this.state.subscriptionDataSource[Index].views = parseInt(this.props.videoViewsData.viewsCount);

        console.log("this.state.subscriptionDataSource[Index].views", this.state.subscriptionDataSource[Index].views);

        this.setState({ views: this.props.videoViewsData.viewsCount }, () => {
          console.log(JSON.stringify(this.state.subscriptionDataSource))
        },
        );
      }
    }
    if (this.state.errorVideoViewsVersion > prevState.errorVideoViewsVersion) {
      Toast.show({
        text: this.props.videoViewsErrorMsg,
        type: 'danger',
        duration: 2500,
      })
    }


  }

  onChannelSelected = async (item, creatorId) => {
    let body = {
      payload: {
        userId: userId,
        creatorId: creatorId.toString(),
        startLimit: 0,
      },
    };

    let body1 = {
      payload: {
        userId: userId,
        creatorId: '',
        startLimit: 0,
      },
    };

    if (creatorId.toString() === this.state.creatorId) {
      await this.props.getSubscribedVideoList(body1);
      this.setState({ creatorId: '' })
    }
    else if (creatorId.toString() !== this.state.creatorId) {
      await this.props.getSubscribedVideoList(body);
      this.setState({ creatorId: creatorId.toString() })
    }

    this.setState({ page: 0 })

  }



  goToDetailsScreen = (item, screen) => {
    if (screen == "gift") {

      setTimeout(() => {
        this.props.navigation.navigate('VideoDetails', {
          videoData: item,
          actionArray,
          giftModalVisible: true
        });
      }, 200);
    }
    else {

      setTimeout(() => {
        this.props.navigation.navigate('VideoDetails', {
          videoData: item,
          actionArray,
        });
      }, 200);
    }

  };


  onGiftClick(item) {
    this.goToDetailsScreen(item, "gift")
  }


  onLikeClicked(data) {

    const { likeFlag } = this.state;
    if (actionArray.length == 0) {
      if (data.operation == 0 || data.operation == 2) {

        actionArray.push({
          videoid: data.videoid,
          action: 1,
        });
        var likerequestBody = {
          payload: {
            userId: userId,
            videoId: data.videoid,
            operation: '1',
            action: true,
          },
        };
        this.props.getLikeDislikeCount(likerequestBody);
      } else if (data.operation == 1) {
        actionArray.push({
          videoid: data.videoid,
          action: 0,
        });
        var likerequestBody = {
          payload: {
            userId: userId,
            videoId: data.videoid,
            operation: '1',
            action: false,
          },
        };
        this.props.getLikeDislikeCount(likerequestBody);
      }
    } else {

      var temp = _.find(actionArray, { videoid: data.videoid });

      if (temp !== undefined) {
        var array = _.find(actionArray, { videoid: data.videoid });
        var actionValue = array.action;
        if (actionValue == 2 || actionValue == 0) {
          _.find(actionArray, { videoid: data.videoid }).action = 1;
          var likerequestBody = {
            payload: {
              userId: userId,
              videoId: data.videoid,
              operation: '1',
              action: true,
            },
          };
          this.props.getLikeDislikeCount(likerequestBody);
        } else {

          _.find(actionArray, { videoid: data.videoid }).action = 0;
          var likerequestBody = {
            payload: {
              userId: userId,
              videoId: data.videoid,
              operation: '1',
              action: false,
            },
          };
          this.props.getLikeDislikeCount(likerequestBody);
        }
      } else {
        if (data.operation == 0 || data.operation == 2) {
          actionArray.push({
            videoid: data.videoid,
            action: 1,
          });
          var likerequestBody = {
            payload: {
              userId: userId,
              videoId: data.videoid,
              operation: '1',
              action: true,
            },
          };
          this.props.getLikeDislikeCount(likerequestBody);
        } else if (data.operation == 1) {
          actionArray.push({
            videoid: data.videoid,
            action: 0,
          });
          var likerequestBody = {
            payload: {
              userId: userId,
              videoId: data.videoid,
              operation: '1',
              action: false,
            },
          };
          this.props.getLikeDislikeCount(likerequestBody);
        }
      }
    }
  }

  onDisLikeClicked(data) {
    // debugger
    if (actionArray.length == 0) {
      // debugger
      if (data.operation == 0 || data.operation == 1) {
        actionArray.push({
          videoid: data.videoid,
          action: 2,
        });
        var likerequestBody = {
          payload: {
            userId: userId,
            videoId: data.videoid,
            operation: '2',
            action: true,
          },
        };
        this.props.getLikeDislikeCount(likerequestBody);
      } else if (data.operation == 2) {
        // debugger
        actionArray.push({
          videoid: data.videoid,
          action: 0,
        });
        var likerequestBody = {
          payload: {
            userId: userId,
            videoId: data.videoid,
            operation: '2',
            action: false,
          },
        };
        this.props.getLikeDislikeCount(likerequestBody);
      }
    } else {
      // debugger
      var disLikeTemp = _.find(actionArray, { videoid: data.videoid });

      if (disLikeTemp !== undefined) {
        var array = _.find(actionArray, { videoid: data.videoid });
        var actionValue = array.action;
        if (actionValue == 1 || actionValue == 0) {
          _.find(actionArray, { videoid: data.videoid }).action = 2;
          var likerequestBody = {
            payload: {
              userId: userId,
              videoId: data.videoid,
              operation: '2',
              action: true,
            },
          };
          this.props.getLikeDislikeCount(likerequestBody);
        } else {
          // debugger
          _.find(actionArray, { videoid: data.videoid }).action = 0;
          var likerequestBody = {
            payload: {
              userId: userId,
              videoId: data.videoid,
              operation: '2',
              action: false,
            },
          };
          this.props.getLikeDislikeCount(likerequestBody);
        }
      } else {
        if (data.operation == 0 || data.operation == 1) {
          // debugger
          actionArray.push({
            videoid: data.videoid,
            action: 2,
          });
          var likerequestBody = {
            payload: {
              userId: userId,
              videoId: data.videoid,
              operation: '2',
              action: true,
            },
          };
          this.props.getLikeDislikeCount(likerequestBody);
        } else {
          actionArray.push({
            videoid: data.videoid,
            action: 0,
          });
          var likerequestBody = {
            payload: {
              userId: userId,
              videoId: data.videoid,
              operation: '2',
              action: false,
            },
          };
          this.props.getLikeDislikeCount(likerequestBody);
        }
      }
    }
  }

  getSubscribedList(item, index) {
    return (
      <View
        style={{
          backgroundColor: color.videoListingbackgroundColor,
          flex: 1,
          justifyContent: 'center',
          marginBottom: hp(1),
        }}>
        <_Card>
          <_CardContent
            item={item}
            onPressShare={() =>
              this.shareVideo(urls.baseUrl + item.videoUrl, item)
            }
            onPressDetails={() => this.goToDetailsScreen(item)}
            onPressLike={() => this.onLikeClicked(item)}
            onPressDislike={() => this.onDisLikeClicked(item)}
            onPressGift={() => this.onGiftClick(item)}
          />
        </_Card>
      </View>
    );
  }

  shareVideo = async (url, item) => {
    const shareOptions = {
      title: 'Share file',
      email: 'gt20.ajinkya@gmail.com',
      url: url,
      social: Share.Social.INSTAGRAM,
      failOnCancel: false,
    };

    try {
      const ShareResponse = await Share.open(shareOptions);

      if (!ShareResponse.dismissedAction) {
        var sharePayload = {
          payload: {
            userId: userId,
            videoId: item.videoid,
          },
        };

        this.props.getShareCount(sharePayload);
      }
    } catch (error) {
      console.log('Error =>', error);
      //setResult('error: '.concat(getErrorString(error)))
    }
  };

  noRecordFound() {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: hp(10),
          flex: 1,
          backgroundColor: 'red',
        }}>
        <_Text fsHeading fwHeading textColor={color.tertiaryGray}>
          No Video Found for this subscriber
        </_Text>
      </View>
    );
  }

  getChannelList(item, index) {
    const {
      channelInnerView,
      channelImageView,
      channelImage,
      channelText,
    } = SubscribeChannelStyle;

    return (
      <View style={channelInnerView}>
        <TouchableOpacity
          style={{ alignItems: 'center' }}
          onPress={() => this.onChannelSelected(item, item.creatorId)}>
          <Animatable.View style={channelImageView} animation="zoomIn">
            <Animatable.Image
              duration={1000}
              animation="zoomIn"
              style={{
                height: hp(7), width: hp(7), borderRadius: hp(7) / 2,
                borderWidth: 3, resizeMode: 'cover',
                borderColor: (item.creatorId).toString() == this.state.creatorId ? "red" : color.borderOrange
              }}
              source={{ uri: urls.baseUrl + item.creatorPic }}
            // defaultSource={require('../../assets/img/defaultImage.png')}
            />
            {/* <Image
              resizeMode={'cover'}
              style={{ height: hp(7), width: hp(7), borderRadius:hp(7)/2,
                 borderWidth: 3, 
                 borderColor:(item.creatorId).toString() == this.state.creatorId ? "red" : color.borderOrange
                }}
              source={{uri: urls.baseUrl + item.creatorPic}}
              defaultSource={require('../../assets/img/defaultImage.png')}
            /> */}
          </Animatable.View>

          <View style={channelText}>
            <_Text
              numberOfLines={1}
              fsSmall
              fwPrimary
              textColor={color.tertiaryGray}>
              {item.creatorName}
            </_Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }


  LoadMoreData = () => {
    this.setState({
      page: this.state.page + 1,
      clickedLoadMore: true,
    },
      () => this.LoadRandomData(),
    );
  };

  LoadRandomData = async () => {
    const { page } = this.state;

    let data = {
      payload: {
        userId: userId,
        creatorId: this.state.creatorId ? this.state.creatorId : '',
        startLimit: page,
      },
    };

    await this.props.getSubscribedVideoList(data);

  };


  footer = () => {
    return (
      <View>
        {!this.props.isFetching && this.state.subscriptionDataSource.length >= 10 ? (
          <TouchableOpacity onPress={() => this.LoadMoreData()}>
            <View
              style={{
                flex: 1,
                height: hp(7),
                width: wp(100),
                backgroundColor: '#EEF8F7',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{ color: '#0d185c', fontSize: 18, fontWeight: 'bold' }}>
                Show More
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
        {this.state.clickedLoadMore &&
          this.props.isFetching &&
          this.state.subscriptionDataSource.length >= 10 ? (
            <View
              style={{
                flex: 1,
                height: 40,
                width: wp(100),
                backgroundColor: '#EEF8F7',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="small" color='gray' />
            </View>
          ) : null}
      </View>
    );
  };




  render() {
    const { subscriptionDataSource, trendingDataSource, clickedLoadMore } = this.state;
    const {
      mainContainer,
      mainScrollView,
      channelMainView,
    } = SubscribeChannelStyle;

    const { isFetching, subscribedChannelData, errorSubscription } = this.props;

    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={mainScrollView}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => this.onPullRefresh()}
            />
          }>
          <View style={channelMainView}>
            {subscribedChannelData.length !== 0 ? (
              <FlatList
                horizontal={true}
                data={subscribedChannelData}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={this.FlatListItemSeparator}
                renderItem={({ item, index }) => this.getChannelList(item, index)}
                keyExtractor={(item, index) => item.id}
              />
            ) : null}
          </View>

          <View style={{ backgroundColor: '#fff', marginTop: hp(1) }}>
            {subscriptionDataSource ? (
              <FlatList
                data={subscriptionDataSource}
                ListEmptyComponent={this.noRecordFound()}
                onViewableItemsChanged={this.onViewableItemsChanged}
                viewabilityConfig={{
                  viewAreaCoveragePercentThreshold: 100,
                }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) =>
                  this.getSubscribedList(item, index)
                }
                keyExtractor={(item, index) => item.videoid.toString()}
                //  onEndReached={this.LoadMoreData}
                // onEndReachedThreshold={0.5}
                ListFooterComponent={this.footer}

              />
            ) : null}
          </View>
        </ScrollView>
        {!clickedLoadMore && isFetching ? (
          <View
            style={{
              position: 'absolute',
              height: hp(80),
              width: wp(100),
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
            }}>
            <ActivityIndicator size="large" color={color.tertiaryGray} />
          </View>
        ) : null}

        {errorSubscription ? (
          <View
            style={{
              position: 'absolute',
              height: hp(90),
              width: wp(100),
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
            }}>
            <_Text>{this.state.errorMsg}</_Text>
          </View>
        ) : null}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.subscribeChannelReducer.isFetching,
    subscriptionData: state.subscribeChannelReducer.subscriptionData,
    errorSubscription: state.subscribeChannelReducer.errorSubscription,
    errorMsg: state.subscribeChannelReducer.errorMsg,
    successSubscriptionDataVersion:
      state.subscribeChannelReducer.successSubscriptionDataVersion,
    errorSubscriptionDataVersion:
      state.subscribeChannelReducer.errorSubscriptionDataVersion,

    subscribedChannelData: state.subscribeChannelReducer.subscribedChannelData,
    errorSubscribedChannel:
      state.subscribeChannelReducer.errorSubscribedChannel,
    errorSubscribedChannelMsg:
      state.subscribeChannelReducer.errorSubscribedChannelMsg,
    successSubscribedChannelDataVersion:
      state.subscribeChannelReducer.successSubscribedChannelDataVersion,
    errorSubscribedChannelDataVersion:
      state.subscribeChannelReducer.errorSubscribedChannelDataVersion,

    shareData: state.videoListingReducer.shareData,
    shareError: state.videoListingReducer.shareError,
    shareErrorMsg: state.videoListingReducer.shareErrorMsg,
    errorShareCountVersion: state.videoListingReducer.errorShareCountVersion,
    successShareCountVersion:
      state.videoListingReducer.successShareCountVersion,

    likeDislikeData: state.subscribeChannelReducer.likeDislikeData,
    likeDislikeError: state.subscribeChannelReducer.likeDislikeError,
    likeDislikeErrorMsg: state.subscribeChannelReducer.likeDislikeErrorMsg,
    errorLikeDislikeCountVersion:
      state.subscribeChannelReducer.errorLikeDislikeCountVersion,
    successLikeDislikeCountVersion:
      state.subscribeChannelReducer.successLikeDislikeCountVersion,

    videoViewsData: state.subscribeChannelReducer.videoViewsData,
    successVideoViewsVersion: state.subscribeChannelReducer.successVideoViewsVersion,
    errorVideoViewsVersion: state.subscribeChannelReducer.errorVideoViewsVersion,
    videoViewsErrorMsg: state.subscribeChannelReducer.videoViewsErrorMsg,
    videoViewsError: state.subscribeChannelReducer.videoViewsError,

  };
}

const mapDispatchToProps = dispatch => ({
  getSubscribedVideoList: requestPayload =>
    dispatch(getSubscribedVideoList(requestPayload)),
  getSubscribedChannelList: requestPayload =>
    dispatch(getSubscribedChannelList(requestPayload)),
  getShareCount: requestBody => dispatch(getShareCount(requestBody)),
  getLikeDislikeCount: requestBody =>
    dispatch(getLikeDislikeCount(requestBody)),
  resetReducer: () => dispatch(resetAllReducer()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubscribeChannel);
