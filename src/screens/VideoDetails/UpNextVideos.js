//import liraries
import React, { Component } from 'react';
import {Card} from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { View, Image, TouchableOpacity, FlatList,ActivityIndicator } from 'react-native';
import { capitalizeFirstLetter } from '@values/validate'
import _Text from '@text/_Text'
import { color } from '@values/colors';
import { strings } from '@values/strings';
import { urls } from '@api/urls'
import VideoDetailsStyle from '@videoDetails/VideoDetailsStyle'

var dt1, dt2 = ""
class UpNextVideos extends Component {
    goToDetailsScreen = (item) => {
        setTimeout(() => {
        this.props.navigation.navigate('VideoDetails', { videoData: item })
        }, 200)
    }

     diff_hours(dt2, dt1) 
    {
        var diff =(dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60);
        return Math.abs(Math.round(diff));
    }

    getView(item) {
        const {upNextContainer,innerView,imgView,imgStyle,videoTitleView,agoViewsView,agoText,viewText}= VideoDetailsStyle
        dt1 = new Date(item.uploadedDate);
        dt2 = new Date();
        var totalHours = this.diff_hours(dt1, dt2)
        return(
            <TouchableOpacity style={upNextContainer}  onPress={() => this.goToDetailsScreen(item)}>
              <Card style={{width:wp(53),borderRadius:6}}>
              <Image  source={{ uri: item.videoThumbnail? urls.baseUrl + item.videoThumbnail : null}}
                                defaultSource={require('../../assets/img/noImage.png')}
                                style={imgStyle}
                                resizeMode='stretch' />
                <View>
                <_Text numberOfLines={1} textColor={color.tertiaryGray} fsSmall style={{paddingTop:wp(2), paddingLeft:wp(2), paddingRight:wp(2)}}  textColor={color.tertiaryGray} >{item.videoTitle}</_Text>
                </View>
                <View style={{flexDirection:'row', paddingBottom:hp(0.5)}}>
                    <_Text fsSmall textColor={color.lightGray} style={{paddingLeft:wp(2)}}>{item.views ? item.views : 0} Views • </_Text>
                    <_Text fsSmall textColor={color.lightGray}>Sports</_Text>
                </View>
              </Card>
            </TouchableOpacity>

        )
    }


    render() {
        const { item,isFetching } = this.props
       
        const {upNextStyle} = VideoDetailsStyle
         return (
            <View style={upNextStyle}>
                <FlatList
                horizontal={true}
                data={item}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={this.FlatListItemSeparator}
                renderItem={({ item, index }) =>
                  this.getView(item)
                }
                keyExtractor={(item, index) => item.id}
              />
            {isFetching  ? (
                      <View
                        style={{
                          position: 'absolute',
                          width:wp(100),
                            height:hp(30),
                          backgroundColor: 'transparent',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <ActivityIndicator size="large" color={color.tertiaryGray} />
                      </View>
                    ) : null}
            </View>
        );
    }
}


//make this component available to the app
export default UpNextVideos;
