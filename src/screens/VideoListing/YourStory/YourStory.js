import React, { Component } from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
    View, Text, Platform, PermissionsAndroid,
    Image, Button, ActivityIndicator, FlatList, SafeAreaView,
    Modal, Alert, TouchableOpacity,
} from 'react-native';
import { color } from '@values/colors';
import { strings } from '@values/strings';
import _Text from '@text/_Text';
import _CustomHeader from '@customHeader/_CustomHeader'
import { Col, Row, Grid, Toast } from 'native-base';
import _Card from '@card/_Card';
import ImagePicker from 'react-native-image-picker';
import HelperFunction from '@values/HelperFunction';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePickerTwo from 'react-native-image-crop-picker';

var videoOptions = {
    title: 'Select Video',
    mediaType: 'video',
    cameraRoll: true,
    quality: 0.5
};

var imageOptions = {
    title: 'Select Image',
    mediaType: 'photo',
    quality: 0.5,
    // allowsEditing: true
};

const cameraOptions = {
    title: 'Upload Story',
    customButtons: [{ name: 'Story', title: 'Choose Photo from Gallery' }],
};

const CONSTANTS = {
    defaultMaxFileSize: 10000000,
    defaultMinFileSize: 1000,
    durationFormat: 's',
    videoMimeType: 'video/mp4',
    filePathStart: 'file://',
    base64: 'base64',
};

export default class YourStory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedImage: ''
        };
    }

    componentDidMount = async () => {
        if (Platform.OS !== 'ios') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert('Access is needed to use existing photos/videos while uploading');
                }
            } catch (err) {
                console.warn(err);
            }
        };

    }

    openVideoPicker = async () => {

        ImagePickerTwo.openPicker({
            mediaType: "video",
        }).then(video => {
            console.log(" openVideoPicker video", video);
            let size = video.size
            if (size <= 50000000) {
                this.props.navigation.navigate('VideoStory', { video: video.path })
            }
            else {
                Toast.show({
                    text: "File size too large. Try importing short videos",
                    type: 'danger',
                    duration: 2500
                })
            }

        });

        // ImagePicker.launchImageLibrary(videoOptions, response => {
        //     if (response.uri) {
        //         let filePath = response.uri;
        //         let fileName = response.fileName;

        //         filePath =
        //             filePath.startsWith(CONSTANTS.filePathStart) && Platform.OS === 'ios'
        //                 ? filePath.replace(CONSTANTS.filePathStart, '')
        //                 : filePath;

        //         RNFetchBlob.fs.stat(filePath)
        //             .then((stats) => {
        //                 let size = stats.size
        //                 if (size <= 50000000) {
        //                     this.props.navigation.navigate('VideoStory', { video: response.uri })
        //                 }
        //                 else {
        //                     Toast.show({
        //                         text: "File size too large. Try importing short videos",
        //                         type: 'danger',
        //                         duration: 2500
        //                     })
        //                 }

        //                 console.log("response", response);
        //             })
        //     }
        // });

    }


    openImagePicker = () => {
        ImagePicker.launchImageLibrary(imageOptions, response => {

            if (response.uri) {
                const source = { uri: response.uri };

                this.props.navigation.navigate('ImageStory', { image: source, imageData: response })
            }
        });
    }


    openCamera = () => {
        ImagePicker.launchCamera(cameraOptions, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else if (response.uri) {
                const source = { uri: response.uri };

                this.props.navigation.navigate('CameraStory', { image: source, imageData: response })
            }
        });
    }

    takePhoto = () => {
        let color = { red: 10, green: 20, blue: 1 }
        return (
            <TouchableOpacity onPress={() => this.openCamera()}>
                <_Card borderRadius={10} propWidth={wp(95)}
                //backgroundColor={HelperFunction.getGradient(color)}
                >
                    <View style={{ height: hp(18) }}>
                        <Grid>
                            <Col
                                style={{
                                    justifyContent: 'center',
                                    width: wp(30),
                                    alignItems: 'center',
                                }}>
                                <Image
                                    defaultSource={require('../../../assets/img/camera.png')}
                                    source={require('../../../assets/img/camera.png')}
                                    style={{ height: hp(6), width: hp(6) }} />
                            </Col>
                            <Col style={{ justifyContent: 'center' }}>
                                <_Text
                                    numberOfLines={1}
                                    textColor={color.tertiaryGray}
                                    fsLarge
                                    fwHeading>
                                    Take a photo
                               </_Text>
                            </Col>

                        </Grid>
                    </View>
                </_Card>
            </TouchableOpacity>
        );
    }

    uploadImage = () => {
        return (
            <TouchableOpacity
                onPress={() => this.openImagePicker()}
            >
                <_Card borderRadius={10} propWidth={wp(95)}>
                    <View style={{ height: hp(18) }}>
                        <Grid>
                            <Col
                                style={{
                                    justifyContent: 'center',
                                    width: wp(30),
                                    alignItems: 'center',
                                }}>
                                <Image
                                    defaultSource={require('../../../assets/img/interface.png')}
                                    source={require('../../../assets/img/interface.png')}
                                    style={{ height: hp(6), width: hp(6) }} />
                            </Col>
                            <Col style={{ justifyContent: 'center' }}>
                                <_Text
                                    numberOfLines={1}
                                    textColor={color.tertiaryGray}
                                    fsLarge
                                    fwHeading>
                                    Image
                          </_Text>
                            </Col>

                        </Grid>
                    </View>
                </_Card>
            </TouchableOpacity>
        );
    }

    uploadVideo = () => {
        return (
            <TouchableOpacity
                onPress={() => this.openVideoPicker()}
            >
                <_Card borderRadius={10} propWidth={wp(95)}  >
                    <View style={{ height: hp(18) }}>
                        <Grid>
                            <Col
                                style={{
                                    justifyContent: 'center',
                                    width: wp(30),
                                    alignItems: 'center',
                                }}>
                                <Image
                                    defaultSource={require('../../../assets/img/movies.png')}
                                    source={require('../../../assets/img/movies.png')}
                                    style={{ height: hp(6), width: hp(6) }} />
                            </Col>
                            <Col style={{ justifyContent: 'center' }}>
                                <_Text
                                    numberOfLines={1}
                                    textColor={color.tertiaryGray}
                                    fsLarge
                                    fwHeading>
                                    Video
                            </_Text>
                            </Col>

                        </Grid>
                    </View>
                </_Card>
            </TouchableOpacity>

        );
    }

    render() {
        const gradientHeight = hp(80);
        const gradientBackground = 'purple';
        const data = Array.from({ length: gradientHeight });

        return (
            <SafeAreaView style={{ height: hp(100), }}>
                {data.map((_, i) => (
                    <View
                        key={i}
                        style={{
                            position: 'absolute', backgroundColor: gradientBackground,
                            height: 1, bottom: (gradientHeight - i), right: 0, left: 0,
                            // zIndex: 1,
                            opacity: (1 / gradientHeight) * (i + 1)
                        }}
                    />
                ))}
                <View style={{ height: hp(6), backgroundColor: color.white }}>
                    <View
                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}
                            style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                defaultSource={require('../../../assets/img/left.png')}
                                source={require('../../../assets/img/left.png')}
                                style={{ height: hp(2.5), width: hp(2.5) }}
                            />
                        </TouchableOpacity>
                        <View style={{ flex: 0.8, alignItems: 'center' }}>
                            <_Text fsHeading bold textColor={color.tertiaryGray}>
                                Create Story
                            </_Text>
                        </View>
                    </View>
                    <View
                        style={{
                            borderBottomWidth: wp(0.2),
                            borderBottomColor: color.videoBorderGray,
                        }}
                    />
                </View>

                <View style={{ paddingVertical: hp(0.5) }}>
                    {this.takePhoto()}
                    {this.uploadImage()}
                    {this.uploadVideo()}
                </View>
            </SafeAreaView>
        );
    }
}
