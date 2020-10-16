import React, { Component, createRef } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Card } from 'native-base';
import { color } from '@values/colors';
import _Text from '@text/_Text';
import { urls } from '@api/urls';
import styles from '@cardContent/_CardContentStyle'
import { strings } from '@values/strings';
import FastImage from 'react-native-fast-image'
import ProgressiveImage from './ProgressiveImage'


class _CardContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }



  render() {
    const { onPressLike, item, onPressDislike, onPressDetails, onPressShare, onPressGift } = this.props;
    const { mainTouchableView, creatorView, imgProfile, creatorTextView, creatorDateView, menuImg,
      videoTitleView, menuView, videoThumbnailView, thumbnailImg, countDisplayMainView, innerView, innerView1, likeView,
      likeText, shareCountView, borderLine, likeGiftShareMainView, innerMainView, likeTouchable, likeDislikeImg } = styles
    var date = new Date(item.uploadedDate).toUTCString();

    const { isLoading } = this.state

    return (
      <View>
        <TouchableOpacity onPress={onPressDetails}>
          <View
            style={mainTouchableView}>
            <View style={creatorView}>
              <Image
                resizeMode={'cover'}
                style={imgProfile}
                // defaultSource={require('../../assets/img/defaultImage.png')}
                source={{
                  uri: item.createrLogo
                    ? urls.baseUrl + item.createrLogo
                    : null,
                }}
              />
            </View>
            <View style={creatorTextView}>
              <_Text fsHeading bold>
                {item.createrName.charAt(0).toUpperCase() +
                  item.createrName.slice(1)}
              </_Text>
              <View style={creatorDateView}>
                <_Text fsExtraSmall textColor={color.lightGray}>
                  {date.slice(0, 16)} •{' '}
                </_Text>
                <_Text fsExtraSmall textColor={color.lightGray}>
                  {item.views ? item.views : 0} {strings.view}
                </_Text>
              </View>
            </View>
            {/* <View style={{flex: 0.1, alignItems: 'flex-start'}}>
              <Image
                resizeMode={'cover'}
                style={{height: hp(2), width: hp(2)}}
                source={require('../../assets/img/gift.png')}
              />
            </View> */}
            <View style={menuView}>
              <Image
                resizeMode={'cover'}
                style={menuImg}
                source={require('../../assets/img/menu.png')}
              />
            </View>
          </View>
          <View
            style={videoTitleView}>
            <_Text textColor={color.videoTitle} fsPrimary>
              {item.videoTitle ? item.videoTitle : null}
            </_Text>
          </View>
          <View
            style={videoThumbnailView}>
            {/* {isLoading ?
              <Image
                resizeMode={'cover'}
                source={require('../../assets/img/default.png')}
                style={thumbnailImg}
              />
              : */}

            <FastImage
              style={thumbnailImg}
              source={{
                uri: item.videoThumbnail ? urls.baseUrl + item.videoThumbnail : null,
                priority: FastImage.priority.high,
              }}
            // resizeMode={FastImage.resizeMode.cover}
            />

            {/* <ProgressiveImage
              source={{ uri: item.videoThumbnail ? urls.baseUrl + item.videoThumbnail : null }}
              thumbnailSource={{ uri: item.videoThumbnail ? urls.baseUrl + item.videoThumbnail : null }}
              style={thumbnailImg}
              resizeMode="cover"
            /> */}


          </View>
        </TouchableOpacity>
        {/* Likes and shares count display */}
        <View
          style={countDisplayMainView}>
          <View style={innerView}>
            <View
              style={innerView1}>
              <Image
                resizeMode={'contain'}
                style={likeView}
                source={require('../../assets/img/blueLike.png')}
              />
              <_Text
                fsSmall
                textColor={color.lightGray}
                style={likeText}>
                {item.likeCount}
              </_Text>
            </View>
            <View
              style={shareCountView}>
              <_Text
                fsSmall
                textColor={color.lightGray}
                style={likeText}>
                {item.sharesCount ? item.sharesCount : 0}
              </_Text>
              <_Text
                fsSmall
                textColor={color.lightGray}
                style={likeText}>
                {strings.shares}
              </_Text>
            </View>
          </View>
        </View>

        {/* Line */}
        <View
          style={borderLine}
        />


        {/* like and diskike and share */}
        <View
          style={likeGiftShareMainView}>
          <View
            style={innerMainView}>
            <TouchableOpacity
              onPress={onPressLike}
              style={likeTouchable}>
              {item.operation == 0 || item.operation == 2 ? (
                <Image
                  resizeMode={'contain'}
                  style={likeDislikeImg}
                  source={require('../../assets/img/like.png')}
                />
              ) : (
                  <Image
                    resizeMode={'contain'}
                    style={likeDislikeImg}
                    source={require('../../assets/img/blueLike1.png')}
                  />
                )}
              <_Text
                numberOfLines={1}
                fsSmall
                textColor={item.operation == 0 || item.operation == 2 ? color.lightGray : color.likeBlueColor}
                style={likeText}>
                {strings.like}
              </_Text>
            </TouchableOpacity>
          </View>

          <View
            style={innerMainView}>
            {/* <TouchableOpacity
              onPress={onPressDislike}
              style={{
                flex: 0.35,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {item.operation == 0 || item.operation == 1 ? (
                <Image
                  resizeMode={'contain'}
                  style={{width: wp(4), height: hp(4)}}
                  source={require('../../assets/img/dislike.png')}
                />
              ) : (
                <Image
                  resizeMode={'contain'}
                  style={{width: wp(4), height: hp(4)}}
                  source={require('../../assets/img/blueDislike.png')}
                />
              )}

              <_Text
                numberOfLines={1}
                fsSmall
                textColor={color.lightGray}
                style={{paddingLeft: wp(1)}}>
                Dislike
              </_Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={onPressGift}
              style={innerMainView}>
              <Image
                resizeMode={'contain'}
                style={likeDislikeImg}
                source={require('../../assets/img/gift.png')}
              />

              <_Text
                numberOfLines={1}
                fsSmall
                textColor={color.lightGray}
                style={likeText}>
                {strings.gift}
              </_Text>
            </TouchableOpacity>

          </View>
          <View
            style={innerMainView}>
            <TouchableOpacity
              onPress={onPressShare}
              style={innerMainView}>
              <Image
                resizeMode={'contain'}
                style={likeDislikeImg}
                source={require('../../assets/img/share.png')}
              />
              <_Text
                numberOfLines={1}
                fsSmall
                textColor={color.lightGray}
                style={likeText}>
                {strings.share}
              </_Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default _CardContent;
