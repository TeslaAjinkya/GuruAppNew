import React, { Component, createRef } from 'react';
import {
    Text, View, Image, StyleSheet, Animated, BackHandler, Alert, ToastAndroid,
    Modal, SafeAreaView, TouchableOpacity, FlatList, Dimensions, Platform
} from 'react-native';
import VideoListing from '@videoListing/VideoListing'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import _Container from '@container/_Container'
import Register from '@register/Register'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Trending from '@trending/Trending';
import SubscribeChannel from '@subscribeChannel/SubscribeChannel'
import _Text from '@text/_Text'
import Post from '@post/Post'
import { color } from '@values/colors';
import * as Animatable from 'react-native-animatable';



const { width, height } = Dimensions.get('window')

var totalDuration = 0.00
var backPressed = 0;

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.unsubscribeFocus = this.props.navigation.addListener('focus', e => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        });
        this.unsubscribeBlur = this.props.navigation.addListener('blur', e => {
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton,);
        });

        onButtonPress = () => {
            BackHandler.removeEventListener(
                'hardwareBackPress',
                this.handleBackButton,
            );
        };
    }
    handleBackButton = () => {
        // Alert.alert(
        //     'Exit App',
        //     'Exiting the application?',
        //     [
        //         { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel', },
        //         { text: 'OK', onPress: () => BackHandler.exitApp(), },
        //     ],
        //     { cancelable: false, },
        // );
        if (backPressed > 0) {
            BackHandler.exitApp()
            backPressed = 0
        }
        else {
            backPressed++;
            ToastAndroid.show("Press Again To Exit App", ToastAndroid.SHORT);
            setTimeout(() => { backPressed = 0 }, 2000);
            return true;
        }

        return true;
    };

    componentWillUnmount() {
        this.unsubscribeFocus();
        this.unsubscribeBlur();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <VideoListing navigation={this.props.navigation}></VideoListing>
            </View>
        );
    }
}


class TrendingScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <Trending navigation={this.props.navigation}></Trending>
            </View>
        );
    }
}

class SubscribeScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <SubscribeChannel navigation={this.props.navigation}></SubscribeChannel>
            </View>
        );
    }
}


class PostScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <Post navigation={this.props.navigation}></Post>
                {/* <Text>PostScreen</Text> */}
            </View>
        );
    }
}

function PromoteScreen() {
    return (
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
            <Text>PromoteScreen!</Text>
        </View>

    );
}


const Tab = createBottomTabNavigator();

export default function _Tabs() {
    return (

        <Tab.Navigator initialRouteName="Home"
            tabBarOptions={{
                activeTintColor: '#e91e63',
                labelStyle: { fontSize: hp(1.5), margin: 0, padding: 0, }
            }}>
            <Tab.Screen name="Home"
                options={{
                    tabBarLabel: 'Home',
                    activeTintColor: color.subscribeColor,
                    tabBarIcon: ({ color, size, focused }) => {

                        if (focused) {
                            return (
                                <Image style={{
                                    height: hp(2.5),
                                    width: hp(2.5),
                                    marginTop: 3
                                }}
                                    source={require('../../assets/img/redHomeIcon.png')}
                                />
                                // <Animatable.Image
                                // duration={1000}
                                // animation="zoomIn"
                                // style={{height: hp(2.5),width: hp(2.5),marginTop: 3}}
                                // source={require('../../assets/img/redHomeIcon.png')}
                                // defaultSource={require('../../assets/img/redHomeIcon.png')}
                                // />
                            )
                        }
                        else {
                            return (
                                <Image style={{
                                    height: hp(2.5),
                                    width: hp(2.5),
                                    marginTop: 3
                                }}
                                    source={require('../../assets/img/home.png')}

                                />
                            )
                        }

                    }

                }} component={HomeScreen} />
            <Tab.Screen name="Trending"
                options={{
                    tabBarLabel: 'Trending',
                    activeTintColor: color.subscribeColor,

                    tabBarIcon: ({ color, size, focused }) => {

                        if (focused) {
                            return (
                                <Image style={{
                                    height: hp(2.5),
                                    width: hp(2.5),
                                    marginTop: 3
                                }}
                                    source={require('../../assets/img/redTrending.png')
                                    }

                                />
                            )
                        }
                        else {
                            return (
                                <Image style={{
                                    height: hp(2.5),
                                    width: hp(2.5),
                                    marginTop: 3

                                }}
                                    source={require('../../assets/img/trending.png')
                                    }

                                />
                            )
                        }

                    }

                }} component={TrendingScreen} />
            <Tab.Screen name="Post"
                options={{
                    tabBarLabel: 'Post',
                    activeTintColor: color.subscribeColor,

                    tabBarIcon: ({ color, size, focused }) => {

                        if (focused) {
                            return (
                                <Image style={{
                                    height: hp(2.5),
                                    width: hp(2.5),
                                    marginTop: 3

                                }}
                                    source={require('../../assets/img/redUpload.png')
                                    }

                                />
                            )
                        }
                        else {
                            return (
                                <Image style={{
                                    height: hp(2.5),
                                    width: hp(2.5),
                                    marginTop: 3
                                }}
                                    source={require('../../assets/img/upload.png')
                                    }

                                />
                            )
                        }

                    }

                }}
                component={PostScreen}
            />
            <Tab.Screen name="Followers"
                options={{
                    tabBarLabel: 'Followers',
                    activeTintColor: color.subscribeColor,

                    tabBarIcon: ({ color, size, focused }) => {

                        if (focused) {
                            return (
                                <Image style={{
                                    height: hp(2.5),
                                    width: hp(2.5),
                                    marginTop: 3
                                }}
                                    source={require('../../assets/img/redSubscription.png')
                                    }

                                />
                            )
                        }
                        else {
                            return (
                                <Image style={{
                                    height: hp(2.5),
                                    width: hp(2.5),
                                    marginTop: 3
                                }}
                                    source={require('../../assets/img/subscription.png')
                                    }

                                />
                            )
                        }

                    }

                }} component={SubscribeScreen} />
            <Tab.Screen name="Promote"
                options={{
                    tabBarLabel: 'Promote',
                    activeTintColor: color.subscribeColor,
                    activeTintColor: color.subscribeColor,
                    tabBarIcon: ({ color, size, focused }) => {

                        if (focused) {
                            return (
                                <Image style={{
                                    height: hp(2.5),
                                    width: hp(2.5),
                                    marginTop: 3
                                }}
                                    source={require('../../assets/img/redPromote.png')
                                    }

                                />
                            )
                        }
                        else {
                            return (
                                <Image style={{
                                    height: hp(2.5),
                                    width: hp(2.5),
                                    marginTop: 3
                                }}
                                    source={require('../../assets/img/promote.png')
                                    }

                                />
                            )
                        }

                    }

                }} component={PromoteScreen} />
        </Tab.Navigator>

    );
}

        //videoPathBase64: abc.uri ?    'data:' + abc.mime + ';base64,' + "abc".data : undefined,
       // data:image/gif;base64,${encodedBase64}`
//         var regex = /:\/\/(.{36})\//i;
// var result = pathRaw.match(regex);
// console.log("result", "assets-library://asset/asset.JPG?id="+result[1]+"&ext=JPG")

// CameraRoll.saveToCameraRoll(photo.uri, 'photo').then( u => { let name = Date.now(); let data = new FormData() data.append ('file',{ uri : u, type: 'image/jpg', name: name+'.jpg' }) console.log('image upload',data) promises.push(axios.post(url,data)); } )

