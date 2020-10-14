import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color } from '@values/colors';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Platform,
  SafeAreaView, Dimensions } from 'react-native';
  export default {
   
    upNextContainer: {
        flexDirection: 'row',
        paddingTop: 2,
        paddingBottom: 10,
        borderRadius:6,
        width:wp(53),
        marginRight:wp(2)
        
    },
    upNextStyle: {
        flexDirection: 'column',
        paddingTop:hp(1),
      
      
    },
    innerView:{
        flex:1, flexDirection:'row'
    },
    imgView:{
        flex:0.5
    },
    imgStyle:{
        height: hp(14), width: wp(53) ,borderRadius:6
    },
    videoTitleView:{
        flex:0.5
    },
    agoViewsView:{
        flexDirection:'row', flex:1
    },
    agoText:{
        flex:0.5
    },
    viewText:{
        flex:0.5
    },
    container: {
    flex: 1,
    backgroundColor: 'white',
  },

  video: {
       width: wp(100),
       height: Platform.OS === 'ios' ? hp(25) : hp(30),
       backgroundColor: 'black',
  },
  

  fullscreenVideo: {
    // height: Dimensions.get('window').width,
    // width: Dimensions.get('window').height,
    height:wp(100),
    width:hp(100),
    backgroundColor: 'black',
  },
  fullscreenButton: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,

  },
  controlOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 10,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
  },
  buffering: {
    backgroundColor: "#000",
  },
  videoLoading: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },

  videoBannerStyle: {
    borderTopColor: color.videoBorderGray,
    height: hp(30),
    width: wp(100),
    alignItems: "flex-start"
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: wp(100)
  },
  videoTime: {
    flex: 1,
    paddingBottom: 8, paddingRight: 8,
    justifyContent: 'flex-end', alignSelf: 'flex-end',
  },
  videoTime2: {
    backgroundColor: color.black, paddingHorizontal: 5,
    borderRadius: 2
  },
  infoStyle: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  titleStyle: {
    paddingHorizontal: 10
  },
  title: {
    flexDirection: 'column'
  }
  };
  