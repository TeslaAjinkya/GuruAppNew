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

class ProfileNew extends Component {
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
        this.props.navigation.navigate('ManageAccount')
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


    showUploadedVideos = (item, index) => {
        const { viewProfileData } = this.props
        const data = viewProfileData && viewProfileData.userProfile

        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('VideoAnalytics', { data: item, videoList: data[0].videoData })}
            >
                <View style={{ paddingTop: hp(0.5), paddingBottom: hp(0.5) }}>
                    <View style={{ flexDirection: 'row', flex: 1, marginLeft: hp(1.5), marginRight: hp(0.5) }}>
                        <View style={{ flex: 0.30, justifyContent: 'flex-start', }}>
                            <Image style={{
                                height: hp(9), width: hp(14), borderRadius: 5,
                                borderWidth: 0.2, borderColor: color.gray
                            }}
                                source={{ uri: urls.baseUrl + item.videoThumbnail }}
                                resizeMode='cover'
                            />
                        </View>

                        <View style={{ justifyContent: 'flex-start', flex: 0.70, left: 5 }}>
                            <_Text numberOfLines={2} bold style={{ marginRight: hp(3) }}>
                                {item.videoTitle}
                            </_Text>

                            <_Text numberOfLines={2} fsPrimary fwPrimary
                                style={{ marginRight: hp(3), top: 5, }}>
                                {item.views} Views
                            </_Text>

                        </View>
                    </View>
                    <View style={{
                        paddingTop: hp(0.8), marginLeft: wp(30), marginRight: wp(3), alignSelf: 'stretch',
                        borderBottomColor: '#D3D3D3', borderBottomWidth: 1,
                    }}
                    />
                </View>
            </TouchableOpacity>
        )
    }


    render() {
        const { isFetching, viewProfileData } = this.props;
        const { viewProfileDataSource } = this.state;

        const profileData = viewProfileData && viewProfileData.userProfile


        return (
            <SafeAreaView style={{ flex: 1 }}>

                {profileData &&
                    <View style={{ flex: 1, backgroundColor: color.white }}>
                        <View>
                            <View style={{ height: hp(7) }}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.goBack()}
                                        style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center', }}>
                                        <Image
                                            defaultSource={require('../../../assets/img/left.png')}
                                            source={require('../../../assets/img/left.png')}
                                            style={{ height: hp(2.5), width: hp(2.5) }}
                                        />
                                    </TouchableOpacity>
                                    <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center', }}>
                                        <_Text fsHeading bold>{profileData[0].firstName + ' ' + profileData[0].lastName}</_Text>
                                    </View>
                                    <TouchableOpacity onPress={() => this.onMenuClick()}
                                        style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            defaultSource={require('../../../assets/img/menu1.png')}
                                            source={require('../../../assets/img/menu1.png')}
                                            style={{ height: hp(2.2), width: hp(2.2) }}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ borderBottomWidth: wp(0.2), borderBottomColor: color.videoBorderGray }} />
                            </View>

                            <View style={{ height: hp(17), flexDirection: 'row', width: wp(100), marginHorizontal: 5 }}>


                                <View style={{ width: wp(20), height: hp(15), alignItems: 'center', justifyContent: 'center', }}>
                                    <Image style={{
                                        height: hp(10), width: hp(10),
                                        borderRadius: hp(10) / 2, borderWidth: wp(0.5),
                                        borderColor: color.borderOrange, backgroundColor: color.white,
                                    }}
                                        defaultSource={require('../../../assets/img/defaultImage.png')}
                                        source={{ uri: profileData[0].userpic ? urls.baseUrl + profileData[0].userpic : null }}
                                    />
                                    {/* <_Text numberOfLines={1} fsHeading fwSmall style={{ top: 5 }}>
                                        {profileData[0].stage}
                                    </_Text> */}
                                </View>


                                <View style={{ height: hp(19), width: wp(70), flexDirection: 'column', justifyContent: 'space-evenly' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                        <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                                            <_Text textColor={color.tertiaryGray} bold fsHeading numberOfLines={1}>
                                                {profileData[0].followingCount}
                                            </_Text>
                                            <_Text textColor={color.tertiaryGray} fsPrimary>
                                                {strings.following}
                                            </_Text>
                                        </View>

                                        <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                                            <_Text textColor={color.tertiaryGray} bold fsHeading numberOfLines={1}>
                                                {profileData[0].subscribersCount}
                                            </_Text>
                                            <_Text textColor={color.tertiaryGray} fsPrimary>
                                                {strings.followers}
                                            </_Text>
                                        </View>
                                    </View>

                                    <View style={{ flex: 0.70, }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                                                <_Text
                                                    textColor={color.tertiaryGray}
                                                    bold
                                                    fsHeading
                                                    numberOfLines={1}>
                                                    {profileData[0].totalViews}
                                                </_Text>
                                                <_Text textColor={color.tertiaryGray} fsPrimary>
                                                    {strings.view}
                                                </_Text>

                                            </View>

                                            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                                                <_Text
                                                    textColor={color.tertiaryGray}
                                                    bold
                                                    fsHeading
                                                    numberOfLines={1}>
                                                    {profileData[0].videoData.length}
                                                </_Text>
                                                <_Text textColor={color.tertiaryGray} fsPrimary>
                                                    {strings.posts}
                                                </_Text>

                                            </View>

                                        </View>

                                    </View>

                                </View>

                            </View>
                        </View>

                        <View style={{ borderWidth: 0.5, borderColor: color.gray, padddingBottom: 10 }} />

                        <View style={{ justifyContent: 'center', width: wp(100), flex: 1, paddingTop: 10 }}>
                            <FlatList
                                data={profileData[0].videoData}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={item => item.videoid.toString()}
                                renderItem={({ item, index }) => (this.showUploadedVideos(item, index))}
                            />
                        </View>
                    </View>
                }


                { isFetching ? (
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
                ) : null
                }
            </SafeAreaView >
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileNew);
