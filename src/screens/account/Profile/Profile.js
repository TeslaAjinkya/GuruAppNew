import React, { Component } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { urls } from '@api/urls';
import { connect } from 'react-redux';
import {
  View,
  Text,
  Image,
  Button,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Modal,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { strings } from '@values/strings';
import _Text from '@text/_Text';
import { color } from '@values/colors';
import { viewProfile } from '@profile/ProfileAction';



import { Toast } from 'native-base';



var actionArray = [];
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSegment: 1,
      successViewProfileVersion: 0,
      errorViewProfileVersion: 0,
      viewProfileDataSource: '',
      modalVisible: false,
      updateFlag: false
    };

    userId = global.userId;
  }

  componentDidMount() {
    var requestpayload = {
      payload: {
        userId: userId,
        startLimit: '0',
      },
    };
    this.props.viewProfile(requestpayload);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { successViewProfileVersion, errorViewProfileVersion } = nextProps;
    let newState = null;

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
    const { viewProfileData, errorViewProfileMsg } = this.props;

    if (
      this.state.successViewProfileVersion > prevState.successViewProfileVersion
    ) {
      this.setState({ viewProfileDataSource: viewProfileData.userProfile });
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

  getSegment(value, img, group) {
    const { selectedSegment } = this.state;

    return (
      <View
        style={{
          borderTopColor: color.lightGray,
          borderTopWidth: hp(0.1),
          borderLeftColor: color.lightGray,
          borderLeftWidth: hp(0.1),
          borderRightColor: color.lightGray,
          borderRightWidth: hp(0.1),
          borderBottomColor: color.lightGray,
          borderBottomWidth: hp(0.1),
          alignItems: 'center',
          height: hp(6),
          width: wp(48),
          justifyContent: 'center',
          backgroundColor:
            selectedSegment === value ? color.white : color.white,
        }}>
        <TouchableOpacity
          active={selectedSegment === value ? true : false}
          onPress={() => {
            this.setState({
              selectedSegment: value,
            });
          }}>
          {/* <View style={{backgroundColor:"yellow",alignSelf:"center"}}> */}
          <Image
            style={{
              height: hp(3.5),
              width: hp(3.5),
            }}
            source={img}
          />

          {/* </View> */}
        </TouchableOpacity>
      </View>
    );
  }

  goToDetailsScreen = item => {
    setTimeout(() => {
      this.props.navigation.navigate('VideoDetails', {
        videoData: item,
        actionArray,
      });
    }, 200);
  };

  noRecord(text) {
    return (
      <View
        style={{
          height: hp(40),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <_Text>{text}</_Text>
      </View>
    );
  }

  onMenuClick() {
    this.props.navigation.navigate('PrivacySafety')
  }



  getVideos = data => {
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
              <TouchableOpacity onPress={() => this.goToDetailsScreen(item)}>
                <Image
                  style={{
                    //borderRadius:5,
                    width: wp(30),
                    height: hp(12),
                    borderWidth: 1,
                    borderColor: color.textNote,
                  }}
                  defaultSource={require('../../../assets/img/default.png')}
                  source={{
                    uri: item.videoThumbnail
                      ? urls.baseUrl + item.videoThumbnail
                      : null,
                  }}
                />
              </TouchableOpacity>
            </View>
          )}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  editProfile = (data) => {
    this.props.navigation.navigate('EditProfile', { data: data })
  }




  render() {
    const { isFetching } = this.props;
    const { viewProfileDataSource } = this.state;
    return (
      <SafeAreaView>
        <View style={{ height: hp(100), backgroundColor: color.white }}>
          {viewProfileDataSource !== '' ? (
            <View>
              <View style={{ height: hp(7) }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
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
                  <View
                    style={{
                      flex: 0.8,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <_Text fsHeading bold>
                      {viewProfileDataSource[0].firstName +
                        ' ' +
                        viewProfileDataSource[0].lastName}
                    </_Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.onMenuClick()}
                    style={{
                      flex: 0.1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      defaultSource={require('../../../assets/img/menu1.png')}
                      source={require('../../../assets/img/menu1.png')}
                      style={{ height: hp(2.2), width: hp(2.2) }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    borderBottomWidth: wp(0.2),
                    borderBottomColor: color.videoBorderGray,
                  }}
                />
              </View>

              <View
                style={{
                  height: hp(19),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  resizeMode={'cover'}
                  style={{
                    height: hp(10),
                    width: hp(10),
                    borderRadius: hp(10) / 2,
                    borderWidth: wp(0.5),
                    borderColor: color.borderOrange,
                    backgroundColor: color.white,
                  }}
                  defaultSource={require('../../../assets/img/defaultImage.png')}
                  source={{
                    uri: viewProfileDataSource[0].userpic
                      ? urls.baseUrl + viewProfileDataSource[0].userpic
                      : null,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <_Text
                    style={{ marginTop: hp(0.4) }}
                    textColor={color.tertiaryGray}
                    fsHeading
                    bold>
                    @{viewProfileDataSource[0].userName}
                  </_Text>
                  <Image
                    source={require('../../../assets/img/lock1.png')}
                    style={{ height: hp(2), width: hp(2) }}
                  />
                </View>
              </View>

              <View style={{ height: hp(7) }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginLeft: wp(5),
                    marginRight: wp(5),
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      flex: 0.33,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <_Text
                      textColor={color.tertiaryGray}
                      bold
                      fsHeading
                      numberOfLines={1}>
                      {viewProfileDataSource[0].followingCount}
                    </_Text>
                    <_Text textColor={color.tertiaryGray} fsPrimary>
                      {strings.following}
                    </_Text>
                  </View>
                  <View
                    style={{
                      borderLeftWidth: wp(0.1),
                      height: hp(5),
                      borderLeftColor: color.videoBorderGray,
                    }}
                  />
                  <View
                    style={{
                      flex: 0.33,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <_Text
                      textColor={color.tertiaryGray}
                      bold
                      fsHeading
                      numberOfLines={1}>
                      {viewProfileDataSource[0].subscribersCount}
                    </_Text>
                    <_Text textColor={color.tertiaryGray} fsPrimary>
                      {strings.followers}
                    </_Text>
                  </View>
                  <View
                    style={{
                      borderLeftWidth: wp(0.1),
                      height: hp(5),
                      borderLeftColor: color.videoBorderGray,
                    }}
                  />
                  <View
                    style={{
                      flex: 0.33,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <_Text
                      textColor={color.tertiaryGray}
                      bold
                      fsHeading
                      numberOfLines={1}>
                      {viewProfileDataSource[0].totalViews}
                    </_Text>
                    <_Text textColor={color.tertiaryGray} fsPrimary>
                      {strings.view}
                    </_Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: hp(10),
                }}>
                <TouchableOpacity onPress={() => this.editProfile(viewProfileDataSource)}
                  style={{
                    width: wp(40),
                    height: hp(5),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: wp(0.2),
                    borderColor: color.secondaryGray,
                  }}>
                  <_Text fsPrimary textColor={color.tertiaryGray}>
                    {strings.editProfile}
                  </_Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: hp(4), marginTop: hp(5) }}>
                <View
                  style={{
                    flex: 0.1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View style={{ flexDirection: 'row' }}>
                    {this.getSegment(
                      1,
                      this.state.selectedSegment == 1
                        ? require('../../../assets/img/redExport.png')
                        : require('../../../assets/img/export.png'),
                    )}
                    {this.getSegment(
                      2,
                      this.state.selectedSegment == 2
                        ? require('../../../assets/img/heart.png')
                        : require('../../../assets/img/greyHeart.png'),
                    )}
                  </View>
                </View>
              </View>
              <View
                style={{
                  height: hp(40),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {this.state.selectedSegment == 1 ? (
                  <View>
                    {viewProfileDataSource !== ''
                      ? viewProfileDataSource[0].videoData.length !== 0
                        ? this.getVideos(viewProfileDataSource[0].videoData)
                        : this.noRecord('No Videos Found')
                      : this.noRecord('No Videos Found')}
                  </View>
                ) : (
                    <View>
                      {viewProfileDataSource !== ''
                        ? viewProfileDataSource[0].likedVideoList.length !== 0
                          ? this.getVideos(
                            viewProfileDataSource[0].likedVideoList,
                          )
                          : this.noRecord('No Like Videos Found')
                        : this.noRecord('No Like Videos Found')}
                    </View>
                  )}
              </View>
            </View>
          ) : null}
        </View>



        {isFetching ? (
          <View
            style={{
              height: hp(100),
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              backgroundColor: 'transparent',
              width: wp(100),
            }}>
            <ActivityIndicator size="large" color={color.tertiaryGray} />
          </View>
        ) : null}
      </SafeAreaView>
    );
  }
}
function mapStateToProps(state) {
  return {
    isFetching: state.profileReducer.isFetching,
    viewProfileData: state.profileReducer.viewProfileData,
    errorViewProfile: state.profileReducer.errorViewProfile,
    errorViewProfileMsg: state.profileReducer.errorViewProfileMsg,
    successViewProfileVersion: state.profileReducer.successViewProfileVersion,
    errorViewProfileVersion: state.profileReducer.errorViewProfileVersion,
  };
}

const mapDispatchToProps = dispatch => ({
  viewProfile: requestpayload => dispatch(viewProfile(requestpayload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
