import React, { Component, createRef } from 'react';
import {
  View,
  Text, FlatList, Image,
  TouchableOpacity, Modal,
  RefreshControl, StyleSheet, ActivityIndicator,
  ColorPropType,
  Alert,
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
import VideoDetails from '../VideoDetails/VideoDetails';
import VideoListingStyle from '@videoListing/VideoListingStyle';
import { urls } from '@api/urls';
import { CubeNavigationHorizontal } from 'react-native-3dcube-navigation';
import StoryContainer from '@stories/StoryContainer';
import {
  getCategory,
  getStories,
  getVideoList,
  getLikeDislikeCount,
  getShareCount,
  resetAllReducer,
} from '@videoListing/VideoListingAction';

import _Card from '@card/_Card';
import _CardContent from '@cardContent/_CardContent';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';
import { viewProfile } from '@profile/ProfileAction';
import FastImage from 'react-native-fast-image'


var userId = "";
var requestBody = {}

var actionArray = [];

class VideoListing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      successCategoryDataVersion: 0,
      errorCategoryDataVersion: 0,
      successStoriesVersion: 0,
      errorStoriesVersion: 0,
      categoryDataSource: [],
      storiesDataSource: [],
      videoListErrorVersion: 0,
      successVideoDataVersion: 0,
      videoDataSource: '',
      currentVisibleIndex: 0,
      currentUserIndex: 0,
      rate: 1,
      volume: 1,
      muted: false,
      resizeMode: 'contain',
      duration: 0.0,
      currentTime: 0.0,
      paused: true,
      isModelOpen: false,
      likeFlag: '',
      disLikeFlag: false,
      userId: '',
      successLikeDislikeCountVersion: 0,
      errorLikeDislikeCountVersion: 0,
      likes: '',
      disLike: '',
      videoId: '',
      views: '',
      errorShareCountVersion: 0,
      successShareCountVersion: 0,
      errorMsg: "",
      errorVideoViewsVersion: 0,
      successVideoViewsVersion: 0,
      successViewProfileVersion: 0,
      errorViewProfileVersion: 0,
      viewProfileDataSource: '',
    };
    this.modalScroll = createRef();

    userId = global.userId;
    requestBody = {
      payload: {
        categoryId: '',
        startLimit: '0',
        userId: userId,
      },

    };

  }

  // componentWillUnmount() {
  //   this.props.resetReducer();
  // }

  onLoad = data => {
    var minutes = Math.floor(data.duration / 60);
    var seconds = data.duration - minutes * 60;
    this.setState({ duration: { min: minutes, sec: seconds } });
  };

  onProgress = data => {
    if (data.currentTime !== this.state.duration) {
      this.setState({
        currentTime: data.currentTime,
      });

      const time = data.seekableDuration - data.currentTime;

      var progressTime = `${this.formatTime(time, data.seekableDuration)}`;

      this.setState({
        currentTime: data.currentTime,
        remainingTime: progressTime,
      });
    }
  };

  formatTime(time = 0, duration) {
    // const symbol = this.state.showRemainingTime ? '-' : '';
    time = Math.min(Math.max(time, 0), duration);

    const formattedMinutes = _.padStart(Math.floor(time / 60).toFixed(0), 2, 0);
    const formattedSeconds = _.padStart(Math.floor(time % 60).toFixed(0), 2, 0);

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  onEnd = () => {
    this.setState({ paused: true });
    this.player.seek(0);
  };

  onAudioBecomingNoisy = () => {
    this.setState({ paused: true });
  };

  onAudioFocusChanged = event => {
    this.setState({ paused: !event.hasAudioFocus });
  };

  videoError = error => {
    console.log('videoError --', error);

  };

  getCurrentTimePercentage() {
    if (this.state.currentTime > 0) {
      var time =
        parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
    }
    return 0;
  }

  componentDidMount() {
    actionArray = [];

    this.props.getCategory();
    //this.props.getStories();

    this.props.getVideoList(requestBody);

    var requestpayload = {
      payload: {
        userId: userId,
        startLimit: '0',
      },
    };
    this.props.viewProfile(requestpayload);

  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      successCategoryDataVersion,
      errorCategoryDataVersion,
      successStoriesVersion,
      errorStoriesVersion,
      successVideoDataVersion,
      successLikeDislikeCountVersion,
      errorLikeDislikeCountVersion,
      videoListErrorVersion,
      errorShareCountVersion,
      successShareCountVersion,
      successVideoViewsVersion,
      errorVideoViewsVersion,
      successViewProfileVersion,
      errorViewProfileVersion,
    } = nextProps;

    let newState = null;

    if (successCategoryDataVersion > prevState.successCategoryDataVersion) {
      newState = {
        ...newState,
        successCategoryDataVersion: nextProps.successCategoryDataVersion,
      };
    }

    if (videoListErrorVersion > prevState.videoListErrorVersion) {

      newState = {
        ...newState,
        videoListErrorVersion: nextProps.videoListErrorVersion,
      };
    }
    if (errorCategoryDataVersion > prevState.errorCategoryDataVersion) {
      newState = {
        ...newState,
        errorCategoryDataVersion: nextProps.errorCategoryDataVersion,
      };
    }

    if (successStoriesVersion > prevState.successStoriesVersion) {
      newState = {
        ...newState,
        successStoriesVersion: nextProps.successStoriesVersion,
      };
    }

    if (errorStoriesVersion > prevState.errorStoriesVersion) {
      newState = {
        ...newState,
        errorStoriesVersion: nextProps.errorStoriesVersion,
      };
    }

    if (successVideoDataVersion > prevState.successVideoDataVersion) {
      newState = {
        ...newState,
        successVideoDataVersion: nextProps.successVideoDataVersion,
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


    if (successViewProfileVersion > prevState.successViewProfileVersion) {
      newState = {
        ...newState,
        successViewProfileVersion: nextProps.successViewProfileVersion,
      };
    }

    if (errorViewProfileVersion > prevState.errorViewProfileVersion) {
      newState = {
        ...newState,
        errorViewProfileVersion: nextProps.errorViewProfileVersion,
      };
    }
    return newState;
  }

  async componentDidUpdate(prevProps, prevState) {
    const {
      categoryData, storiesData,
      videoData, likesCount,
      dislikesCount, likeDislikeAction,
      videoErrorMsg, shareData, viewProfileData
    } = this.props;

    if (
      this.state.successCategoryDataVersion >
      prevState.successCategoryDataVersion
    ) {
      this.setState({ categoryDataSource: categoryData });
    }
    if (this.state.successStoriesVersion > prevState.successStoriesVersion) {
      this.setState({ storiesDataSource: storiesData });
    }
    if (
      this.state.successVideoDataVersion > prevState.successVideoDataVersion
    ) {
      this.setState({ videoDataSource: videoData });
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
        console.log(actionArray);
      }

      var Index = _.findIndex(this.state.videoDataSource, {
        videoid: parseInt(this.props.likeDislikeData.videoId),
      });

      if (Index !== -1) {
        this.state.videoDataSource[Index].likeCount = parseInt(
          this.props.likeDislikeData.likesCount,
        );
        this.state.videoDataSource[Index].dislikeCount = parseInt(
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
        this.state.videoDataSource[Index].operation = flag;

        this.setState(
          {
            likes: this.props.likeDislikeData.likesCount,
            disLike: this.props.likeDislikeData.dislikesCount,
          },
          () => {
            JSON.stringify(this.state.videoDataSource);
          },
        );
      }

      if (this.state.successViewProfileVersion > prevState.successViewProfileVersion) {
        this.setState({ viewProfileDataSource: viewProfileData.userProfile });
      }

      if (this.state.errorViewProfileVersion > prevState.errorViewProfileVersion) {
        Toast.show({
          text: errorViewProfileMsg.msg,
          type: 'danger',
        });
      }
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
      this.state.successShareCountVersion > prevState.successShareCountVersion
    ) {
      var Index = _.findIndex(this.state.videoDataSource, {
        videoid: parseInt(this.props.shareData.videoId),
      });

      if (Index !== -1) {
        this.state.videoDataSource[Index].sharesCount = parseInt(
          this.props.shareData.sharesCount,
        );

        this.setState(
          {
            shares: this.props.shareData.sharesCount,
          },
          () => {
            console.log(JSON.stringify(this.state.videoDataSource));
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

    if (this.state.videoListErrorVersion > prevState.videoListErrorVersion) {
      Toast.show({
        text: this.props.videoErrorMsg ? this.props.videoErrorMsg : strings.serverFailedMsg,
        type: 'danger',
      });
      this.setState({ errorMsg: videoErrorMsg })

    }

    // VIEWS COUNT
    if (this.state.successVideoViewsVersion > prevState.successVideoViewsVersion) {
      var Index = _.findIndex(this.state.videoDataSource, { videoid: parseInt(this.props.videoViewsData.videoId) });
      if (Index >= 0) {
        this.state.videoDataSource[Index].views = parseInt(this.props.videoViewsData.viewsCount);

        this.setState({ views: this.props.videoViewsData.viewsCount }, () => {
          console.log(JSON.stringify(this.state.videoDataSource))
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



  onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      this.setState({ currentVisibleIndex: viewableItems[0].index });
    }
  };

  onCategoryPress(videoListPayload) {
    this.props.getVideoList(videoListPayload);
  }

  getCategory(item) {

    var videoListPayload = {
      payload: {
        categoryId: item.id == 16 ? '' : item.id,
        startLimit: '0',
        userId: userId,
      },
    };
    const {
      categoryInnerView,
      catgeoryInnerSecondView,
      categoryIconView,
      categoryImg,
      categoryText,
    } = VideoListingStyle;
    return (
      <View style={categoryInnerView}>
        <View style={catgeoryInnerSecondView}>
          <TouchableOpacity
            style={{ alignItems: 'center' }}
            onPress={() => this.onCategoryPress(videoListPayload)}>
            <View style={categoryIconView}>
              {/* <Image
                resizeMode={'cover'}
                style={categoryImg}
                source={{ uri: urls.baseUrl + item.categoryIcon }}
              /> */}
              <FastImage
                style={categoryImg}
                source={{
                  uri: urls.baseUrl + item.categoryIcon,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
            <View style={categoryText}>
              <_Text
                numberOfLines={1}
                fsSmall
                fwPrimary
                textColor={color.tertiaryGray}>
                {item.categoryName}
              </_Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  openStoryModal = index => {
    this.setCurrentUserIndex(index);

    this.setState({
      isModelOpen: true,
    });
  };


  onGiftClick(item) {
    this.goToDetailsScreen(item, "gift")
  }

  setCurrentUserIndex = newIndex => {
    this.setState({
      currentUserIndex: newIndex,
    });
  };

  setCurrentScrollValue = index => {
    this.setState({
      currentScrollValue: index,
    });
  };

  closeStoryModal = () => {
    this.setState({
      isModelOpen: false,
    });
  };

  onStoryClose = () => {
    this.setState({ isModelOpen: false });
  };

  onStoryNext = isScroll => {
    const { storiesDataSource } = this.state;

    const { currentUserIndex } = this.state;

    const newIndex = currentUserIndex + 1;
    if (storiesDataSource.length - 1 > currentUserIndex) {
      this.setCurrentUserIndex(newIndex);
      if (!isScroll) {
        this.modalScroll.current.scrollTo(newIndex, true);
      }
    } else {
      this.onStoryClose(false);
    }
  };

  onStoryPrevious = isScroll => {
    const { currentUserIndex } = this.state;

    const newIndex = currentUserIndex - 1;
    if (currentUserIndex > 0) {
      this.setCurrentUserIndex(newIndex);

      if (!isScroll) {
        this.modalScroll.current.scrollTo(newIndex, true);
      }
    }
  };

  onScrollChange = scrollValue => {
    const { currentScrollValue } = this.state;

    if (currentScrollValue > scrollValue) {
      this.onStoryNext(true);
      this.setCurrentScrollValue(scrollValue);
    }
    if (currentScrollValue < scrollValue) {
      this.onStoryPrevious();
      this.setCurrentScrollValue(scrollValue);
    }
  };

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

  getStories = (item, index) => {
    const {
      storiesView,
      storiesImg,
      profilePicView,
      profilePicInnerView,
      profileImg,
      profileUserName,
    } = VideoListingStyle;


    return (
      <TouchableOpacity onPress={() => this.openStoryModal(index)}>
        <View style={storiesView}>
          {item.urls[0].type === 'image' ? (
            <Image
              resizeMode={'cover'}
              style={storiesImg}
              defaultSource={require('../../assets/img/default.png')}
              source={{ uri: urls.baseUrl + item.urls[0].url }}
            />
          ) : (
              <Video
                resizeMode={'cover'}
                source={{ uri: urls.baseUrl + item.urls[0].url }}
                //poster={require('../../assets/img/story2.png')}
                //posterResizeMode={'cover'}
                paused={true}
                style={storiesImg}
              />
            )}

          <View style={profilePicView}>
            <View style={profilePicInnerView}>
              <Animatable.Image
                animation="zoomIn"
                resizeMode={'cover'}
                style={profileImg}
                defaultSource={require('../../assets/img/defaultImage.png')}
                source={{
                  uri: item.profilePic ? urls.baseUrl + item.profilePic : null,
                }}
              />
              <View style={profileUserName}>
                <_Text numberOfLines={1} fsPrimary bold textColor={color.white}>
                  {item.userName.charAt(0).toUpperCase() +
                    item.userName.slice(1)}
                </_Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
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

  onPullRefresh = async () => {
    await this.props.getCategory();
    await this.props.getStories();
    await this.props.getVideoList(requestBody);
  };

  onLikeClicked(data) {
    // debugger
    const { likeFlag } = this.state;
    if (actionArray.length == 0) {
      if (data.operation == 0 || data.operation == 2) {
        // debugger
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

  getVideoListing(item, index) {
    var date = new Date(item.uploadedDate).toUTCString();
    return (
      <View key={item.id}>
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


      </View>
    );
  }

  noRecordFound() {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: hp(13),
        }}>
        <_Text fsPrimary fwHeading textColor={color.tertiaryGray}>
          {strings.noVideosFound}
        </_Text>
      </View>
    );
  }

  createStory = () => {
    this.props.navigation.navigate('YourStory')
  }


  render() {
    const {
      categoryDataSource, storiesDataSource,
      videoDataSource, appState, rate, duration, muted,
      paused, remainingTime, currentVisibleIndex, currentUserIndex,
      isModelOpen,
    } = this.state;

    const {
      mainContainer,
      mainScrollView, categoryMainView, mainStoriesContainer,
      storiesInnerView, recentStoriesView, watchAllView, watchTouchableView,
      watchAllImage, watchAllText, activityIndicatorView,
    } = VideoListingStyle;

    const {
      storiesView, storiesImg, profilePicView, profilePicInnerView,
      profileImg, profileUserName,
    } = VideoListingStyle;

    const { isFetching, videoListingError, viewProfileData } = this.props;

    return (
      <View style={mainContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={mainScrollView}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => this.onPullRefresh()}
            />
          }>
          {/* for Category Part */}
          <View style={categoryMainView}>
            {categoryDataSource.length !== 0 ? (
              <FlatList
                horizontal={true}
                data={categoryDataSource}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={this.FlatListItemSeparator}
                renderItem={({ item, index }) => this.getCategory(item)}
                keyExtractor={(item, index) => item.id}
              />
            ) : null}
          </View>

          {/* for Stories */}
          {/* {
            this.props.storieDataError == false ?
              <View style={mainStoriesContainer}>
                <View style={storiesInnerView}>
                  <View style={recentStoriesView}>
                    <_Text
                      fsHeading
                      fwPrimary
                      numberOfLines={1}
                      textColor={color.tertiaryGray}>
                      {strings.recentStories}
                    </_Text>
                  </View>
                  <View style={watchAllView}>
                    <TouchableOpacity style={watchTouchableView}>
                      <Image
                        resizeMode={'cover'}
                        style={watchAllImage}
                        source={require('../../assets/img/watchAll.png')}
                      />
                      <_Text
                        fsHeading
                        numberOfLines={1}
                        fwPrimary
                        textColor={color.tertiaryGray}
                        style={watchAllText}>
                        {strings.watchAll}
                      </_Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ flexDirection: 'row' }} >
                    <TouchableOpacity onPress={() => this.createStory()}>
                      <View style={storiesView}>
                        {viewProfileData && viewProfileData.userProfile ?
                          <Image
                            resizeMode={'cover'}
                            style={storiesImg}
                            defaultSource={require('../../assets/img/default.png')}
                            source={{ uri: urls.baseUrl + viewProfileData.userProfile[0].userpic }}
                          /> :
                          <Image
                            resizeMode={'cover'}
                            style={storiesImg}
                            defaultSource={require('../../assets/img/default.png')}
                          />
                        }

                        <View style={profilePicView}>
                          <View style={profilePicInnerView}>
                            <Animatable.Image
                              animation="zoomIn"
                              resizeMode={'cover'}
                              style={profileImg}
                              defaultSource={require('../../assets/img/circle.png')}
                            />
                            <View style={profileUserName}>
                              <_Text numberOfLines={1} fsPrimary bold textColor={color.white}>
                                Your Story
                          </_Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>


                  </View>

                </ScrollView>

              </View>
              : null
          } */}


          {/* inside scrollview */}
          {/* {storiesDataSource && storiesDataSource.map((item, index) => (
                      this.getStories(item, index)
                    ))} */}
          {/* <FlatList
                    horizontal={true}
                    data={storiesDataSource}
                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={({ item, index }) => this.getStories(item, index)}
                    keyExtractor={(item, index) => item.id}
                  /> */}


          {/* for VideListing */}
          <View style={{ backgroundColor: '#fafafa' }}>
            {videoDataSource ? (
              <FlatList
                data={videoDataSource}
                ListEmptyComponent={this.noRecordFound()}
                // onViewableItemsChanged={this.onViewableItemsChanged}
                // viewabilityConfig={{
                //   viewAreaCoveragePercentThreshold: 100,
                // }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) =>
                  this.getVideoListing(item, index)
                }
                keyExtractor={(item, index) => item.id}
              />
            ) : null}
          </View>

          <Modal
            animationType="slide"
            transparent={false}
            visible={isModelOpen}
            style={{ flex: 1 }}
            onShow={() => {
              if (currentUserIndex > 0) {
                this.modalScroll.current.scrollTo(currentUserIndex, false);
              }
            }}
            onRequestClose={() => this.closeStoryModal()}>
            <CubeNavigationHorizontal
              callBackAfterSwipe={g => this.onScrollChange(g)}
              ref={this.modalScroll}
              style={styles.container}>
              {storiesDataSource &&
                storiesDataSource.map((data, index) => (
                  <StoryContainer
                    onClose={() => this.onStoryClose()}
                    onStoryNext={() => this.onStoryNext()}
                    onStoryPrevious={() => this.onStoryPrevious()}
                    user={data}
                    isNewStory={index !== this.state.currentUserIndex}
                  />
                ))}
            </CubeNavigationHorizontal>
          </Modal>
        </ScrollView>
        {isFetching ? (
          <View style={activityIndicatorView}>
            <ActivityIndicator size="large" color={color.tertiaryGray} />
          </View>
        ) : null}

        {/* {videoListingError ? (
          <View style={activityIndicatorView}>
            <_Text>{this.state.errorMsg}</_Text>
          </View>
        ) : null} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadMoreBtn: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnText: {
    color: 'gray',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

function mapStateToProps(state) {
  return {
    //category
    isFetching: state.videoListingReducer.isFetching,
    categoryData: state.videoListingReducer.categoryData,
    successCategoryDataVersion:
      state.videoListingReducer.successCategoryDataVersion,
    errorCategoryDataVersion:
      state.videoListingReducer.errorCategoryDataVersion,
    CatgoryDataErrorMsg: state.videoListingReducer.CatgoryDataErrorMsg,
    CategoryDataError: state.videoListingReducer.CategoryDataError,

    successStoriesVersion: state.videoListingReducer.successStoriesVersion,
    storiesData: state.videoListingReducer.storiesData,
    errorStoriesVersion: state.videoListingReducer.errorStoriesVersion,
    storiesDataErrorMsg: state.videoListingReducer.storiesDataErrorMsg,
    storieDataError: state.videoListingReducer.storieDataError,

    error: state.videoListingReducer.error,
    storiesData: state.videoListingReducer.storiesData,
    successStoriesVersion: state.videoListingReducer.successStoriesVersion,
    videoData: state.videoListingReducer.videoData,
    successVideoDataVersion: state.videoListingReducer.successVideoDataVersion,
    videoListErrorVersion: state.videoListingReducer.videoListErrorVersion,
    videoListingError: state.videoListingReducer.videoListingError,
    videoErrorMsg: state.videoListingReducer.videoErrorMsg,

    likeDislikeData: state.videoListingReducer.likeDislikeData,
    likeDislikeError: state.videoListingReducer.likeDislikeError,
    likeDislikeErrorMsg: state.videoListingReducer.likeDislikeErrorMsg,
    errorLikeDislikeCountVersion:
      state.videoListingReducer.errorLikeDislikeCountVersion,
    successLikeDislikeCountVersion:
      state.videoListingReducer.successLikeDislikeCountVersion,

    shareData: state.videoListingReducer.shareData,
    shareError: state.videoListingReducer.shareError,
    shareErrorMsg: state.videoListingReducer.shareErrorMsg,
    errorShareCountVersion: state.videoListingReducer.errorShareCountVersion,
    successShareCountVersion:
      state.videoListingReducer.successShareCountVersion,

    videoViewsData: state.videoDetailsReducer.videoViewsData,
    successVideoViewsVersion: state.videoDetailsReducer.successVideoViewsVersion,
    errorVideoViewsVersion: state.videoDetailsReducer.errorVideoViewsVersion,
    videoViewsErrorMsg: state.videoDetailsReducer.videoViewsErrorMsg,
    videoViewsError: state.videoDetailsReducer.videoViewsError,

    viewProfileData: state.profileReducer.viewProfileData,
    errorViewProfile: state.profileReducer.errorViewProfile,
    errorViewProfileMsg: state.profileReducer.errorViewProfileMsg,
    successViewProfileVersion: state.profileReducer.successViewProfileVersion,
    errorViewProfileVersion: state.profileReducer.errorViewProfileVersion,

  };
}

const mapDispatchToProps = dispatch => ({
  getCategory: () => dispatch(getCategory()),
  getStories: () => dispatch(getStories()),
  getVideoList: requestBody => dispatch(getVideoList(requestBody)),
  getLikeDislikeCount: requestBody =>
    dispatch(getLikeDislikeCount(requestBody)),
  getShareCount: requestBody => dispatch(getShareCount(requestBody)),
  resetReducer: () => dispatch(resetAllReducer()),
  viewProfile: requestpayload => dispatch(viewProfile(requestpayload)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VideoListing);
