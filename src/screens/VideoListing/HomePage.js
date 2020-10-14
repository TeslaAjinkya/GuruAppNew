import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  BackHandler,
  Dimensions,
  ToastAndroid,
  ScrollView,
  FlatList,
  Keyboard,
} from 'react-native';
import {Icon, Header, Item, Input, Card, Body,Toast} from 'native-base';
import {connect} from 'react-redux';
import _Container from '@container/_Container';
import {capitalizeFirstLetter} from '@values/validate';
import {color} from '@values/colors';
import _Tabs from '@tabs/_Tabs';
import HomePageStyle from '@videoListing/HomePageStyle';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import _Text from '@text/_Text';
import {strings} from '@values/strings';
import _ from 'lodash';
import Voice from '@react-native-community/voice';
const {height, width} = Dimensions.get('window');
import {getSearchResult} from '@videoListing/HomePageAction';
import VideoDetailsStyle from '@videoDetails/VideoDetailsStyle';
import {urls} from '@api/urls';
import AsyncStorage from '@react-native-community/async-storage';
import {viewProfile} from '@profile/ProfileAction';
import * as Animatable from 'react-native-animatable';

var backPressed = 0;
var dt1 = '';
var dt2 = '';
var userId = '';
var requestBody = {
  payload: {
    categoryId: '',
    startLimit: '0',
    userId: userId,
  },
};

let actionArray = [];

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      successSearchedDataVersion: 0,
      errorSearchedDataVersion: 0,
      searchTerm: '',
      isModalVisible: false,
      isMicModal: false,
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      started: false,
      results: [],
      partialResults: [],
      searchResult: [],
      showSearchVideos: false,
      successViewProfileVersion: 0,
      errorViewProfileVersion: 0,
      viewProfileDataSource: '',
    };

    userId = global.userId;
    requestBody = {
      payload: {
        categoryId: '',
        startLimit: '0',
        userId: userId,
      },
    };

    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
  }

  componentDidMount = () => {
    const {searchTerm, isModalVisible} = this.state;
    var requestpayload = {
      payload: {
        userId: userId,
        startLimit: '0',
      },
    };
    this.props.viewProfile(requestpayload);
  }
    // BackHandler.addEventListener('hardwareBackPress', () => {

    //     if (isModalVisible && !searchTerm && backPressed > 0) {
    //         this.setState({
    //             isModalVisible: false
    //         })
    //     }
    //     if (backPressed > 0 && !isModalVisible && !searchTerm) {
    //         BackHandler.exitApp()
    //         backPressed = 0
    //     }
    //     else {
    //         // backPressed++;
    //         // ToastAndroid.show("Press Again To Exit GuruApp", ToastAndroid.SHORT);
    //         // setTimeout(() => { backPressed = 0 }, 2000);
    //         // return true;
    //     }

    //     return true;
    // })
  //};

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      successSearchedDataVersion,
      errorSearchedDataVersion,
      successViewProfileVersion,
      errorViewProfileVersion,
    } = nextProps;

    let newState = null;

    if (successSearchedDataVersion > prevState.successSearchedDataVersion) {
      newState = {
        ...newState,
        successSearchedDataVersion: nextProps.successSearchedDataVersion,
      };
    }
    if (errorSearchedDataVersion > prevState.errorSearchedDataVersion) {
      newState = {
        ...newState,
        errorSearchedDataVersion: nextProps.errorSearchedDataVersion,
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
    const {searchedData, viewProfileData, errorViewProfileMsg} = this.props;

    if (
      this.state.successSearchedDataVersion >
      prevState.successSearchedDataVersion
    ) {
      this.setState({searchResult: searchedData});
    }
    if (
      this.state.errorSearchedDataVersion > prevState.errorSearchedDataVersion
    ) {
      Toast.show({
        text: this.props.searchErrorMsg ? this.props.searchErrorMsg :strings.serverFailedMsg,
        type: 'danger',
      });
    }

    if (
      this.state.successViewProfileVersion > prevState.successViewProfileVersion
    ) {
      this.setState({viewProfileDataSource: viewProfileData.userProfile});
    }

    if (
      this.state.errorViewProfileVersion > prevState.errorViewProfileVersion
    ) {
      Toast.show({
        text: errorViewProfileMsg.msg,
        type: 'danger',
      });
    }
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  async searchUpdated(term) {
    var searchPayload = {
      payload: {
        userId: 4,
        searchKey: term.toString(),
        startLimit: 0,
      },
    };
    await this.props.getSearchResult(searchPayload);

    // this.setState({ searchResult: filteredData, searchTerm: term });

    this.setState({searchTerm: term.toString()});

    if (term.toString() === '') {
      this.setState({showSearchVideos: false});
    }
  }

  clearSearchTerm = () => {
    this.setState({searchTerm: '', showSearchVideos: false});
  };

  renderSearchbar = () => {
    this.setState({
      isModalVisible: true,
    });
  };

  closeSearchModal = () => {
    this.destroyRecognizer();

    this.setState({
      isModalVisible: false,
      isMicModal: false,
      searchTerm: '',
      showSearchVideos: false,
    });
  };

  openMicModal = () => {
    this.setState({
      isMicModal: true,
    });
  };

  closeMicModal = () => {
    Voice.destroy().then(Voice.removeAllListeners);
    this.destroyRecognizer();
  };

  onSpeechStart = e => {
    this.setState({
      started: true,
      error: '',
    });
  };

  onSpeechRecognized = e => {
    this.setState({
      recognized: '√',
    });
  };

  onSpeechEnd = e => {
    this.setState({
      end: '√',
      // searchTerm:this.state.results
    });
  };

  onSpeechError = e => {
    this.setState({
      error: e.error,
      started: false,
    });
  };

  onSpeechResults = e => {
    this.setState({
      results: e.value,
      searchTerm: e.value[0].toString(),
    });

    this.searchUpdated(e.value[0].toString());

    setTimeout(() => {
      this.closeMicModal();
    }, 1000);
  };

  startRecognizing = async () => {
    // this.setState({
    //   recognized: '',
    //   pitch: '',
    //   error: '',
    //   started: '',
    //   results: [],
    //   partialResults: [],
    //   end: '',
    // });

    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  onProfilePress() {
    this.props.navigation.navigate('Profile');
  }

  destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }

    this.setState({
      isMicModal: false,
      recognized: '',
      pitch: '',
      error: '',
      started: false,
      results: [],
      partialResults: [],
      end: '',
    });
  };

  getTabs(img, text) {
    const {thirdMainContainer, bottomImagesView} = HomePageStyle;
    return (
      <View style={thirdMainContainer}>
        <Image style={bottomImagesView} source={img} />
        <_Text fsExtraSmall fwPrimary numberOfLines={1}>
          {text}
        </_Text>
      </View>
    );
  }

  showSearchVideoList = data => {
    this.setState({
      showSearchVideos: true,
      searchTerm: data.videoTitle,
    });
  };

  diff_hours(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  }

  goToDetailsScreen = item => {
    setTimeout(() => {
      this.setState({
        showSearchVideos: false,
        isModalVisible: false,
        isMicModal: false,
        searchTerm: '',
      });

      this.props.navigation.navigate('VideoDetails', {
        videoData: item,
        actionArray,
      });
    }, 500);
  };

  getView(item) {
    const {
      upNextContainer,
      innerView,
      imgView,
      imgStyle,
      videoTitleView,
      agoViewsView,
      agoText,
      viewText,
    } = VideoDetailsStyle;

    var date = new Date(item.uploadedDate).toUTCString();

    return (
      <TouchableOpacity
        style={{flexDirection: 'row', paddingTop: 2, paddingBottom: 10}}
        onPress={() => this.goToDetailsScreen(item)}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={{flex: 0.5}}>
            <Image
              source={{uri: urls.baseUrl + item.videoThumbnail}}
              defaultSource={require('../../assets/img/noImage.png')}
              style={{height: 100, width: width / 2 - 30, borderRadius: 8}}
              resizeMode="cover"
            />
          </View>
          <View style={videoTitleView}>
            <_Text textColor={color.videoTitle} fsPrimary numberOfLines={2}>
              {item.videoTitle}
            </_Text>
            <_Text fsSmall textColor={color.tertiaryGray} numberOfLines={2}>
              {item.createrName.charAt(0).toUpperCase() +
                item.createrName.slice(1)}
            </_Text>
            <View style={{flexDirection: 'row', flex: 1}}>
              <_Text fsSmall numberOfLines={1} textColor={color.lightGray}>
                {item.views ? item.views : 0} {strings.view} •{' '}
              </_Text>
              <_Text fsSmall numberOfLines={1} textColor={color.lightGray}>
                {item.categoryName}
              </_Text>
            </View>
            <_Text fsSmall numberOfLines={1} textColor={color.lightGray}>
              {date.slice(0, 16)}
            </_Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      safeAreaView,
      firstContainer,
      firstContainerInner,
      logoView,
      logoImage,
      firstContainerIconView,
      searchImage,
      notificationImage,
      profileImage,
      insideThirdContainer,
      thirdContainerInner,
      secondContainerMain,
      secondContainerInner,
      inputStyle,
      searchInput,
      micModal,
      result,
    } = HomePageStyle;

    const {upNextStyle} = VideoDetailsStyle;

    const {
      searchTerm,
      isModalVisible,
      isMicModal,
      searchResult,
      showSearchVideos,
      error,
      started,
      results,
    } = this.state;
    const {videoData} = this.props;

    return (
      <SafeAreaView style={safeAreaView}>
        {isModalVisible && (
          <Modal
            animationType="slide"
            visible={this.state.isModalVisible}
            onRequestClose={this.closeSearchModal}>
            <SafeAreaView>
              <View>
                
                <Animatable.View animation='fadeInRight'>
                <Item style={searchInput}>
                  <TouchableOpacity onPress={() => this.closeSearchModal()}>
                    <Image
                      source={require('../../assets/img/left.png')}
                      style={{
                        height: 20,
                        width: 20,
                        alignItems: 'center',
                        marginRight: 17,
                      }}
                    />
                  </TouchableOpacity>

                  <Input
                    autoFocus={true}
                    //clearButtonMode="always"
                    onChangeText={value => this.searchUpdated(value)}
                    returnKeyType="search"
                    placeholder="Search GuruApp"
                    placeholderTextColor="#404040"
                    value={
                      searchTerm.length >= 30
                        ? searchTerm.substring(0, 30) + '...'
                        : searchTerm
                    }
                    style={inputStyle}
                  />

                  {searchTerm !== '' && (
                    <TouchableOpacity onPress={() => this.clearSearchTerm()}>
                      <Image
                        source={require('../../assets/img/close2.png')}
                        defaultSource={require('../../assets/img/close2.png')}
                        style={{
                          height: 20,
                          width: 20,
                          alignItems: 'center',
                          marginLeft: 15,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                  {!searchTerm && (
                    <TouchableOpacity onPress={() => this.openMicModal()}>
                      <Image
                        source={require('../../assets/img/mic.png')}
                        defaultSource={require('../../assets/img/mic.png')}
                        style={{
                          height: 20,
                          width: 20,
                          alignItems: 'center',
                          marginLeft: 12,
                          marginBottom: 5,
                        }}
                      />
                    </TouchableOpacity>
                  )}
                </Item>

                </Animatable.View> 
                {searchTerm !== '' && !showSearchVideos && searchResult &&
                  searchResult.map((data, index) => (
                    <TouchableOpacity
                      onPress={() => this.showSearchVideoList(data)}>
                      <Text
                        style={{
                          textAlign: 'left',
                          fontWeight: '500',
                          paddingHorizontal: 30,
                          marginTop: 15,
                          fontSize: 16,
                        }}>
                        {data.videoTitle}
                      </Text>
                    </TouchableOpacity>
                  ))}

                {searchTerm !== '' &&
                  !showSearchVideos &&
                  searchResult &&
                  searchResult.length === 0 && (
                    <Text 
                      style={{
                        textAlign: 'center',
                        paddingHorizontal: 30,
                        paddingVertical: 20,
                        fontSize: 16,
                      }}>
                      No result found for "{searchTerm}..."
                    </Text>
                  )}

                {showSearchVideos && (
                  <View style={{paddingHorizontal: 18, paddingVertical: 10}}>
                    <_Text
                      numberOfLines={1}
                      style={{marginBottom: 10}}
                      fsPrimary
                      fwPrimary
                      textColor={color.tertiaryGray}>
                      Search result for {searchTerm}
                    </_Text>

                    <View style={{paddingTop: 5, marginBottom: hp(35)}}>
                      <FlatList
                        keyboardShouldPersistTaps={'handled'}
                        data={searchResult}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item, index}) => this.getView(item)}
                        keyExtractor={(item, index) => item.videoid.toString()}
                      />
                    </View>
                  </View>
                )}
              </View>

              {isMicModal && (
                <Modal
                  animationType="slide"
                  //transparent={true}
                  visible={this.state.isMicModal}
                  onRequestClose={this.closeMicModal}>
                  <SafeAreaView>
                    <View>
                      <Item style={micModal}>
                        <TouchableOpacity onPress={() => this.closeMicModal()}>
                          <Image
                            source={require('../../assets/img/close1.png')}
                            style={{
                              height: 20,
                              width: 20,
                              alignItems: 'center',
                              marginRight: 20,
                            }}
                          />
                        </TouchableOpacity>
                      </Item>
                    </View>
                    <View
                      style={{
                        paddingLeft: 40,
                        top: 40,
                        flexDirection: 'column',
                      }}>
                      <Text style={{fontSize: 20, fontWeight: 'normal'}}>
                        Hi,
                      </Text>
                      <Text style={{fontSize: 16, fontWeight: 'normal'}}>
                        How Can I Help You,
                      </Text>
                    </View>

                    <View style={{alignItems: 'center', top: 80}}>
                      <TouchableOpacity
                        disabled={started}
                        onPress={() => this.startRecognizing()}>
                        <Image
                          source={require('../../assets/img/voice.png')}
                          defaultSource={require('../../assets/img/voice.png')}
                          style={{
                            height: 120,
                            width: 120,
                            resizeMode: 'contain',
                          }}
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 16,
                          top: 10,
                          fontWeight: 'normal',
                        }}>
                        {!this.state.started
                          ? `tap on mic to start`
                          : `Listening...`}
                      </Text>
                    </View>

                    <View style={{paddingHorizontal: 40, top: 100}}>
                      {this.state.results.map((result, index) => {
                        return (
                          <Text
                            key={`result-${index}`}
                            style={
                              ([result],
                              {paddingLeft: 40, top: 20, fontSize: 22})
                            }>
                            {result}
                          </Text>
                        );
                      })}

                      {results.length === 0 &&
                        error.message &&
                        error.message !== '203/Retry' && (
                          <Text style={{textAlign: 'center'}}>
                            {this.state.error.message}
                          </Text>
                        )}
                    </View>
                  </SafeAreaView>
                </Modal>
              )}
            </SafeAreaView>
          </Modal>
        )}
        <_Container
          showHeader
          showSearch
          profilePic={
            this.state.viewProfileDataSource
              ? this.state.viewProfileDataSource[0].userpic
              : null
          }
          showLoading={false}
          onSearchPress={() => this.renderSearchbar()}
          onProfilePress={() => this.onProfilePress()}>
          <_Tabs />
        </_Container>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    searchErrorMsg: state.homePageReducer.searchErrorMsg,
    searchedData: state.homePageReducer.searchedData,
    successSearchedDataVersion:
      state.homePageReducer.successSearchedDataVersion,
    errorSearchedDataVersion: state.homePageReducer.errorSearchedDataVersion,
    viewProfileData: state.profileReducer.viewProfileData,
    errorViewProfile: state.profileReducer.errorViewProfile,
    errorViewProfileMsg: state.profileReducer.errorViewProfileMsg,
    successViewProfileVersion: state.profileReducer.successViewProfileVersion,
    errorViewProfileVersion: state.profileReducer.errorViewProfileVersion,
  };
}

const mapDispatchToProps = dispatch => ({
  getSearchResult: requestBody => dispatch(getSearchResult(requestBody)),
  viewProfile: requestpayload => dispatch(viewProfile(requestpayload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePage);
