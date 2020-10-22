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
  getVideoList, getCategory,
  getLikeDislikeCount,
  getShareCount, getStories
}
  from "../../sagaModules/VideoList";


import _Card from '@card/_Card';
import _CardContent from '@cardContent/_CardContent';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';
import FastImage from 'react-native-fast-image'

import Carausal from '../VideoListing/Story/Components/Carausal/Carausal';
import stories from '../VideoListing/Story/Components/data';


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
      page: 0,
      clickedLoadMore: false,
      categorySelected: false,
      modalVisible: false

    };
    this.modalScroll = createRef();

    userId = global.userId;
    requestBody = {
      payload: {
        categoryId: '',
        startLimit: 0,
        userId: userId,
      },

    };

  }

  async componentDidMount() {
    actionArray = [];

    await this.props.getCategory();
    await this.props.getVideoList(requestBody);
    // await this.props.getStories();

  }

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


    // if (this.state.successCategoryDataVersion > prevState.successCategoryDataVersion) {
    //   this.setState({ categoryDataSource: categoryData });
    // }
    if (this.state.successStoriesVersion > prevState.successStoriesVersion) {
      this.setState({ storiesDataSource: storiesData });
    }
    if (this.state.successVideoDataVersion > prevState.successVideoDataVersion) {
      this.setState({
        videoDataSource:
          this.state.page === 0 ? videoData : [...this.state.videoDataSource, ...videoData],
      });

    }
    if (this.state.successLikeDislikeCountVersion > prevState.successLikeDislikeCountVersion) {
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

    if (this.state.errorLikeDislikeCountVersion > prevState.errorLikeDislikeCountVersion) {
      Toast.show({
        text: this.props.likeDislikeErrorMsg,
        type: 'danger',
      });
    }

    if (this.state.successShareCountVersion > prevState.successShareCountVersion) {
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

  onCategoryPress = async (videoListPayload) => {
    await this.props.getVideoList(videoListPayload);
    this.setState({ page: 0 })

    // if (videoListPayload.payload) {
    //   this.setState({ categorySelected: videoListPayload.payload.categoryId })
    // }
  }

  getCategory = (item) => {

    let categoryData = {
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
            onPress={() => this.onCategoryPress(categoryData)}>
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
                  priority: FastImage.priority.high,
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
      message: url
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

  // STORY 
  getStoriesView = (item, index) => {
    const {
      storiesView,
      storiesImg,
      profilePicView,
      profilePicInnerView,
      profileImg,
      profileUserName,
    } = VideoListingStyle;


    return (
      <TouchableOpacity
        // onPress={() => this.setState({ modalVisible: true })}
        onPress={() => this.openStoryModal(index)}
      >
        <View style={storiesView}>
          {item.stories[0].type === 'image' ? (
            <Image
              resizeMode={'cover'}
              style={storiesImg}
              defaultSource={require('../../assets/img/default.png')}
              // source={{ uri: urls.baseUrl + item.urls[0].url }}
              source={{ uri: item.stories[0].url }}
            // source={require('../../assets/img/story3.png')}

            />
          ) : (
              <Video
                resizeMode={'cover'}
                source={{ uri: item.stories[0].url }}
                // source={{ uri: urls.baseUrl + item.urls[0].url }}
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
                source={{ uri: item.profile }}
              // source={{uri: item.profilePic ? urls.baseUrl + item.profilePic : null,}}
              />
              <View style={profileUserName}>
                <_Text numberOfLines={1} fsPrimary bold textColor={color.white}>
                  {item.username.charAt(0).toUpperCase() +
                    item.username.slice(1)}
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

    let refreshBody = {
      payload: {
        categoryId: '',
        startLimit: '0',
        userId: userId,
      },
    }
    await this.props.getCategory();
    // await this.props.getStories();
    await this.props.getVideoList(refreshBody);

    this.setState({ page: 0 })
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
      <View key={item.videoid}>
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
              onPressShare={() => this.shareVideo(urls.baseUrl + item.videoUrl, item)}
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
    let loadData = {
      payload: {
        categoryId: '',
        startLimit: page,
        userId: userId,
      },
    }

    await this.props.getVideoList(loadData);

  };


  footer = () => {
    return (
      <View>
        {!this.props.isFetching && this.state.videoDataSource.length >= 10 ? (
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
          this.state.videoDataSource.length >= 10 ? (
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


  closeModal = () => { this.setState({ modalVisible: false }) }



  render() {
    const {
      categoryDataSource, storiesDataSource,
      videoDataSource, appState, rate, duration, muted,
      paused, remainingTime, currentVisibleIndex, currentUserIndex,
      isModelOpen, clickedLoadMore, modalVisible
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

    const { isFetching, categoryData, videoData, videoListingError, viewProfileData } = this.props;



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

          {categoryData && categoryData.length !== 0 ? (
            <View style={categoryMainView}>
              <FlatList
                horizontal={true}
                data={categoryData}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={this.FlatListItemSeparator}
                renderItem={({ item, index }) => this.getCategory(item)}
                keyExtractor={(item, index) => item.id}
              />
            </View>
          )
            : null}

          {/* for Stories */}
          {/* {
          !this.props.storieDataError ? */}
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
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row' }} >
                <TouchableOpacity onPress={() => this.createStory()}>
                  <View style={storiesView}>
                    {viewProfileData && viewProfileData.userProfile ?
                      <FastImage
                        style={storiesImg}
                        source={{
                          uri: urls.baseUrl + viewProfileData.userProfile[0].userpic,
                          priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                      :
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
                          source={require('../../assets/img/circle.png')}
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

                {stories && stories.map((item, index) => (
                  this.getStoriesView(item, index)
                ))}

                {/* static  */}

              </View>

            </ScrollView>

          </View>
          {/* : null
          } */}

          {/* for VideListing */}
          <View style={{ backgroundColor: '#fafafa' }}>
            {videoDataSource ? (
              <FlatList
                data={videoDataSource}
                ListEmptyComponent={this.noRecordFound()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => this.getVideoListing(item, index)}
                keyExtractor={(item, index) => item.videoid.toString()}
                //onEndReached={this.LoadMoreData}
                //onEndReachedThreshold={0.5}
                ListFooterComponent={this.footer}
              />
            ) : null}
          </View>


          {/* CubeNavigationHorizontal story */}
          <Modal
            animationType="slide"
            transparent={false}
            visible={isModelOpen}
            style={{ flex: 1 }}
            onShow={() => { if (currentUserIndex > 0) { this.modalScroll.current.scrollTo(currentUserIndex, false) } }}
            onRequestClose={() => this.closeStoryModal()}>
            <CubeNavigationHorizontal
              callBackAfterSwipe={g => this.onScrollChange(g)}
              ref={this.modalScroll}
              style={styles.container}>
              {/* <View ref={this.modalScroll}> */}
              {stories &&
                stories.map((data, index) => (
                  <StoryContainer
                    onClose={() => this.onStoryClose()}
                    onStoryNext={() => this.onStoryNext()}
                    onStoryPrevious={() => this.onStoryPrevious()}
                    user={data}
                    isNewStory={index !== this.state.currentUserIndex}
                  />
                ))}
              {/* </View> */}
            </CubeNavigationHorizontal>
          </Modal>

        </ScrollView>

        {/* static story view */}
        {modalVisible &&
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => this.setState({ modalVisible: false })}>
            <View>
              <Carausal closeModal={this.closeModal} />
            </View>
          </Modal>
        }

        {!clickedLoadMore && isFetching ? (
          <View style={activityIndicatorView}>
            <ActivityIndicator size="large" color={color.tertiaryGray} />
          </View>
        ) : null}

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
    isFetching: state.videoListingReducerSaga.isFetching,

    categoryData: state.videoListingReducerSaga.categoryData,
    successCategoryDataVersion: state.videoListingReducerSaga.successCategoryDataVersion,
    errorCategoryDataVersion: state.videoListingReducerSaga.errorCategoryDataVersion,
    CatgoryDataErrorMsg: state.videoListingReducerSaga.CatgoryDataErrorMsg,
    CategoryDataError: state.videoListingReducerSaga.CategoryDataError,

    storiesData: state.videoListingReducerSaga.storiesData,
    errorStoriesVersion: state.videoListingReducerSaga.errorStoriesVersion,
    successStoriesVersion: state.videoListingReducerSaga.successStoriesVersion,
    storiesDataErrorMsg: state.videoListingReducerSaga.storiesDataErrorMsg,
    storieDataError: state.videoListingReducerSaga.storieDataError,

    videoData: state.videoListingReducerSaga.videoData,
    successVideoDataVersion: state.videoListingReducerSaga.successVideoDataVersion,
    videoListErrorVersion: state.videoListingReducerSaga.videoListErrorVersion,
    videoListingError: state.videoListingReducerSaga.videoListingError,
    videoErrorMsg: state.videoListingReducerSaga.videoErrorMsg,

    likeDislikeData: state.videoListingReducerSaga.likeDislikeData,
    likeDislikeError: state.videoListingReducerSaga.likeDislikeError,
    likeDislikeErrorMsg: state.videoListingReducerSaga.likeDislikeErrorMsg,
    errorLikeDislikeCountVersion: state.videoListingReducerSaga.errorLikeDislikeCountVersion,
    successLikeDislikeCountVersion: state.videoListingReducerSaga.successLikeDislikeCountVersion,

    shareData: state.videoListingReducerSaga.shareData,
    shareError: state.videoListingReducerSaga.shareError,
    shareErrorMsg: state.videoListingReducerSaga.shareErrorMsg,
    errorShareCountVersion: state.videoListingReducerSaga.errorShareCountVersion,
    successShareCountVersion: state.videoListingReducerSaga.successShareCountVersion,

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
  getLikeDislikeCount: requestBody => dispatch(getLikeDislikeCount(requestBody)),
  getShareCount: requestBody => dispatch(getShareCount(requestBody)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VideoListing);



// onViewableItemsChanged={this.onViewableItemsChanged}
// viewabilityConfig={{
//   viewAreaCoveragePercentThreshold: 100,
// }}