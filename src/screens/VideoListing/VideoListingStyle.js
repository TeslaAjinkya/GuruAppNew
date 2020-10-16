import React, { Component } from 'react';
import { View, Text, Image, SafeAreaView, StatusBar } from 'react-native';
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
  mainContainer: {
    flex: 1,
    backgroundColor: color.white
  },

  mainScrollView: {
    backgroundColor: color.white,
    flex: 1,
  },

  // for category Bar
  categoryMainView: {
    height: hp(11),
    width: wp(100),
    backgroundColor: color.secondaryGray
  },
  categoryInnerView: {
    width: wp(20), justifyContent: 'center', alignItems: 'center'
  },
  catgeoryInnerSecondView: {
    position: 'absolute', justifyContent: 'center', alignSelf: 'center', alignItems: 'center', height: hp(10)
  },
  categoryIconView: {
    height: hp(6), marginTop: hp(2), backgroundColor: color.tertiaryGray, width: hp(6), justifyContent: 'center', borderRadius: hp(6) / 2, alignItems: 'center'
  },
  categoryImg: {
    height: hp(2.5), width: hp(2.5)
  },
  categoryText: {
    marginTop: hp(0.1), marginBottom: hp(1),
  },

  // for stories Bar
  mainStoriesContainer: {
    backgroundColor: color.white,
    height: hp(36),
    paddingHorizontal: wp(1.5)
  },
  storiesInnerView: {
    flexDirection: 'row', marginTop: hp(1), width: wp(100),

  },
  recentStoriesView: {
    width: wp(65),
    paddingHorizontal: wp(1.5)

  },
  watchAllView: {
    width: wp(35), paddingRight: wp(5), justifyContent: 'flex-end', alignItems: 'center', flexDirection: 'row'
  },
  watchTouchableView: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
  },
  watchAllImage: {
    height: hp(1.3), width: hp(1.3)
  },
  watchAllText: {
    marginLeft: wp(2)
  },
  storiesView: {
    height: hp(32), alignItems: 'center', marginBottom: hp(0.5), justifyContent: 'center', marginLeft: wp(2), marginRight: wp(2), borderRadius: wp(2), width: wp(35)
  },
  storiesImg: {
    height: hp(30), borderRadius: wp(2), width: wp(35),
    borderColor: color.lightGray, borderWidth: 0.5
  },
  profilePicView: {
    position: 'absolute', alignItems: 'center', height: hp(1)
  },
  profilePicInnerView: {
    position: 'absolute', height: hp(9), width: hp(9), borderRadius: hp(9) / 2, alignItems: 'center'
  },
  profileImg: {
    height: hp(9), borderRadius: hp(9) / 2, borderWidth: 3, borderColor: color.borderOrange, width: hp(9)
  },
  profileUserName: {
    marginTop: hp(0.8), width: wp(35), justifyContent: 'center', alignItems: 'center'
  },
  videoListMainConatiner: {
    flex: 1, backgroundColor: color.secondaryGray, marginTop: hp(1), marginBottom: hp(1)
  },
  videoListInnerConatiner: {
    flex: 1, flexDirection: 'row', alignItems: 'center'
  },
  videoProfileShape: {
    flex: 0.15, justifyContent: 'center', alignItems: 'center', marginTop: hp(0.9), marginBottom: hp(0.9)
  },
  videImageProfile: {
    height: hp(5), width: hp(5), borderRadius: hp(5) / 2, borderWidth: wp(0.5), borderColor: color.borderOrange, backgroundColor: color.white
  },
  createrNameView: {
    flex: 0.44
  },
  subscriptionView: {
    flex: 0.35, alignItems: 'center'
  },
  menuView: {
    flex: 0.06, alignItems: 'center'
  },
  menuImg: {
    height: hp(2), width: hp(2)
  },
  videoListMainView: {
    height: hp(20)
  },
  videoBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: wp(100)
  },
  timeMainView: {
    flex: 1,
    paddingBottom: 8, paddingRight: 8,
    justifyContent: 'flex-end', alignSelf: 'flex-end',
  },
  timeInnerView: {
    backgroundColor: 'black', paddingHorizontal: 5,
    borderRadius: 2
  },
  defaultValueTime: {
    fontSize: 12, fontWeight: 'bold', color: color.white
  },
  remainingTimeView: {
    backgroundColor: 'black', paddingHorizontal: 5,
    borderRadius: 2
  },
  remainingTimeText: {
    fontSize: 12, fontWeight: 'bold', color: 'white'
  },
  viewsView: {
    padding: hp(1.5)
  },
  mainView: {
    flex: 1, flexDirection: 'row', paddingLeft: hp(1.2), paddingBottom: hp(1), paddingRight: hp(2)
  },
  innerMainView: {
    flex: 0.15, justifyContent: 'center', alignItems: 'center'
  },
  iconSize: {
    height: hp(3), width: hp(3)
  },
  iconCountText: {
    marginTop: hp(0.8)
  },
  saveView: {
    flex: 0.40, alignItems: 'flex-end'
  },
  saveIconSize: {
    height: hp(3), width: hp(2)
  },
  activityIndicatorView: {
    position: 'absolute',
    height: hp(80),
    width: wp(100),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  }

};
