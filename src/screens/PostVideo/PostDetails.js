import React, {Component, createRef} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Video from 'react-native-video';
import _Container from '@container/_Container';
import {
  Text,
  View,
  Image,
  FlatList,
  Platform,
  ScrollView,
  Icon,
  TouchableWithoutFeedback,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {color} from '@values/colors';
import _Text from '@text/_Text';
import _InputBox from '@inputBox/_InputBox';
import _FloatingInputBox from '@floatingInputBox/_FloatingInputBox';
import PostDetailsStyle from '@post/PostDetailsStyle';
import Modal from 'react-native-modal';
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

import {Toast, Thumbnail} from 'native-base';
import {postVideo, getProfile} from '@post/PostVideoAction';
import {connect} from 'react-redux';
import styles from '@videoDetails/VideoDetailsStyle';
import PostVideoControls from '@post/PostVideoControls';
import {
  getCategory
} from '@videoListing/VideoListingAction';
import {urls} from '@api/urls';

var userId = ""

const CONSTANTS = {
  defaultMaxFileSize: 10000000,
  defaultMinFileSize: 1000,
  durationFormat: 's',
  videoMimeType: 'video/mp4',
  filePathStart: 'file://',
  base64: 'base64',
};


class PostDetails extends Component {
  constructor(props) {
    super(props);

    const data = this.props.route.params.selectedVideoData;
    const videouUrl = this.props.route.params.selectedVideoUrl;
    const videoPathBase64 = this.props.route.params.videoPathBase64;
    const data2 = this.props.route.params.config;

    
    this.state = {
      title: '',
      description: '',
      category: '',
      thumbnail: '',
      thumbnailUri: '',
      keywords: '',
      currentTime: 0.0,
      play: false,
      remainingTime: 0.0,
      playableTime: 0.0,
      duration: 0.0,
      buffering: true,
      animated: new Animated.Value(0),
      categoryModalVisible: false,
      thumbnailModalVisible: false,
      selectedImage: '',
      thumbnailUriBase64: '',
      successPostVideoVersion: 0,
      errorPostVideoVersion: 0,
      selectedCategoryId:'',
      successCategoryVersion: 0,
      errorCategoryDataVersion: 0,
      categoryDatafromState:[],
      successViewProfileVersion: 0,
      errorViewProfileVersion: 0,
      viewProfileDataSource: '',
      config:data2,
      progressVisible:false
    };

    this.postVideoRef = createRef();
    userId = global.userId;
  }

  componentDidMount() {
    this.props.getCategory()

    var requestpayload = {
      payload: {
        userId: userId,
        startLimit: '0',
      },
    };
    this.props.getProfile(requestpayload);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {successPostVideoVersion, errorPostVideoVersion, 
      successCategoryVersion,
      errorCategoryDataVersion,
      successViewProfileVersion,
      errorViewProfileVersion,
    } = nextProps;
    let newState = null;

    if (successCategoryVersion > prevState.successCategoryVersion) {
      
      newState = {
        ...newState,
        successCategoryVersion: nextProps.successCategoryVersion,
      };
    }

    if (successPostVideoVersion > prevState.successPostVideoVersion) {
      newState = {
        ...newState,
        successPostVideoVersion: nextProps.successPostVideoVersion,
      };
    }

    if (errorPostVideoVersion > prevState.errorPostVideoVersion) {
      newState = {
        ...newState,
        errorPostVideoVersion: nextProps.errorPostVideoVersion,
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

  componentDidUpdate(prevProps, prevState) {
    const {postVideoData, errorPostMsg,categoryData,viewProfileData} = this.props;

  if (
      this.state.successCategoryVersion >
      prevState.successCategoryVersion
    ) {
      
      this.setState({categoryDatafromState: categoryData});
    }

    if (this.state.successPostVideoVersion > prevState.successPostVideoVersion) {
    
      Toast.show({
        text: postVideoData.msg,
        type: 'success',
      });

      this.props.navigation.navigate('HomePage');
    }

    if (this.state.errorPostVideoVersion > prevState.errorPostVideoVersion) {
      
      Toast.show({
        text: errorPostMsg.msg ? errorPostMsg.msg: "Server Error",
        type: 'danger',
      });
    }
    if (this.state.successViewProfileVersion > prevState.successViewProfileVersion) {
      this.setState({viewProfileDataSource: viewProfileData.userProfile[0]});
    }

    if (this.state.errorViewProfileVersion > prevState.errorViewProfileVersion) {
      Toast.show({
        text: this.props.errorViewProfileMsg.msg ? this.props.errorViewProfileMsg.msg: "Server Error",
        type: 'danger',
      });
    }
  }


  handlePlayPause = async() => {
    const {currentTime, playableTime,play } = this.state
    console.log("currentTime",currentTime);
    console.log("playableTime",playableTime);


    if (this.state.play) {
      this.setState({play: false});
      return;
    } else {
      this.setState({play: true});
    }
    // if(currentTime === playableTime){
    //   await this.postVideoRef.current.seek(0);
    // }
  };

  onSeek = data => {
    this.postVideoRef.current.seek(data.seekTime);
    this.setState({currentTime: data.seekTime});
  };

  onProgress = data => {
    this.setState({
      currentTime: data.currentTime,
      playableTime: data.playableDuration,
    });
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

  onLoad = data => {
    this.setState({
      duration: data.duration,
      currentTime: data.currentTime,
    });
  };

  onEnd = async () => {
    await this.postVideoRef.current.seek(0);
    this.setState({play: false});
  };

  showCategories = () => {
    this.setState({
      categoryModalVisible: !this.state.categoryModalVisible,
    });
  };

  setSelectedCategory = (item) => {
    this.showCategories()
    this.setState({ category: item.categoryName,selectedCategoryId:item.id })
  }

  categorySeperator = () => {
    return (
      <View
        style={{
          borderBottomColor: color.videoBorderGray,
          borderBottomWidth: 0.5,
          width: wp(95),
        }}
      />
    );
  };

  categoryModal = () => {

    const { categoryDatafromState } = this.state
   
    return (
      <View>
        <Modal
          style={{
            justifyContent: 'flex-end',
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
          }}
          isVisible={this.state.categoryModalVisible}
          onRequestClose={this.showCategories}
          onBackdropPress={() => this.showCategories()}>
          <SafeAreaView>
            <View
              style={{
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FlatList
                data={categoryDatafromState}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={this.categorySeperator}
                renderItem={({item}) => (
                  <View style={{paddingVertical: 12, alignItems: 'center'}}>
                    <TouchableOpacity
                     hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
                      onPress={() => this.setSelectedCategory(item)}>
                      <_Text fsPrimary fwPrimary>{item.categoryName}</_Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    );
  };

  openImagePicker() {
    
    var Imageoptions = {
      mediaType: 'photo',
      quality: 0.3,
      storageOptions: {
        skipBackup: true,
        path: 'images',
        quality: 0.3
      },
    };

    ImagePicker.launchImageLibrary(Imageoptions, response => {      
      if (response.didCancel == true) {
        console.log("cancel")
      } else if (response.uri && response.fileName) {
        //const source = { uri: response.origURL };

        var imagePathBase64 = response.uri
          ? 'data:' + response.type + ';base64,' + response.data
          : undefined;
          
        // var fileName = response.fileName.split('.').slice(0, -1).join('.')
        
        // fileName = fileName.split(' ').join('')
        // fileName = fileName.split('.').join('')
        
        // var fileExtension = response.fileName.split('.')[1]

        // var thumbnailString = fileName.length>25 ? fileName.substring(0,25)+'.'+fileExtension : fileName + '.' + fileExtension
        this.setState({
           thumbnail: response.fileName.split(' ').join(''),
          //thumbnail:thumbnailString,
          selectedImage: response,
          thumbnailUriBase64: imagePathBase64,
        });
      }
    });
  }


  openImagePickerNew = () => {
    ImagePicker.openPicker({
      // width: wp(95),
      // height: hp(35),
      includeBase64: true,
      cropping: false,
      mediaType:'photo',
      compressImageQuality:0.8
    }).then(image => {
      console.log("post details image image", image);
      if (image) {
        var imagePathBase64 = image.path ? 'data:' + image.mime + ';base64,' + image.data
          : undefined;
      }
      if (Platform.OS === 'android') {
        let index = (image.path).lastIndexOf('/');
        var name = (image.path).substring(index + 1, (image.path).length);

      }
      console.log("name", name);

      this.setState({
        thumbnail: Platform.OS === 'ios' ? image.filename : name,
        selectedImage: image,
        thumbnailUriBase64: imagePathBase64,
      });
    });
  };



  
   formatFileSize = (bytes,decimalPoint=2)=> {
    if(bytes == 0) return '0 Bytes';
    var k = 1000,
        dm = decimalPoint || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
 }
 

  openThumbnailModal = () => {
    this.setState({thumbnailModalVisible: true});
  };

  closeThumbnailModal = () => {
    this.setState({thumbnailModalVisible: false});
  };

  showThumbnailModal = (data) => {

     return (
      <View>
        <Modal
          style={{
            justifyContent: 'flex-end',
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
          }}
          isVisible={this.state.thumbnailModalVisible}
          onRequestClose={this.closeThumbnailModal()}
          onBackdropPress={() => this.closeThumbnailModal()}>
          <SafeAreaView>
            <View
              style={{
                backgroundColor: 'red',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FlatList
                data={categoryDatafromState}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={this.categorySeperator}
                keyExtractor={item => item.name}
                renderItem={({item}) => (
                  <View style={{paddingVertical: 12, alignItems: 'center'}}>
                    <TouchableOpacity
                      hitSlop={{
                        top: 10,
                        bottom: 10,
                        left: hp(50),
                        right: hp(50),
                      }}
                      onPress={() => this.setSelectedCategory(item)}>
                      <_Text fsPrimary fwPrimary>
                        {item.name}
                      </_Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    );
  };

  showToast = (msg, type, duration) => {
    Toast.show({
      text: msg ? msg : 'Something went wrong, Please try again',
      type: type ? type : 'danger',
      duration: duration ? duration : 2500,
    });
  };

  uploadVideo = async () => {
    const { selectedImage, selectedCategoryId, thumbnailUriBase64,
      config, title, description, category, thumbnail, keywords } = this.state

    const { selectedVideoData, selectedVideoUrl, videoPathBase64,isVideoFromGallary } = this.props.route.params;

    let error = '';

    console.log("config",config);

    console.log("this.state",this.state);
    
    if (isVideoFromGallary) {
      console.log("here two");
      let index = (config.path).lastIndexOf('/');
      var fromGallaryVdoName = (config.path).substring(index + 1, (config.path).length);
    }

    if (Platform.OS === 'android' && selectedImage) {
      console.log("here two");
      let index2 = (selectedImage.path).lastIndexOf('/');
      var thumbnailName = (selectedImage.path).substring(index2 + 1, (selectedImage.path).length);
    }


    try {
      if (!title) {
        error = 'Please Enter Title';
        throw new Error();
      }
      if (!description) {
        error = 'Please Enter Description';
        throw new Error();
      }
      if (!keywords) {
        error = 'Please Enter Keywords';
        throw new Error();
      }
      if (!category) {
        error = 'Please Select Category';
        throw new Error();
      }
      if (!thumbnail) {
        error = 'Please Add Video Thumbnail';
        throw new Error();
      }
       else if ( title && description && keywords && category && thumbnail  && selectedVideoUrl){
      
        // let filePath = this.state.config.uri;

        // filePath =
        //   filePath.startsWith(CONSTANTS.filePathStart) && Platform.OS === 'ios'
        //     ? filePath.replace(CONSTANTS.filePathStart, '')
        //     : filePath;

        const data = new FormData();

        data.append('userId', userId);
        data.append('videoTitle', title);
        data.append('videoDescription', description);
        data.append('videoKeywords', keywords);
        data.append('categoryId', selectedCategoryId);

        data.append('videoThumbnail', {
          uri: selectedImage.path,
          type: selectedImage.mime,
          name: Platform.OS === 'ios' ? selectedImage.filename : thumbnailName
        });
        
        data.append('video', {
          uri: isVideoFromGallary ? config.path : config.uri,
          type: isVideoFromGallary ? config.mime : 'video/mp4',
          //  name: Platform.OS === 'ios' ? this.state.config.filename : videoFileName ,
          name: isVideoFromGallary ? fromGallaryVdoName : config.filename,

        });

        // const config = {
        //   // method: 'POST',
        //   // headers: {
        //   //   'Accept': 'application/json',
        //   //   'Content-Type': 'multipart/form-data',
        //   // },
        //   body: data,
        // };

        //  fetch("http://13.233.165.115:3000/postvideo", config)
        // .then(response => 
        //   console.log(response.json()).then(data => console.log("data",data))
        // ).catch(err =>  console.log(err)).then(error => console.log("error",error));
      
       this.props.postVideo(data);

    } 
  }catch (err) {
      this.showToast(error, 'danger');
    }
  }

  onInputChanged = ({inputKey, isValid, value}) => {
    let validationKey = '';
    switch (inputKey) {
      case 'title':
        validationKey = 'isTitle';
        break;

      case 'description':
        validationKey = 'isDescription';
        break;

        case 'keywords':
          validationKey = 'isKeywords';
          break;

      default:
        break;
    }

    this.setState({
      [inputKey]: value,
      [validationKey]: isValid,
    });
  };

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  render() {
    const {
      title,
      description,
      category,
      thumbnail,
      duration,
      play,
      keywords,
      currentTime,
      playableTime,
      categoryModalVisible,
      selectedImage,
      buffering,
      thumbnailUriBase64,
      viewProfileDataSource
    } = this.state;

    const {selectedVideoData, selectedVideoUrl} = this.props.route.params;

    const {btnView, nextBtn} = PostDetailsStyle;

    const {isFetching,isFetchingTwo,viewProfileData} = this.props;

    const interpolatedAnimation = this.state.animated.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    
    const rotateStyle = {
      transform: [{rotate: interpolatedAnimation}],
    };

    var date = new Date().toUTCString()

    return (
      <SafeAreaView>
        <View style={{height: hp(100), backgroundColor: color.white}}>
           <View style={{height: hp(28)}}>
            <Video
              ref={this.postVideoRef}
              source={{ uri:selectedVideoUrl}}
              style={{
                width: wp(100),
                height: Platform.OS === 'ios' ? hp(28) : hp(28),
                backgroundColor: 'black',
              }}
              resizeMode={'cover'}
              repeat={false}
              controlTimeout={3000}
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
              </View>
            )}
          </View>
       
          <View style={styles.controlOverlay}>    
              <TouchableOpacity
                onPress={() => this.navigateBack()}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                style={{
                  alignSelf: 'flex-start',
                  alignItems: 'flex-start',
                  padding: 10,
                }}>
                <Image
                  defaultSource={require('../../assets/img/whiteleftarrow.png')}
                  source={require('../../assets/img/whiteleftarrow.png')}
                  style={{height: 20, width: 20}}
                />
            </TouchableOpacity>
           
              <PostVideoControls
                onPlay={this.handlePlayPause}
                onPause={this.handlePlayPause}
                playing={play}
                currentTime={currentTime}
                playableTime={playableTime}
                duration={duration > 0 ? duration : 0}
                onSlideStart={this.handlePlayPause}
                onSlideComplete={this.handlePlayPause}
                onSlideCapture={this.onSeek}
              />
          
           </View> 

          <View style={{height: hp(7)}}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                backgroundColor: color.backgroundColor,
              }}>
              <View
                style={{
                  flex: 0.15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  resizeMode={'cover'}
                  style={{
                    height: hp(5),
                    width: hp(5),
                    borderRadius: hp(5) / 2,
                    borderWidth: wp(0.5),
                    borderColor: color.borderOrange,
                    backgroundColor: color.white,
                  }}
                 // defaultSource={require('../../assets/img/defaultImage.png')}
                  source={{uri: urls.baseUrl + viewProfileDataSource.userpic}}
                />
              </View>
              <View
                style={{
                  flex: 0.85,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                <_Text fsHeading bold>
                {viewProfileDataSource ? viewProfileDataSource.userName : ''}
                </_Text>
                <_Text fsExtraSmall textColor={color.lightGray} style={{marginTop:3}}>
                  {date.slice(0,16)}
                </_Text>
              </View>
            </View>
          </View>

          <View style={{height: hp(65)}}>
            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
            <View style={{marginTop: hp(1)}}>
            
                <_FloatingInputBox
                  label={'Title (0-100)'}
                  maxLength={100}
                  minLength={3}
                  inputKey="title"
                  type="title"
                  value={title ? title : null}
                  onChangeText={this.onInputChanged}
                  />
            </View>
            <View style={{marginTop: hp(0.4)}}>
             
                <_FloatingInputBox
                  label={'Description (0-1000)'}
                  maxLength={1000}
                  minLength={3}
                  type="description"
                  inputKey="description"
                  value={description ? description : null}
                  onChangeText={this.onInputChanged}
                />
              </View>
              <View style={{marginTop: hp(0.4)}}>
            
               <_FloatingInputBox
                label={'Keywords (0-20) e.g Songs, Cricket'}
                maxLength={1000}
                minLength={3}
                type="keywords"
                inputKey="keywords"
                value={keywords ? keywords : null}
                onChangeText={this.onInputChanged}
                />
            </View>

            <View
              style={{
                marginTop: hp(0.4),
                marginLeft: hp(2),
                flexDirection: 'row',
              }}>
          
               <_FloatingInputBox
                disabled={true}
                label={'Category'}
                maxLength={1000}
                minLength={3}
                type="category"
                inputKey="category"
                zeroMarginFromLeft={true}
                value={category ? category : null}
                />
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: 'transparent',
                  marginTop: 15,
                  width: wp(90),
                  height: hp(6),
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}>
                <TouchableOpacity
                  hitSlop={{top: 10, bottom: 10, left: hp(50), right: 30}}
                  onPress={() => this.showCategories()}>
                  <Image
                    defaultSource={require('../../assets/img/downArrow2.png')}
                    source={require('../../assets/img/downArrow2.png')}
                    style={{height: hp(2), width: hp(2),top:Platform.OS === 'ios' ? -18 : -7}}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                marginTop: hp(1),
                marginLeft: hp(2),
                flexDirection: 'row',
              }}>
                <_FloatingInputBox
                  disabled={true}
                  label={'Thumbnail'}
                  maxLength={30}
                  minLength={3}
                  type="thumbnail"
                  inputKey="thumbnail"
                  zeroMarginFromLeft={true}
                  value={thumbnail ? thumbnail : null}
                />

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  position: 'absolute',
                  backgroundColor: 'transparent',
                  marginTop: 15,
                  width: wp(90),
                  height: hp(6),
                  alignItems:'flex-end', paddingBottom: hp(1)
                
                }}>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <TouchableOpacity  
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 0}}
                  onPress={() => this.openImagePickerNew()}>
                    <_Text fsSmall fwPrimary textColor={color.likeBlueColor}style={{marginBottom:Platform.OS === 'ios' ? 7 : 0}}>{thumbnail === '' ? `ADD ` : `CHANGE `}</_Text>
                  {/* <Image
                    defaultSource={
                      thumbnail !== ''
                        ? require('../../assets/img/edit.png')
                        : require('../../assets/img/add.png')
                    }
                    source={
                      thumbnail !== ''
                        ? require('../../assets/img/edit.png')
                        : require('../../assets/img/add.png')
                    }
                    style={{
                      height: thumbnail !== '' ? hp(3) : hp(3),
                      width: thumbnail !== '' ? hp(3) : hp(3),
                    }}
                  /> */}
                  </TouchableOpacity>
                </View>

                {/* <TouchableOpacity
                  style={{flex: 0.15, alignItems: 'center'}}
                  disabled={thumbnail === ''}
                  hitSlop={{top: 10, bottom: 10, left: 0, right: 10}}
                  onPress={() => this.openThumbnailModal()}>
                    <_Text fsSmall fwPrimary
                      textColor={thumbnail === '' ? color.gray : color.likeBlueColor}>
                      VIEW
                </_Text>
                </TouchableOpacity> */}
              </View>
            </View>

            <View style={[btnView,{marginBottom:hp(10)}]}>
              <TouchableOpacity
                onPress={() => this.uploadVideo()}
                style={[nextBtn, {backgroundColor: color.loginColor}]}>
                <_Text fwSmall textColor={color.white}>
                  Upload
                </_Text>
              </TouchableOpacity>
            </View>
            </ScrollView>
          </View>

          <Modal
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            isVisible={this.state.thumbnailModalVisible}
            onRequestClose={() => this.closeThumbnailModal()}
            onBackdropPress={() => this.closeThumbnailModal()}>
            <View
              style={{
                backgroundColor: color.white,
                 alignItems: 'center',
                 justifyContent: 'center',
              }}>
              <Image
                defaultSource={require('../../assets/img/default.png')}
                source={{ uri: thumbnailUriBase64 }}
                style={{ height: wp(80), width: hp(100), resizeMode: 'contain' }}
              />
              {/* <TouchableOpacity
              style={{  width: 25,
                height: 25,
                top: 9,
                right: 9,
                position: 'absolute',}}
                onPress={() => this.closeThumbnailModal()}>
                <Image
                  defaultSource={require('../../assets/img/default.png')}
                  source={require('../../assets/img/default.png')}
                  style={{ width: 35, height: 35, marginTop: 16 }}
                />
            </TouchableOpacity>  */}
            </View>
          </Modal>

          {categoryModalVisible && this.categoryModal()}
          
        </View>
        
        {isFetchingTwo &&
          <View
            style={{
              height: hp(100),
              backgroundColor: 'transparent',
              position: 'absolute',
              width: wp(100),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../../assets/gif/loading.gif')}
              style={{ height: hp(13), width: wp(20) }}
            />
            <Text  style={{ fontSize: 16,fontWeight:'bold' }}>Uploading... Please Wait</Text>
            {/* <ActivityIndicator size="large" color={color.tertiaryGray} /> */}
          </View>
        }
        {isFetching &&
          <View
            style={{
              height: hp(100),
              backgroundColor: 'transparent',
              position: 'absolute',
              width: wp(100),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size="large" color={color.tertiaryGray} />
          </View>
        }
{/* 
        {this.state.progressVisible &&
          <View>
            <Modal
              style={{
                justifyContent: 'flex-end',
                marginBottom: 0, marginLeft: 0,
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
                    height: hp(20),
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10
                  }}>
                  <Image
                    source={require('../../assets/gif/loading.gif')}
                    style={{ height: hp(15), width: wp(18) }}
                  />
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Uploading... Please Wait</Text>
                </View>
              </SafeAreaView>
            </Modal>
          </View>
        } */}
       

      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetchingTwo: state.postVideoReducer.isFetchingTwo,
    postVideoData: state.postVideoReducer.postVideoData,
    errorPostMsg: state.postVideoReducer.errorPostMsg,
    errorPostVideo: state.postVideoReducer.errorPostVideo,
    successPostVideoVersion: state.postVideoReducer.successPostVideoVersion,
    errorPostVideoVersion: state.postVideoReducer.errorPostVideoVersion,

    isFetching: state.postVideoReducer.isFetching,
    categoryData: state.postVideoReducer.categoryData,
    successCategoryVersion: state.postVideoReducer.successCategoryVersion,
    errorCategoryDataVersion: state.postVideoReducer.errorCategoryDataVersion,
    CatgoryDataErrorMsg: state.postVideoReducer.CatgoryDataErrorMsg,
    CategoryDataError: state.postVideoReducer.CategoryDataError,

    viewProfileData: state.postVideoReducer.viewProfileData,
    errorViewProfile: state.postVideoReducer.errorViewProfile,
    errorViewProfileMsg: state.postVideoReducer.errorViewProfileMsg,
    successViewProfileVersion: state.postVideoReducer.successViewProfileVersion,
    errorViewProfileVersion: state.postVideoReducer.errorViewProfileVersion,

  };
}

const mapDispatchToProps = dispatch => ({
  postVideo: (requestBody) => dispatch(postVideo(requestBody)),
  getCategory: () => dispatch(getCategory()),
  getProfile: requestpayload => dispatch(getProfile(requestpayload)),

});


export default connect(
  mapStateToProps,
  mapDispatchToProps)(PostDetails);

 /* <View style={styles.controlOverlay}>
<View
  style={{flexDirection: 'row',}}>
  <TouchableOpacity
    onPress={() => this.navigateBack()}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    style={{
      alignSelf: 'flex-start',
      alignItems: 'flex-start',
      padding: 10,
    }}>
    <Image
      defaultSource={require('../../assets/img/return.png')}
      source={require('../../assets/img/return.png')}
      style={{ height: 20, width: 20 }}
    />
  </TouchableOpacity>
  <PostVideoControls
    onPlay={this.handlePlayPause}
    onPause={this.handlePlayPause}
    playing={play}
    currentTime={currentTime}
    playableTime={playableTime}
    duration={duration > 0 ? duration : 0}
    onSlideStart={this.handlePlayPause}a
    onSlideComplete={this.handlePlayPause}
    onSlideCapture={this.onSeek}
  />
</View>

//    assetUri = (url)=>{
//     var ext = "mp4"

//     const id = url.substring(5, 41);

//     console.log("url ----",`assets-library://asset/asset.${ext}?id=${id}&ext=${ext}`);
    

//      return `assets-library://asset/asset.${ext}?id=${id}&ext=${ext}`

//    }
 */
/* </View>  */
