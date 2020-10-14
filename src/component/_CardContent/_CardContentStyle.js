import React, { Component } from 'react';
import { View, Text, Image, SafeAreaView } from 'react-native';
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
  mainTouchableView: {
    flexDirection: 'row',
    flex: 1,
    paddingTop: hp(1),
    paddingBottom: hp(1),
    alignItems: 'center',
  },
  creatorView: {
    flex: 0.15, alignItems: 'center'
  },
  imgProfile: {
    height: hp(5),
    width: hp(5),
    borderRadius: hp(5) / 2,
    borderWidth: wp(0.5),
    borderColor: color.borderOrange,
    backgroundColor: color.white,
  },
  creatorTextView: {
    flex: 0.7, alignItems: 'flex-start'
  },
  creatorDateView: {
    flexDirection: 'row'
  },
  menuView: {
    flex: 0.1, alignItems: 'flex-end'
  },
  menuImg: {
    height: hp(2), width: hp(2)
  },
  videoTitleView: {
    paddingLeft: wp(3),
    paddingRight: wp(3),
    paddingBottom: hp(0.5),
  },
  videoThumbnailView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(0.5),
  },
  thumbnailImg: {
    width: wp(99), height: wp(50),
  },
  countDisplayMainView: {
    paddingTop: hp(0.3),
    paddingLeft: wp(3),
    paddingRight: wp(3),
  },
  innerView: {
    flex: 1, flexDirection: 'row', alignItems: 'center'
  },
  innerView1: {
    flex: 0.5, flexDirection: 'row', alignItems: 'center'
  },
  likeView: {
    width: wp(5), height: hp(5)
  },
  likeText: {
    paddingLeft: wp(1)
  },
  shareCountView: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  borderLine: {
    width: wp(99),
    borderTopWidth: wp(0.1),
    borderTopColor: color.borderGray,
  },
  likeGiftShareMainView: {
    flexDirection: 'row',
    flex: 1,
    paddingTop: hp(0.5),
    paddingBottom: hp(0.5),
  },
  innerMainView: {
    flex: 0.35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeTouchable: {
    flex: 0.35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeDislikeImg: {
    width: wp(4), height: hp(4)
  }
}