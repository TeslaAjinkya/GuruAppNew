import React, { Component } from 'react';
import { View, Text, Image, Platform } from 'react-native';
import VideoListing from '@videoListing/VideoListing'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { HomePageStyle } from '@videoListing/HomePageStyle'
import _Text from '@text/_Text'
import { strings } from '@values/strings'
import { color } from '@values/colors';
import Video from 'react-native-video';
import { ScrollView } from 'react-native-gesture-handler';
import _ from 'lodash';

  export default {
    safeAreaView: {
        flex: 1,
        backgroundColor: color.white
    },
    // for top Bar
    firstContainer:{
        flex: 0.06, 
        backgroundColor: color.white, 
        justifyContent:'center'
    },
    firstContainerInner:{
        flexDirection:'row', 
        flex:1, 
        alignItems:'center'
    },
    logoView:{
        flex: 0.64
    },
    logoImage:{
        height: hp(4), width: hp(4), marginLeft: wp(3)
    },
    firstContainerIconView:{
        flex: 0.12, alignItems:'flex-start',
    },
    searchImage:{
        height: hp(2.5), width: hp(2.5)
    },
    notificationImage:{
        height: hp(3), width: hp(2.5)
    },
    profileImage:{
        height: hp(4.5), width: hp(4.5), borderRadius: hp(4.5) / 2
    },


  // for search 
  searchInput: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: '#CCC',
    borderWidth: 1,
    height: hp(7),
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  micModal: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    height: 50,
    borderColor: 'white',
    borderWidth: 0
  },
  stat: {
    fontSize: 20,
    textAlign: 'left',
    marginBottom: 1,
  },
    inputStyle: {
        borderWidth: 0.5, height: Platform.OS !== 'ios' ? hp(5.5) : hp(4),
        borderColor: color.videoListingbackgroundColor,
        backgroundColor: color.searchInputBackColor,
    },
    //for Bottom bar
    thirdMainContainer:{
        flex:0.2, 
        backgroundColor:color.white,
        justifyContent:'center', 
        alignItems:'center'
    },
    bottomImagesView:{
        height: hp(3), 
        width: hp(3),
        justifyContent:'center', 
        alignItems:'center'
    },
    insideThirdContainer:{
        flex:0.08
    },
    thirdContainerInner:{
        flex:1,flexDirection:'row'
    },

    //for VideListing 
    secondContainerMain:{
        flex:0.86
    },
    secondContainerInner:{
        flex: hp(1) 
    }
  };
  