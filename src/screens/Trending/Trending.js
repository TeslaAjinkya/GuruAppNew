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
import { Toast } from 'native-base';
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
import {
  getCategory,
  getShareCount,
  getLikeDislikeCount,
} from '@videoListing/VideoListingAction';

import { getTrendingList, resetAllReducer } from '@trending/TrendingAction';
import _Card from '@card/_Card';
import _CardContent from '@cardContent/_CardContent';

var userId = ""
var actionArray = [];
var requestBody = {}

class Trending extends Component {
  constructor(props) {
    super(props);
    this.state = {
      successTrendingDataVersion: 0,
      errorTrendingDataVersion: 0,
      successDataVersion: 0,
      errorDataVersion: 0,
      trendingDataSource: '',
      categoryDataSource: '',
      errorShareCountVersion: 0,
      successShareCountVersion: 0,
      successLikeDislikeCountVersion: 0,
      errorLikeDislikeCountVersion: 0,
      likes: '',
      errorMsg: '',
      views: '',
      errorVideoViewsVersion: 0,
      successVideoViewsVersion: 0,
      page: 0,
      clickedLoadMore: false,

    };
    userId = global.userId;
    requestBody = {
      payload: {
        userId: userId,
        startLimit: '0',
      },
    };
  }

  onPullRefresh = async () => {
    // await this.props.getCategory();
    await this.props.getTrendingList(requestBody);
  };

  componentDidMount = async () => {
    // this.props.getCategory();
    await this.props.getTrendingList(requestBody);
  }



  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      successTrendingDataVersion,
      errorTrendingDataVersion,
      successDataVersion,
      errorDataVersion,
      successLikeDislikeCountVersion,
      errorLikeDislikeCountVersion,
      errorShareCountVersion,
      successShareCountVersion,
      errorVideoViewsVersion,
      successVideoViewsVersion,
    } = nextProps;
    let newState = null;

    if (successDataVersion > prevState.successDataVersion) {
      newState = {
        ...newState,
        successDataVersion: nextProps.successDataVersion,
      };
    }
    if (errorDataVersion > prevState.errorDataVersion) {
      newState = {
        ...newState,
        errorDataVersion: nextProps.errorDataVersion,
      };
    }
    if (successTrendingDataVersion > prevState.successTrendingDataVersion) {
      newState = {
        ...newState,
        successTrendingDataVersion: nextProps.successTrendingDataVersion,
      };
    }
    if (errorTrendingDataVersion > prevState.errorTrendingDataVersion) {
      newState = {
        ...newState,
        errorTrendingDataVersion: nextProps.errorTrendingDataVersion,
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

    return newState;
  }

  componentDidUpdate(prevProps, prevState) {
    const { trendingData, categoryData } = this.props;

    if (this.state.successDataVersion > prevState.successDataVersion) {
      this.setState({ categoryDataSource: categoryData });
    }

    if (this.state.successTrendingDataVersion > prevState.successTrendingDataVersion) {
      // this.setState({ trendingDataSource: trendingData });
      this.setState({
        trendingDataSource:
          this.state.page === 0 ? trendingData : [...this.state.trendingDataSource, ...trendingData],
      });

    }

    if (
      this.state.successLikeDislikeCountVersion >
      prevState.successLikeDislikeCountVersion
    ) {
      if (this.state.trendingDataSource && this.props.likeDislikeData) {
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

        var Index = _.findIndex(this.state.trendingDataSource, {
          videoid: parseInt(this.props.likeDislikeData.videoId),
        });

        if (Index !== -1) {
          this.state.trendingDataSource[Index].likeCount = parseInt(
            this.props.likeDislikeData.likesCount,
          );
          this.state.trendingDataSource[Index].dislikeCount = parseInt(
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
          this.state.trendingDataSource[Index].operation = flag;

          this.setState(
            {
              likes: this.props.likeDislikeData.likesCount,
              disLike: this.props.likeDislikeData.dislikesCount,
            },
            () => {
              console.log(JSON.stringify(this.state.trendingDataSource));
            },
          );
        }
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
      if (this.state.trendingDataSource && this.props.shareData) {
        var Index = _.findIndex(this.state.trendingDataSource, {
          videoid: parseInt(this.props.shareData.videoId),
        });

        if (Index !== -1) {
          this.state.trendingDataSource[Index].sharesCount = parseInt(
            this.props.shareData.sharesCount,
          );

          this.setState(
            {
              shares: this.props.shareData.sharesCount,
            },
            () => {
              console.log(JSON.stringify(this.state.trendingDataSource));
            },
          );
        }
      }
    }

    if (
      this.state.errorTrendingDataVersion > prevState.errorTrendingDataVersion
    ) {
      this.setState({ errorMsg: this.props.errorMsg.msg });
      // Toast.show({
      //   text: this.props.errorMsg.msg,
      //   type: 'danger',
      // });
    }

    if (this.state.errorShareCountVersion > prevState.errorShareCountVersion) {
      Toast.show({
        text: this.props.shareErrorMsg,
        type: 'danger',
      });
    }

    // VIEWS COUNT
    if (
      this.state.successVideoViewsVersion > prevState.successVideoViewsVersion
    ) {
      var Index = _.findIndex(this.state.trendingDataSource, {
        videoid: parseInt(this.props.videoViewsData.videoId),
      });

      if (Index !== -1) {
        {
          this.state.trendingDataSource[Index].views = parseInt(
            this.props.videoViewsData.viewsCount,
          );

          this.setState({ views: this.props.videoViewsData.viewsCount }, () => {
            console.log(JSON.stringify(this.state.trendingDataSource));
          });
        }
      }
    }
    if (this.state.errorVideoViewsVersion > prevState.errorVideoViewsVersion) {
      Toast.show({
        text: this.props.videoViewsErrorMsg,
        type: 'danger',
        duration: 2500,
      });
    }
  }

  onCategoryPress(payload) {
    this.props.getTrendingList();
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

  onGiftClick(item) {
    this.goToDetailsScreen(item, "gift")
  }

  getTrendingList(item, index) {
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


  noRecordFound() {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: hp(10),
        }}>
        <_Text fsHeading fwHeading textColor={color.tertiaryGray}>
          No Trending video found
        </_Text>
      </View>
    );
  }

  // getCategory(item) {
  //   var payload = {
  //     categoryId: item.id,
  //   }
  //   const { categoryInnerView, catgeoryInnerSecondView, categoryIconView, categoryImg, categoryText } = VideoListingStyle
  //   return (
  //     <View style={categoryInnerView}>
  //       <View style={catgeoryInnerSecondView}>
  //         <TouchableOpacity onPress={() => this.onCategoryPress(payload)}>
  //           <View style={categoryIconView}>
  //             <Image
  //               resizeMode={"cover"}
  //               style={categoryImg}
  //               source={{ uri: urls.baseUrl + item.categoryIcon }}
  //             />
  //           </View>
  //           <View style={categoryText}>
  //             <_Text numberOfLines={1} fsSmall fwPrimary textColor={color.tertiaryGray}>{item.categoryName}</_Text>
  //           </View>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   )
  // }


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

    requestBody = {
      payload: {
        userId: userId,
        startLimit: page,
      },
    };

    await this.props.getTrendingList(requestBody);

  };


  footer = () => {
    return (
      <View>
        {!this.props.isFetching && this.state.trendingDataSource.length >= 10 ? (
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
          this.state.trendingDataSource.length >= 10 ? (
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
    const { categoryDataSource, trendingDataSource } = this.state;
    const { mainContainer, mainScrollView } = VideoListingStyle;

    const { isFetching, errorTrending } = this.props;

    return (
      <View
        style={{ flex: 1, alignItems: 'center', backgroundColor: color.white }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={mainScrollView}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => this.onPullRefresh()}
            />
          }>
          <View style={{ backgroundColor: '#fff', marginTop: hp(1) }}>
            {trendingDataSource ? (
              <FlatList
                data={trendingDataSource}
                ListEmptyComponent={this.noRecordFound}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => this.getTrendingList(item, index)}
                keyExtractor={(item, index) => item.videoid.toString()}
                //onEndReached={this.LoadMoreData}
                //onEndReachedThreshold={0.5}
                ListFooterComponent={this.footer}

              />
            ) : null}
          </View>
        </ScrollView>
        {!this.state.clickedLoadMore && isFetching ? (
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
        {errorTrending ? (
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
    isFetching: state.trendingReducer.isFetching,
    trendingData: state.trendingReducer.trendingData,
    errorTrending: state.trendingReducer.errorTrending,
    errorMsg: state.trendingReducer.errorMsg,
    successTrendingDataVersion:
      state.trendingReducer.successTrendingDataVersion,
    errorTrendingDataVersion: state.trendingReducer.errorTrendingDataVersion,

    shareData: state.videoListingReducer.shareData,
    shareError: state.videoListingReducer.shareError,
    shareErrorMsg: state.videoListingReducer.shareErrorMsg,
    errorShareCountVersion: state.videoListingReducer.errorShareCountVersion,
    successShareCountVersion:
      state.videoListingReducer.successShareCountVersion,

    likeDislikeData: state.trendingReducer.likeDislikeData,
    likeDislikeError: state.trendingReducer.likeDislikeError,
    likeDislikeErrorMsg: state.trendingReducer.likeDislikeErrorMsg,
    errorLikeDislikeCountVersion:
      state.trendingReducer.errorLikeDislikeCountVersion,
    successLikeDislikeCountVersion:
      state.trendingReducer.successLikeDislikeCountVersion,

    videoViewsData: state.trendingReducer.videoViewsData,
    successVideoViewsVersion: state.trendingReducer.successVideoViewsVersion,
    errorVideoViewsVersion: state.trendingReducer.errorVideoViewsVersion,
    videoViewsErrorMsg: state.trendingReducer.videoViewsErrorMsg,
    videoViewsError: state.trendingReducer.videoViewsError,
  };
}

const mapDispatchToProps = dispatch => ({
  getTrendingList: requestBody => dispatch(getTrendingList(requestBody)),
  getLikeDislikeCount: requestBody => dispatch(getLikeDislikeCount(requestBody)),
  resetReducer: () => dispatch(resetAllReducer()),
  getShareCount: requestBody => dispatch(getShareCount(requestBody)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Trending);
