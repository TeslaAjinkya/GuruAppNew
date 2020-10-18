import React, { Component } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  View,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  PermissionsAndroid, Text,
  Alert, Platform, ActivityIndicator
} from 'react-native';
import { color } from '@values/colors';
import _Text from '@text/_Text';
import { Button, Toast, Fab } from 'native-base';
import CameraRoll from '@react-native-community/cameraroll';
import Video from 'react-native-video';
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

import RNFetchBlob from 'rn-fetch-blob';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';


var options = {
  title: 'Select Video',
  mediaType: 'video',
  cameraRoll: true,
  quality: 0.5,
};


const CONSTANTS = {
  defaultMaxFileSize: 10000000,
  defaultMinFileSize: 1000,
  durationFormat: 's',
  videoMimeType: 'video/mp4',
  filePathStart: 'file://',
  base64: 'base64',
};

var Imageoptions = {
  title: 'Select Photo',
  mediaType: 'photo',

  customButtons: [
    { name: 'customOptionKey', title: 'Choose Images From Gallery' },
  ],

  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSegment: 1,
      fileUri: '',
      fileData: '',
      filePath: '',
      photos: [],
      videos: [],
      selectedVideo: '',
      selectedFlag: false,
      loading: false,
      uploaded: 0,
      successPostVideoVersion: 0,
      progressVisible: false
    };
  }


  static getDerivedStateFromProps(nextProps, prevState) {
    const { successPostVideoVersion, errorPostVideoVersion,

    } = nextProps;
    let newState = null;

    if (successPostVideoVersion > prevState.successPostVideoVersion) {
      newState = {
        ...newState,
        successPostVideoVersion: nextProps.successPostVideoVersion,
      };
    }

    return newState;
  }


  componentDidUpdate(prevProps, prevState) {
    const { postVideoData, errorPostMsg, categoryData, viewProfileData } = this.props;
    if (this.state.successPostVideoVersion > prevState.successPostVideoVersion) {

      this.setState({
        progressVisible: true
      })
    }
  }



  permissionRequest = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        CameraRoll.getPhotos({
          first: 20, // most recent first reverse ordr
          assetType: 'Videos',
        })
          .then(response => {
            this.setState({ videos: response.edges });
          })
          .catch(err => {
            console.log('err', err);
          });
      } else {
        Alert.alert('Access is needed to use existing videos while uploading');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  componentDidMount() {
    if (Platform.OS !== 'ios') {
      this.permissionRequest();
    } else if (Platform.OS === 'ios') {
      CameraRoll.getPhotos({
        first: 20, // most recent first reverse ordr
        assetType: 'Videos',
        cameraRoll: false,
      })
        .then(response => {
          this.setState({ videos: response.edges });
        })
        .catch(err => {
          console.log('err', err);
        });
    }
  }

  showSelectedVideo = async (item) => {
    this.getbase64(item.node.image)
  }

  getbase64 = async (item, config) => {

    this.props.navigation.navigate('PostDetails', {
      selectedVideoData: item,
      selectedVideoUrl: item.uri,
      config: item,
      isVideoFromGallary: false
      // videoPathBase64: 'data:' + item.node.type + ';base64,' + data,
    });
  }


  getVideos() {
    const { filePath, fileData, fileUri, videos } = this.state;
    console.log("videos", videos);
    return (
      <View>
        {videos.length > 0 ?
          this.showVideoGrid(videos) :
          <Text style={{ marginTop: hp(30), textAlign: 'center' }}>No videos found</Text>
        }</View>
    )
  }

  getMinutesFromSeconds(time) {
    const minutes = time >= 60 ? Math.floor(time / 60) : 0;
    const seconds = Math.floor(time - minutes * 60);

    return `${minutes >= 10 ? minutes : '0' + minutes}:${seconds >= 10 ? seconds : '0' + seconds
      }`;
  }

  showVideoGrid = (data) => {
    const { selectedSegment } = this.state;

    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <FlatList
          data={data}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'column',
                paddingHorizontal: 3,
                paddingVertical: 3,
              }}>
              <TouchableOpacity onPress={() => this.showSelectedVideo(item)}>

                <Image
                  style={{
                    //borderRadius:5,
                    width: wp(30),
                    height: hp(12),
                    borderWidth: 1,
                    borderColor: color.textNote,
                  }}
                  defaultSource={require('../../assets/img/default.png')}
                  source={{ uri: item.node.image.uri }}
                />
                <View
                  style={{
                    position: 'absolute',
                    paddingBottom: 8,
                    paddingRight: 8,
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}>
                  <View
                    style={{
                      backgroundColor: color.black,
                      paddingHorizontal: 3,
                      borderRadius: 2,
                    }}>
                    <_Text fsExtraSmall fwSmall textColor={color.white}>
                      {this.getMinutesFromSeconds(
                        item.node.image.playableDuration,
                      )}
                    </_Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };


  getVideo = async response => {

    let filePath = response.path;

    if (Platform.OS === 'android') {
      let index = (response.path).lastIndexOf('/');
      var fileName = (response.path).substring(index + 1, (response.path).length);
    }

    filePath =
      filePath.startsWith(CONSTANTS.filePathStart) && Platform.OS === 'ios'
        ? filePath.replace(CONSTANTS.filePathStart, '')
        : filePath;


    this.getbase64Two(filePath, response)

  };

  getbase64Two = async (uri, response) => {

    this.props.navigation.navigate('PostDetails', {
      selectedVideoUrl: uri,
      config: response,
      isVideoFromGallary: true
      // videoPathBase64: 'data:video/mp4;base64,' + data,
    });

  }

  openVideoPicker = () => {
    ImagePicker.openPicker({
      mediaType: "video",
    }).then(video => {
      console.log(" openVideoPicker video", video);
      this.getVideo(video);

    });
  }



  render() {
    return (
      <View style={{ flex: 1, width: wp(98), backgroundColor: color.white }}>
        <View style={{ flex: 0.2, backgroundColor: color.white }}>
          <View
            style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity
              onPress={() => this.openVideoPicker()}
              style={{
                flex: 0.98,

                backgroundColor: color.tertiaryGray,
                marginRight: wp(1),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                resizeMode={'contain'}
                style={{ height: hp(15), width: wp(12) }}
                source={require('../../assets/img/videoCamera.png')}
              />
            </TouchableOpacity>

          </View>
        </View>

        <View style={{ flex: 0.8, backgroundColor: color.white }}>
          <View>{this.getVideos()}</View>
        </View>

        {this.state.progressVisible &&
          <View>
            <Modal
              style={{
                justifyContent: 'flex-end',
                marginBottom: 0,
                marginLeft: 0,
                marginRight: 0,
              }}
              isVisible={this.state.progressVisible}
              onRequestClose={() => this.setState({ progressVisible: false })}
              onBackdropPress={() => this.setState({ progressVisible: false })}
              onBackButtonPress={() => this.setState({ progressVisible: false })}
            >
              <SafeAreaView>
                <View
                  style={{
                    height: hp(15),
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                  }}>
                  <Image
                    source={require('../../assets/gif/success1.gif')}
                    style={{ height: hp(10), width: hp(15) }}
                  />
                  <View style={{ position: 'absolute', }}>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', color: 'green' }}>Video Uploaded!!!</Text>
                  </View>
                </View>
              </SafeAreaView>
            </Modal>
          </View>
        }
      </View>
    );
  }
}


function mapStateToProps(state) {
  return {
    successPostVideoVersion: state.postVideoReducer.successPostVideoVersion,

  };
}

export default connect(mapStateToProps, {})(Post);
