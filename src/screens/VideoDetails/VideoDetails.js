//import liraries
import React, { Component, createRef } from 'react';
import { CommonActions } from '@react-navigation/native';

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
  SafeAreaView,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator,
  BackHandler,
  Modal,
  Alert,
} from 'react-native';
import VideoPlayer from 'react-native-video-controls';

import { Col, Row, Grid } from 'react-native-easy-grid';
import { Toast, Icon } from 'native-base';
import Video, {
  OnSeekData,
  OnLoadData,
  OnProgressData,
} from 'react-native-video';
import { color } from '@values/colors';
import { ScrollView } from 'react-native-gesture-handler';
import _ from 'lodash';
import UpNextVideos from '@videoDetails/UpNextVideos';

import { sendGift } from '@sendPayment/GiftAction';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Share from 'react-native-share';
import { urls } from '@api/urls';
import { strings } from '@values/strings';
import _Text from '@text/_Text';
import { connect } from 'react-redux';
import styles from '@videoDetails/VideoDetailsStyle';
import Orientation from 'react-native-orientation-locker';
import PlayControls from '@videoControls/PlayControls';
import ProgressBar from '@videoControls/ProgressBar';
import Moment from 'moment';
import {
  getVideoList,
  getShareCount,
  getLikeDislikeCount,
} from '@videoListing/VideoListingAction';
import {
  getVideoDetails,
  getOtherDetails,
  isSubcribed,
  subscribedClicked,
  getViewsCount,
} from '@videoDetails/VideoDetailsAction';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

var userId = '';
var finalDisLikeCount = '';
var finalDisLikeCount = '';

var actionArray = [];

var subscriptionArray = [];
var categoryId = '';
var createrName = '';
var createrId = '';
var videoKey = '';
var createrLogo = '';

const AnimatedIcon = Animatable.createAnimatableComponent(Icon)


class VideoDetails extends Component {
  constructor(props) {
    super(props);
    const data = this.props.route.params.videoData;
    this.state = {
      rate: 1,
      volume: 1,
      muted: false,
      resizeMode: 'contain',
      duration: 0.0,
      currentTime: 0.0,
      playableTime: 0.0,
      paused: true,
      remainingTime: 0.0,
      successVideoDetailsDataVersion: 0,
      errorVideoDetailsDataVersion: 0,
      videoDataSource: '',
      showFlag: false,
      fullScreen: false,
      play: true,
      showControls: false,
      likes: data.likeCount,
      disLikes: data.dislikeCount,
      successCategoryDataVersion: 0,
      errorCategoryDataVersion: 0,
      otherCategorySource: '',
      stopUpdate: false,
      buffering: true,
      animated: new Animated.Value(0),

      successLikeDislikeCountVersion: 0,
      errorLikeDislikeCountVersion: 0,
      likes: '',
      disLike: '',
      subscriptionSuccessCountVersion: 0,
      subscriptionErrorCountVersion: 0,
      isSubscribed: '',
      subscribedErrorVersion: 0,
      subscribedSuccessVersion: 0,
      subScribtionFlag: true,
      changedSubscribtionTextColor: false,
      successShareCountVersion: 0,
      errorShareCountVersion: 0,
      giftModalVisible: false,
      errorVideoViewsVersion: 0,
      successVideoViewsVersion: 0,

      successGiftVersion: 0,
      errorGiftVersion: 0,
      giftDataSource: [],
      selectedGiftData: [],
      giftId: '',
      successGiftDataVersion: 0,
      errorGiftDataVersion: 0,
    };
    this.videoRef = createRef();
    userId = global.userId;
    categoryId = this.props.route.params.videoData.categoryId;
    actionArray = this.props.route.params.actionArray;
    createrId = this.props.route.params.videoData.createrId;
    createrName = this.props.route.params.videoData.createrName;
    createrLogo = this.props.route.params.videoData.createrLogo;
    videoKey = this.props.route.params.videoData.videoid;
    this.state.giftModalVisible =
      this.props.route.params.giftModalVisible == undefined ? false : true;
  }

  componentDidMount() {
    var requestPayload = {
      payload: {
        userId: userId,
        creatorId: createrId,
      },
    };

    this.props.isSubcribed(requestPayload);

    var requestBody = {
      payload: {
        categoryId: categoryId,
        startLimit: '0',
        userId: userId,
      },
    };

    var requestOtherVideo = {
      categoryId: categoryId,
    };
    this.props.getVideoDetails(requestBody);
    this.props.getOtherDetails(requestOtherVideo);

    // Orientation.addOrientationListener(this.handleOrientation);

    // this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    //   this.props.navigation.goBack();
    // });

    // const that = this;

    // this.backHandlerTwo = BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   () => {
    //     var initial = Orientation.getInitialOrientation();

    //     if (initial === 'LANDSCAPE-RIGHT' || initial === 'LANDSCAPE-LEFT') {
    //       Orientation.lockToPortrait();
    //     } else {
    //       that.props.navigation.goBack();
    //     }
    //     return true;
    //   },
    // );
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      successVideoDetailsDataVersion,
      errorVideoDetailsDataVersion,
      successLikeDislikeCountVersion,
      successCategoryDataVersion,
      errorLikeDislikeCountVersion,
      errorCategoryDataVersion,
      subscriptionSuccessCountVersion,
      subscribedErrorVersion,
      subscribedSuccessVersion,

      errorShareCountVersion,
      successShareCountVersion,
      successVideoViewsVersion,
      errorVideoViewsVersion,

      successGiftVersion,
      errorGiftVersion,
      successGiftDataVersion,
      errorGiftDataVersion,
    } = nextProps;

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

    if (successGiftVersion > prevState.successGiftVersion) {
      newState = {
        ...newState,
        successGiftVersion: nextProps.successGiftVersion,
      };
    }

    if (errorGiftVersion > prevState.errorGiftVersion) {
      newState = {
        ...newState,
        errorGiftVersion: nextProps.errorGiftVersion,
      };
    }

    if (
      successVideoDetailsDataVersion > prevState.successVideoDetailsDataVersion
    ) {
      newState = {
        ...newState,
        successVideoDetailsDataVersion:
          nextProps.successVideoDetailsDataVersion,
      };
    }

    if (successCategoryDataVersion > prevState.successCategoryDataVersion) {
      newState = {
        ...newState,
        successCategoryDataVersion: nextProps.successCategoryDataVersion,
      };
    }

    if (errorCategoryDataVersion > prevState.errorCategoryDataVersion) {
      newState = {
        ...newState,
        errorCategoryDataVersion: nextProps.errorCategoryDataVersion,
      };
    }

    if (errorVideoDetailsDataVersion > prevState.errorVideoDetailsDataVersion) {
      newState = {
        ...newState,
        errorVideoDetailsDataVersion: nextProps.errorVideoDetailsDataVersion,
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

    if (
      subscriptionSuccessCountVersion >
      prevState.subscriptionSuccessCountVersion
    ) {
      newState = {
        ...newState,
        subscriptionSuccessCountVersion:
          nextProps.subscriptionSuccessCountVersion,
      };
    }

    if (subscribedSuccessVersion > prevState.subscribedSuccessVersion) {
      newState = {
        ...newState,
        subscribedSuccessVersion: nextProps.subscribedSuccessVersion,
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
    const {
      videoDetailsData,
      likesCount,
      dislikesCount,
      otherCategoryData,
      isSubscribed,
      videoViewsData,
      giftSendErrorMsg
    } = this.props;


    // IF FULLSCREEN AND BACKBUTTON PRESSED
    let that = this;
    if (prevState.fullScreen) {
      BackHandler.addEventListener('hardwareBackPress', () => {
        Orientation.unlockAllOrientations();
        StatusBar.setHidden(false);
        that.setState({ fullScreen: false });
        return true;
      },
      );
    } else if (!this.state.fullScreen) {
      BackHandler.addEventListener('hardwareBackPress', () => {
        that.props.navigation.goBack()
        return true;
      },
      );
    }

    if (
      this.state.successVideoDetailsDataVersion >
      prevState.successVideoDetailsDataVersion
    ) {
      this.setState({ videoDataSource: videoDetailsData });
    }

    if (
      this.state.successCategoryDataVersion >
      prevState.successCategoryDataVersion
    ) {
      this.setState({ otherCategorySource: otherCategoryData });
    }
    if (
      this.state.successLikeDislikeCountVersion >
      prevState.successLikeDislikeCountVersion
    ) {
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
      this.props.route.params.videoData.operation = flag;

      //debugger;
      this.props.route.params.videoData.likeCount = parseInt(
        this.props.likeDislikeData.likesCount,
      );
      this.props.route.params.videoData.dislikeCount = parseInt(
        this.props.likeDislikeData.dislikesCount,
      );
      this.setState(
        {
          likes: this.props.likeDislikeData.likesCount,
          disLike: this.props.likeDislikeData.dislikesCount,
        },
        () => {
          console.log(
            JSON.stringify(this.props.route.params.videoData.likeCount),
          );
        },
      );
    }

    if (
      this.state.errorLikeDislikeCountVersion >
      prevState.errorLikeDislikeCountVersion
    ) {
      Toast.show({
        text: this.props.likeDislikeErrorMsg,
        type: 'danger',
      });
    }

    if (
      this.state.subscriptionSuccessCountVersion >
      prevState.subscriptionSuccessCountVersion
    ) {
      this.setState({ isSubscribed: isSubscribed });

      if (this.props.isSubscribed.subscribeFlag == true) {
        this.setState({ changedSubscribtionTextColor: false });
      } else {
        this.setState({ changedSubscribtionTextColor: true });
      }
    }

    if (
      this.state.subscribedSuccessVersion > prevState.subscribedSuccessVersion
    ) {
      if (this.props.subscribed.subscribeFlag == true) {
        this.setState({ changedSubscribtionTextColor: false });
      } else {
        this.setState({ changedSubscribtionTextColor: true });
      }

      Toast.show({
        text: this.props.subscribed.msg,
        type: 'success',
      });
    }

    if (
      this.state.errorVideoDetailsDataVersion >
      prevState.errorVideoDetailsDataVersion
    ) {
      Toast.show({
        text: this.props.errorMsg,
        type: 'success',
      });
    }

    if (this.state.successGiftVersion > prevState.successGiftVersion) {
      this.setState({ giftDataSource: this.props.giftData });
    }



    if (this.state.successGiftDataVersion > prevState.successGiftDataVersion) {
      this.setState({ giftModalVisible: false })
      this.props.navigation.navigate('GiftSuccess');
    }

    if (this.state.errorGiftDataVersion > prevState.errorGiftDataVersion) {
      this.setState({ giftModalVisible: false })
      alert(giftSendErrorMsg);
    }

    // VIEWS COUNT
    if (
      this.state.successVideoViewsVersion > prevState.successVideoViewsVersion
    ) {
      this.props.route.params.videoData.views = parseInt(
        this.props.videoViewsData.viewsCount,
      );
    }

    if (this.state.errorVideoViewsVersion > prevState.errorVideoViewsVersion) {
      Toast.show({
        text: this.props.videoViewsErrorMsg,
        type: 'danger',
        duration: 2500,
      });
    }
    // if (prevProps.fullScreen !== this.state.fullScreen) {
    //   this.setState({ fullScreen: this.state.fullScreen });
    // }
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this.handleOrientation);
    BackHandler.removeEventListener('hardwareBackPress');

  }

  handleOrientation(orientation) {
    if (['LANDSCAPE-RIGHT', 'LANDSCAPE-LEFT'].includes(orientation)) {
      StatusBar.setHidden(true);
    } else {
      StatusBar.setHidden(false);
    }
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

  onGiftPress() {
    this.setState({ giftModalVisible: true, selectedGiftData: [] });
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

  handleFullscreen = () => {
    if (this.state.fullScreen) {
      Orientation.unlockAllOrientations();
      StatusBar.setHidden(false);
      this.setState({ fullScreen: false });
    } else {
      Orientation.lockToLandscapeLeft();
      StatusBar.setHidden(true)
      // StatusBar.setHidden(false);
      this.setState({ fullScreen: true });
    }
  };

  // handleFullscreenTwo = () => {
  //   if (this.state.fullScreen) {
  //     Orientation.unlockAllOrientations()
  //     //StatusBar.setHidden(false)

  //     this.setState({ fullScreen: false, stopUpdate: false })
  //   }
  //   else {
  //     Orientation.lockToLandscapeLeft()
  //     //StatusBar.setHidden(true)

  //     this.setState({ fullScreen: true, stopUpdate: true })
  //   }
  // }

  handlePlayPause = () => {
    // If playing, pause and show controls immediately.
    if (this.state.play) {
      this.setState({ play: false, showControls: true });
      return;
    } else {
      this.setState({ play: true });
      setTimeout(() => this.setState({ showControls: false }), 2000);
    }
  };

  skipBackward = () => {
    this.videoRef.current.seek(this.state.currentTime - 10);
    this.setState({ currentTime: this.state.currentTime - 10 });
  };

  skipForward = () => {
    this.videoRef.current.seek(this.state.currentTime + 10);
    this.setState({ currentTime: this.state.currentTime + 10 });
  };

  onSeek = data => {
    this.videoRef.current.seek(data.seekTime);
    this.setState({ currentTime: data.seekTime });
  };

  onLoad = data => {

    const { createrId, videoid } = this.props.route.params.videoData;

    this.setState({
      duration: data.duration,
      currentTime: data.currentTime,
    });

    this.props.getViewsCount({ createrId, videoid });

    setTimeout(() => this.setState({ showControls: false }), 2000);
  };

  // for custom video controls use this function

  onProgress = data => {
    this.setState({
      currentTime: data.currentTime,
      playableTime: data.playableDuration,
    });
  };

  onEnd = async () => {
    await this.videoRef.current.seek(0);
    this.setState({ play: false, showControls: true });
  };

  showControls = () => {
    this.state.showControls
      ? this.setState({ showControls: false })
      : this.setState({ showControls: true });
  };

  selectedGift(item) {
    this.setState({ selectedGiftData: item, giftId: item.giftId });

  }

  getGiftView(item) {

    return (
      <TouchableOpacity
        onPress={() => this.selectedGift(item)}
        style={{
          width: wp(25),
          height: hp(15),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: hp(8),
            width: hp(8),
            borderWidth: 3,
            borderRadius: 7,
            borderColor:
              item.giftId.toString() == this.state.giftId
                ? 'red'
                : 'rgba(0,0,0,0.0)',
          }}>
          <Image
            source={{
              uri: item.giftIcon ? urls.baseUrl + item.giftIcon : null,
            }}
            style={{
              height: hp(6),
              width: hp(6),
            }}
          />
        </View>
        <_Text
          fsSmall
          numberOfLines={1}
          style={{ paddingTop: hp(1) }}
          textColor={color.white}>
          {item.giftName}
        </_Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          {item.amount !== 0 ? (
            <Image
              source={require('../../assets/img/coin.png')}
              style={{ height: hp(2), width: hp(2) }}
            />
          ) : null}

          <_Text
            numberOfLines={1}
            fsSmall
            textColor={item.amount == 0 ? color.subscribeColor : color.white}
            style={{ paddingLeft: wp(1) }}>
            {item.amount == 0 ? 'Free' : item.amount}
          </_Text>
        </View>
      </TouchableOpacity>
    );
  }


  // for video control plugin

  // onLoad = (data) => {
  //   var minutes = Math.floor(data.duration / 60)
  //   var seconds = data.duration - minutes * 60
  //   this.setState({ duration: { min: minutes, sec: seconds } })
  // }

  // onProgress = (data) => {
  //   if (data.currentTime !== this.state.duration) {
  //     const time = data.seekableDuration - data.currentTime
  //     var progressTime = `${this.formatTime(time, data.seekableDuration)}`;
  //     this.setState({
  //       currentTime: data.currentTime,
  //       remainingTime: progressTime
  //     })
  //   }
  // }

  // onAudioBecomingNoisy = () => {
  //   this.setState({ paused: true })
  // }

  // onAudioFocusChanged = (event) => {
  //   this.setState({ paused: !event.hasAudioFocus })
  // }

  videoError = error => {
    alert(error);
  };

  shareVideo = async (url, item) => {
    var res = encodeURI(url);

    const shareOptions = {
      message: res
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
    }
  };


  formatTime(time = 0, duration) {
    time = Math.min(Math.max(time, 0), duration);

    const formattedMinutes = _.padStart(Math.floor(time / 60).toFixed(0), 2, 0);
    const formattedSeconds = _.padStart(Math.floor(time % 60).toFixed(0), 2, 0);

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  getDescriptionView(videoData) {
    const { showFlag } = this.state;
    var date = new Date(videoData.uploadedDate).toUTCString();
    return (
      <View
        style={{
          backgroundColor: color.white,
          paddingLeft: hp(3),
          paddingRight: wp(3),
          paddingTop: hp(1.5),
        }}>
        <View style={{ flexDirection: 'row' }}>
          <_Text fsSmall textColor={color.lightGray}>
            Published on
          </_Text>
          <_Text
            fsSmall
            textColor={color.lightGray}
            style={{ paddingLeft: wp(1) }}>
            {date.slice(0, 16)}
          </_Text>

          {/* <_Text fsSmall textColor={color.lightGray} style={{ paddingLeft: wp(1) }}>{Moment(date).format('DD MMM YYYY')}</_Text> */}
        </View>
        <_Text style={{ paddingTop: hp(1) }} fsSmall textColor={color.lightGray}>
          Description
        </_Text>
        <_Text fsSmall textColor={color.lightGray} style={{ paddingLeft: wp(1) }}>
          {videoData.description}
        </_Text>
      </View>
    );
  }

  getFlagTrue(showFlag) {
    if (showFlag == false) {
      this.setState({ showFlag: true });
    } else {
      this.setState({ showFlag: false });
    }
  }

  onSubscribedClick() {
    if (subscriptionArray.length == 0) {
      if (this.state.isSubscribed.subscribeFlag == true) {
        Alert.alert(
          'Do You Want To UnFollow This Channel',
          '',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'UNFOLLOW',
              onPress: () => {
                subscriptionArray.push({
                  createrId: createrId,
                  action: 0,
                });
                var requestBody = {
                  payload: {
                    userId: userId,
                    creatorId: createrId,
                    subscribeFlag: false,
                  },
                };

                this.props.subscribedClicked(requestBody);
              },
            },
          ],
          { cancelable: false },
        );
      } else if (this.state.isSubscribed.subscribeFlag == false) {
        subscriptionArray.push({
          createrId: createrId,
          action: 1,
        });
        var requestBody = {
          payload: {
            userId: userId,
            creatorId: createrId,
            subscribeFlag: true,
          },
        };
        this.props.subscribedClicked(requestBody);
      }
    } else {
      var temp = _.find(subscriptionArray, { createrId: createrId });

      if (temp !== undefined) {
        var array = _.find(subscriptionArray, { createrId: createrId });
        var actionValue = array.action;
        if (actionValue == 1) {
          Alert.alert(
            'Do You Want To Unsubscribe This Channel',
            '',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'UNSUBSCRIBE',
                onPress: () => {
                  _.find(subscriptionArray, { createrId: createrId }).action = 0;
                  var requestBody = {
                    payload: {
                      userId: userId,
                      creatorId: createrId,
                      subscribeFlag: false,
                    },
                  };
                  this.props.subscribedClicked(requestBody);
                },
              },
            ],
            { cancelable: false },
          );
        } else {
          _.find(subscriptionArray, { createrId: createrId }).action = 1;
          var requestBody = {
            payload: {
              userId: userId,
              creatorId: createrId,
              subscribeFlag: true,
            },
          };
          this.props.subscribedClicked(requestBody);
        }
      } else {
        if (this.state.isSubscribed.subscribeFlag == true) {
          Alert.alert(
            'Do You Want To Unsubscribe This Channel',
            '',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'UNSUBSCRIBE',
                onPress: () => {
                  subscriptionArray.push({
                    createrId: createrId,
                    action: 0,
                  });
                  var requestBody = {
                    payload: {
                      userId: userId,
                      creatorId: createrId,
                      subscribeFlag: false,
                    },
                  };
                  this.props.subscribedClicked(requestBody);
                },
              },
            ],
            { cancelable: false },
          );
        } else if (this.state.isSubscribed.subscribeFlag == false) {
          subscriptionArray.push({
            createrId: createrId,
            action: 1,
          });
          var requestBody = {
            payload: {
              userId: userId,
              creatorId: createrId,
              subscribeFlag: true,
            },
          };
          this.props.subscribedClicked(requestBody);
        }
      }
    }
  }

  sendGift() {
    if (this.state.selectedGiftData.length !== 0) {

      if (this.state.selectedGiftData.amount !== 0) {

        this.setState({ giftModalVisible: false, giftId: '' });
        setTimeout(() => {
          this.props.navigation.navigate('SendPayment', {
            selectedGift: this.state.selectedGiftData,
            createrId: createrId,
            videokey: videoKey,
            createrName: createrName,
            createrLogo: createrLogo,
          });
        }, 200);
      } else {
        var payload = {
          payload: {
            userId: userId,
            creatorId: createrId,
            giftId: this.state.selectedGiftData.giftId,
            videoId: videoKey,
            giftFlag: false,
            walletFlag: false,
          },
        };

        this.props.sendGift(payload);
        this.setState({ giftModalVisible: false, giftId: '' })
      }
    } else {
      alert("Please Select Emoji's to Send");
    }
  }

  navigateBack = () => {
    if (this.state.fullScreen) {
      Orientation.unlockAllOrientations();
      StatusBar.setHidden(false);
      this.setState({ fullScreen: false });
    }
    else {
      this.props.navigation.goBack();
    }
  };

  handleLoadStart = () => {
    this.triggerBufferAnimation();
  };

  triggerBufferAnimation = () => {
    this.loopingAnimation && this.loopingAnimation.stopAnimation();
    this.loopingAnimation = Animated.loop(
      Animated.timing(this.state.animated, {
        toValue: 1,
        duration: 1000,
        delay: 300,
      }),
    ).start();
  };

  handleBuffer = meta => {
    meta.isBuffering && this.triggerBufferAnimation();

    if (this.loopingAnimation && !meta.isBuffering) {
      this.loopingAnimation.stopAnimation();
    }

    this.setState({
      buffering: meta.isBuffering,
    });
  };

  onLike = () => {
    this.smallAnimatedIcon.bounceIn()
    this.props.onPressLike()
  }

  handleSmallAnimatedIconRef = (ref) => {
    this.smallAnimatedIcon = ref
  }


  render() {
    const {
      fullScreen,
      rate,
      duration,
      muted,
      paused,
      isfullScreen,
      play,
      currentTime,
      showControls,
      buffering,
      remainingTime,
      videoDataSource,
      showFlag,
      giftDataSource,
      subScribtionFlag,
      likes,
      disLike,
      disLikes,
      views,
      otherCategorySource,
      playableTime,
      changedSubscribtionTextColor,
      giftModalVisible,
      giftId
    } = this.state;

    const { videoData } = this.props.route.params;

    const interpolatedAnimation = this.state.animated.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    const rotateStyle = {
      transform: [{ rotate: interpolatedAnimation }],
    };

    return (
      <View style={styles.container}>
        <SafeAreaView>
          <ScrollView scrollEnabled={fullScreen ? false : true} >
            <TouchableOpacity disabled={buffering} onPress={this.showControls}>
              <View style={buffering ? styles.buffering : undefined}>
                <Video
                  ref={this.videoRef}
                  source={{ uri: urls.baseUrl + videoData.videoUrl }}
                  style={fullScreen ? styles.fullscreenVideo : styles.video}
                  resizeMode={'cover'}
                  repeat={false}
                  controlTimeout={3000}
                  controls={false}
                  onLoadStart={this.handleLoadStart}
                  onBuffer={this.handleBuffer}
                  onLoad={this.onLoad}
                  onProgress={this.onProgress}
                  onEnd={this.onEnd}
                  paused={!play}
                />
                {buffering && (
                  <View style={styles.videoLoading}>
                    <ActivityIndicator size="large" color="white" />
                    {/* <Animated.View style={rotateStyle}>
                    <ActivityIndicator size='large' color='white' />
                  </Animated.View> */}
                  </View>
                )}
              </View>

              {showControls && (
                <View style={styles.controlOverlay}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      onPress={() => this.navigateBack()}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={{
                        alignSelf: 'flex-start',
                        alignItems: 'flex-start',
                        padding: 10,
                      }}>
                      <Image
                        defaultSource={require('../../assets/img/whiteleftarrow.png')}
                        source={require('../../assets/img/whiteleftarrow.png')}
                        style={{ height: 20, width: 20 }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => this.handleFullscreen()}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      style={styles.fullscreenButton}>
                      {fullScreen ? (
                        <Image
                          defaultSource={require('../../assets/img/fullscreenExit.png')}
                          source={require('../../assets/img/fullscreenExit.png')}
                          style={{ height: 20, width: 20 }}
                        />
                      ) : (
                          <Image
                            defaultSource={require('../../assets/img/fullscreen.png')}
                            source={require('../../assets/img/fullscreen.png')}
                            style={{ height: 20, width: 20 }}
                          />
                        )}
                    </TouchableOpacity>
                  </View>

                  <PlayControls
                    onPlay={this.handlePlayPause}
                    onPause={this.handlePlayPause}
                    playing={play}
                    showPreviousAndNext={false}
                    showSkip={true}
                    skipBackwards={this.skipBackward}
                    skipForwards={this.skipForward}
                  />
                  <ProgressBar
                    currentTime={currentTime}
                    playableTime={playableTime}
                    duration={duration > 0 ? duration : 0}
                    onSlideStart={this.handlePlayPause}
                    onSlideComplete={this.handlePlayPause}
                    onSlideCapture={this.onSeek}
                  />
                </View>
              )}
            </TouchableOpacity>

            {/* <View style={styles.videoBannerStyle}>
            <VideoPlayer
              navigator={this.props.navigation}
              source={{uri: urls.baseUrl + videoData.videoUrl}}
              ref={(ref) => {
                this.player = ref
              }}
              onBuffer={this.onBuffer}
              onError={this.videoError}
              onLoad={this.onLoad}
              onProgress={this.onProgress}
              onEnd={this.onEnd}
              onAudioBecomingNoisy={this.onAudioBecomingNoisy}
              onAudioFocusChanged={this.onAudioFocusChanged}
              style={styles.backgroundVideo}
              resizeMode={'cover'}
              rate={rate}
              repeat={false}
              controlTimeout={3000}
              disableVolume={true}
              disableTimer={true}
               toggleResizeModeOnFullscreen={true}
            />
            <View style={styles.videoTime}>
              {!duration ?
                <View style={styles.videoTime2}>
                  <_Text fsSmall fwSmall textColor={color.white} >0.00</_Text>
                </View>
                :
                <View style={styles.videoTime2}>
                  <_Text fsSmall fwSmall textColor={color.white} >
                    {remainingTime}
                  </_Text>
                </View>
              }
            </View>
          </View>
         */}

            <ScrollView showsVerticalScrollIndicator={false}
              scrollEnabled={fullScreen ? false : true}
            >
              <View
                style={{
                  width: wp(100),
                  height: hp(6),
                  backgroundColor: '#1a1c19',
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: wp(2),
                    paddingRight: wp(2),
                  }}>
                  <View
                    style={{
                      flex: 0.7,
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => this.onLikeClicked(videoData)}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}>
                      {videoData.operation == 0 || videoData.operation == 2 ? (
                        <Image
                          source={require('../../assets/img/whiteHeartBordered.png')}
                          style={{
                            resizeMode: 'contain',
                            height: hp(2.5),
                            width: hp(2.5),
                          }}
                        />
                      ) : (
                          <Image
                            source={require('../../assets/img/redHeartColored.png')}
                            style={{
                              resizeMode: 'contain',
                              height: hp(2.5),
                              width: hp(2.5),
                            }}
                          />
                        )}

                      <_Text
                        numberOfLines={1}
                        fsSmall
                        style={{ paddingLeft: wp(2) }}
                        textColor={color.white}>
                        {videoData.likeCount} Likes
                      </_Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flex: 0.1,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                      onPress={() => this.onGiftPress()}>
                      <Image
                        source={require('../../assets/img/giftWhite.png')}
                        style={{
                          resizeMode: 'contain',
                          height: hp(2.5),
                          width: hp(2.5),
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flex: 0.1,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity>
                      <Image
                        source={require('../../assets/img/watchLater.png')}
                        style={{
                          resizeMode: 'contain',
                          height: hp(2.5),
                          width: hp(2.5),
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flex: 0.1,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        this.shareVideo(
                          urls.baseUrl + videoData.videoUrl,
                          videoData,
                        )
                      }>
                      <Image
                        source={require('../../assets/img/share1.png')}
                        style={{
                          resizeMode: 'contain',
                          height: hp(2.5),
                          width: hp(2.5),
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View>
                <View
                  style={{
                    paddingTop: hp(1.5),
                    paddingLeft: wp(3),
                    paddingRight: wp(3),
                  }}>
                  <_Text
                    numberOfLines={2}
                    fsHeading
                    bold
                    textColor={color.tertiaryGray}>
                    {videoData.videoTitle}
                  </_Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      paddingTop: hp(0.5),
                      alignItems: 'center',
                    }}>
                    <View style={{ flex: 0.9, flexDirection: 'row' }}>
                      <_Text fsSmall textColor={color.lightGray}>
                        {videoData.views ? videoData.views : 0} Views •{' '}
                      </_Text>
                      <_Text fsSmall textColor={color.lightGray}>
                        {videoData.categoryName}
                      </_Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => this.getFlagTrue(showFlag)}
                      style={{ flex: 0.1 }}>
                      <Image
                        source={
                          !showFlag
                            ? require('../../assets/img/downArrow.png')
                            : require('../../assets/img/upArrow.png')
                        }
                        style={{
                          resizeMode: 'contain',
                          height: hp(2),
                          width: hp(2),
                          alignSelf: 'flex-end',
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{ marginTop: hp(1.5) }}>
                  <View
                    style={{
                      borderTopColor: color.primaryGray,
                      borderTopWidth: hp(0.1),
                    }}
                  />
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View
                      style={{
                        flex: 0.18,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: hp(1),
                      }}>
                      <Image
                        resizeMode={'cover'}
                        style={{
                          height: hp(6),
                          width: hp(6),
                          borderRadius: hp(6) / 2,
                          borderWidth: 3,
                          borderColor: color.borderOrange,
                          backgroundColor: color.white,
                        }}
                        source={{ uri: urls.baseUrl + videoData.createrLogo }}
                      // defaultSource={require('../../assets/img/defaultImage.png')}
                      />
                    </View>
                    <View
                      style={{
                        flex: 0.5,
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        marginTop: hp(1),
                      }}>
                      <_Text
                        fsHeading
                        numberOfLines={1}
                        fwExtraLarge
                        textColor={color.tertiaryGray}>
                        {videoData.createrName
                          ? videoData.createrName.charAt(0).toUpperCase() +
                          videoData.createrName.slice(1)
                          : ''}
                      </_Text>
                      <_Text
                        fsSmall
                        numberOfLines={1}
                        fwDefault
                        textColor={color.lightGray}>
                        {videoData.subscribersCount
                          ? videoData.subscribersCount
                          : 0}{' '}
                        Followers
                      </_Text>
                    </View>
                    <View
                      style={{
                        flex: 0.32,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: hp(1),
                      }}>
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() => this.onSubscribedClick()}>
                        <_Text
                          numberOfLines={1}
                          bold
                          fsPrimary
                          textColor={
                            changedSubscribtionTextColor == true
                              ? color.subscribeColor
                              : color.tertiaryGray
                          }>
                          {strings.subscription}
                        </_Text>
                        <Image
                          resizeMode={'cover'}
                          style={{ height: hp(2.5), width: hp(2.5) }}
                          source={
                            changedSubscribtionTextColor == true
                              ? require('../../assets/img/redNotification.png')
                              : require('../../assets/img/greyNotification.png')
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      borderTopColor: color.primaryGray,
                      borderTopWidth: hp(0.1),
                      marginTop: hp(1),
                    }}
                  />
                </View>

                {showFlag == true ? this.getDescriptionView(videoData) : null}
                <View
                  style={{
                    paddingTop: hp(1),
                    paddingLeft: wp(3),
                    paddingRight: wp(3),
                  }}>
                  {videoDataSource ? (
                    <View>
                      <_Text>Watch Next Videos</_Text>
                      <UpNextVideos
                        isFetching={this.props.isFetching}
                        item={videoDataSource}
                        navigation={this.props.navigation}
                      />
                    </View>
                  ) : null}
                </View>
                <View
                  style={{
                    paddingTop: hp(1),
                    paddingLeft: wp(3),
                    paddingRight: wp(3),
                  }}>
                  {otherCategorySource ? (
                    <View>
                      <_Text>Related Videos</_Text>
                      <UpNextVideos
                        item={otherCategorySource}
                        navigation={this.props.navigation}
                      />
                    </View>
                  ) : null}
                </View>
              </View>

              <Modal
                transparent={true}
                visible={giftModalVisible}
                animationType="slide"
                onRequestClose={() =>
                  this.setState({ giftModalVisible: false, selectedGiftData: [], giftId: '' })
                }>
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      giftModalVisible: false,
                      selectedGiftData: [],
                      giftId: ''
                    })
                  }
                  activeOpacity={1}
                  style={{
                    height: hp(100),
                    width: wp(100),
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    backgroundColor: 'rgba(0,0,0,0.1)',
                  }}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      height: hp(45),
                      width: wp(100),
                      position: 'absolute',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      backgroundColor: 'rgba(0,0,0,0.1)',
                    }}>
                    <View
                      style={{
                        width: wp(100),
                        height: hp(45),
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                      }}>
                      <View style={{ margin: hp(1) }}>
                        <View
                          style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image
                            resizeMode={'cover'}
                            style={{
                              height: hp(5),
                              width: hp(5),
                              borderRadius: hp(5) / 2,
                              borderWidth: 2,
                              borderColor: color.borderOrange,
                              backgroundColor: color.white,
                            }}
                            source={{ uri: urls.baseUrl + videoData.createrLogo }}
                            defaultSource={require('../../assets/img/defaultImage.png')}
                          />
                          <_Text
                            numberOfLines={1}
                            style={{ flex: 0.5, paddingLeft: wp(2) }}
                            textColor={color.white}>
                            {'Send to' +
                              ' ' +
                              createrName.charAt(0).toUpperCase() +
                              createrName.slice(1)}
                          </_Text>
                          <Animatable.View
                            animation="pulse"
                            iterationCount="infinite"
                            easing="ease-out"
                            style={{ flex: 0.5, alignItems: 'flex-end' }}>
                            <TouchableOpacity
                              onPress={() => this.sendGift()}
                              style={{
                                width: wp(20),
                                borderRadius: 4,
                                backgroundColor: '#ed3746',
                                height: hp(4.5),
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <_Text fwSmall textColor={color.white}>
                                Send
                              </_Text>
                            </TouchableOpacity>
                          </Animatable.View>
                        </View>
                      </View>
                      <View
                        style={{
                          borderBottomWidth: wp(0.1),
                          borderBottomColor: color.videoBorderGray,
                        }}
                      />

                      {giftDataSource ? (
                        <FlatList
                          numColumns={4}
                          data={giftDataSource}
                          showsHorizontalScrollIndicator={false}
                          ItemSeparatorComponent={this.FlatListItemSeparator}
                          renderItem={({ item, index }) =>
                            this.getGiftView(item, index)
                          }
                          keyExtractor={(item, index) => item.id}
                        />
                      ) : null}
                    </View>
                    {this.props.isFetching ? (
                      <View
                        style={{
                          position: 'absolute',
                          width: wp(100),
                          height: hp(50),
                          backgroundColor: 'transparent',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <ActivityIndicator size="large" color={color.white} />
                      </View>
                    ) : null}
                    {this.props.giftError ? (
                      <View
                        style={{
                          position: 'absolute',
                          width: wp(100),
                          height: hp(50),
                          backgroundColor: 'transparent',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <_Text fsPrimary textColor={color.white}>
                          {this.props.giftErrorMsg}
                        </_Text>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                </TouchableOpacity>
              </Modal>
            </ScrollView>


          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.videoDetailsReducer.isFetching,
    videoDetailsData: state.videoDetailsReducer.data,
    error: state.videoDetailsReducer.error,
    errorMsg: state.videoDetailsReducer.errorMsg,
    successVideoDetailsDataVersion:
      state.videoDetailsReducer.successVideoDetailsDataVersion,
    errorVideoDetailsDataVersion:
      state.videoDetailsReducer.errorVideoDetailsDataVersion,

    //other category
    otherCategoryData: state.videoDetailsReducer.otherCategoryData,
    otherCategoryError: state.videoDetailsReducer.otherCategoryError,
    otherCategoryErrorMSg: state.videoDetailsReducer.otherCategoryErrorMSg,
    successCategoryDataVersion:
      state.videoDetailsReducer.successCategoryDataVersion,
    errorCategoryDataVersion:
      state.videoDetailsReducer.errorCategoryDataVersion,

    // for like dislike

    likeDislikeData: state.videoDetailsReducer.likeDislikeData,
    likeDislikeError: state.videoDetailsReducer.likeDislikeError,
    likeDislikeErrorMsg: state.videoDetailsReducer.likeDislikeErrorMsg,
    errorLikeDislikeCountVersion:
      state.videoDetailsReducer.errorLikeDislikeCountVersion,
    successLikeDislikeCountVersion:
      state.videoDetailsReducer.successLikeDislikeCountVersion,

    isSubscribed: state.videoDetailsReducer.isSubscribed,
    subscriptionSuccessCountVersion:
      state.videoDetailsReducer.subscriptionSuccessCountVersion,
    subscriptionError: state.videoDetailsReducer.subscriptionError,
    subscriptionErrorMsg: state.videoDetailsReducer.subscriptionErrorMsg,
    subscriptionErrorCountVersion:
      state.videoDetailsReducer.subscriptionErrorCountVersion,

    subscribed: state.videoDetailsReducer.subscribed,
    subscribedSuccessVersion:
      state.videoDetailsReducer.subscribedSuccessVersion,
    subscribedErrorMsg: state.videoDetailsReducer.subscribedErrorMsg,
    subscribedError: state.videoDetailsReducer.subscribedError,
    subscribedErrorVersion: state.videoDetailsReducer.subscribedErrorVersion,

    shareError: state.videoListingReducer.shareError,
    shareErrorMsg: state.videoListingReducer.shareErrorMsg,
    errorShareCountVersion: state.videoListingReducer.errorShareCountVersion,
    successShareCountVersion:
      state.videoListingReducer.successShareCountVersion,

    videoViewsData: state.videoDetailsReducer.videoViewsData,
    successVideoViewsVersion:
      state.videoDetailsReducer.successVideoViewsVersion,
    errorVideoViewsVersion: state.videoDetailsReducer.errorVideoViewsVersion,
    videoViewsErrorMsg: state.videoDetailsReducer.videoViewsErrorMsg,
    videoViewsError: state.videoDetailsReducer.videoViewsError,

    giftData: state.videoDetailsReducer.giftData,
    successGiftVersion: state.videoDetailsReducer.successGiftVersion,
    errorGiftVersion: state.videoDetailsReducer.errorGiftVersion,
    giftError: state.videoDetailsReducer.giftError,
    giftErrorMsg: state.videoDetailsReducer.giftErrorMsg,

    getGiftData: state.videoDetailsReducer.getGiftData,
    giftSendError: state.videoDetailsReducer.giftSendError,
    giftSendErrorMsg: state.videoDetailsReducer.giftSendErrorMsg,
    successGiftDataVersion: state.videoDetailsReducer.successGiftDataVersion,
    errorGiftDataVersion: state.videoDetailsReducer.errorGiftDataVersion,
  };
}

const mapDispatchToProps = dispatch => ({
  // getVideoList: (requestBody) => dispatch(getVideoList(requestBody)),
  getVideoDetails: requestBody => dispatch(getVideoDetails(requestBody)),
  getOtherDetails: requestBody => dispatch(getOtherDetails(requestBody)),
  isSubcribed: requestBody => dispatch(isSubcribed(requestBody)),
  getLikeDislikeCount: requestBody =>
    dispatch(getLikeDislikeCount(requestBody)),
  subscribedClicked: requestBody => dispatch(subscribedClicked(requestBody)),
  getShareCount: requestBody => dispatch(getShareCount(requestBody)),
  getViewsCount: requestBody => dispatch(getViewsCount(requestBody)),
  sendGift: payload => dispatch(sendGift(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VideoDetails);

//back forward seek functionality

// onBackward(currentTime) {
//     let newTime = Math.max(currentTime - FORWARD_DURATION, 0);
//     this.videoPlayer.seek(newTime);
//     this.setState({ currentTime: newTime })
// }
// onForward(currentTime, duration) {
//     if (currentTime + FORWARD_DURATION > duration) {
//         this.onVideoEnd();
//     } else {
//         let newTime = currentTime + FORWARD_DURATION;
//         this.videoPlayer.seek(newTime);
//         this.setState({ currentTime: newTime });
//     }
// }
