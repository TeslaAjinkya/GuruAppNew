import React, { Component } from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { urls } from '@api/urls';
import { connect } from 'react-redux';
import {
    View, Text, Dimensions,
    Image, Button, StyleSheet,
    ActivityIndicator, FlatList,
    SafeAreaView, Modal,
    Alert, TouchableOpacity,
} from 'react-native';
import { strings } from '@values/strings';
import _Text from '@text/_Text';
import { color } from '@values/colors';
import { Toast } from 'native-base';
import _CustomHeader from '@customHeader/_CustomHeader'

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit"


export default class VideoAnalytics extends Component {
    constructor(props) {
        super(props);

        const data = this.props.route.params.data
        const list = this.props.route.params.videoList

        this.state = {
            videoData: data,
            videoList: list
        };
    }

    navigate = (item, list) => {
        this.props.navigation.pop()
        this.props.navigation.push('VideoAnalytics', { data: item, videoList: list })
    }

    showUploadedVideos = (item, index) => {
        const { videoList } = this.state

        return (
            <TouchableOpacity
                onPress={() => this.navigate(item, videoList)}
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

    chartView = () => {
        return (
            <View style={{ alignItems: 'center' }}>
                <BarChart
                    data={{
                        labels: [
                            'January',
                            'February',
                            'March',
                            'April',
                            'May',
                            'June',

                        ],
                        datasets: [
                            {
                                data: [20, 45, 28, 80, 99, 43],
                            },
                        ],
                    }}
                    width={wp(95)}
                    height={220}
                    // showValuesOnTopOfBars={true}
                    // yAxisLabel={'views'}
                    chartConfig={{
                        backgroundColor: '#1cc910',
                        backgroundGradientFrom: '#eff3ff',
                        backgroundGradientTo: '#efefef',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 10,
                    }}
                />
            </View>
        )
    }

    countView = () => {
        const { videoData, videoList } = this.state

        return (
            <View style={{ height: hp(12), backgroundColor: color.primaryGray, flexDirection: 'row', justifyContent: 'space-around' }}>
                <View style={styles.parts}>
                    <_Text textColor={color.tertiaryGray} bold fsLarge numberOfLines={1}>
                        {videoData.views}
                    </_Text>
                    <_Text textColor={color.tertiaryGray} fsPrimary>
                        {strings.view}
                    </_Text>
                </View>

                <View style={styles.border} />

                <View style={styles.parts}>
                    <_Text textColor={color.tertiaryGray} bold fsLarge numberOfLines={1}>
                        {videoData.likeCount}
                    </_Text>
                    <_Text textColor={color.tertiaryGray} fsPrimary>
                        {strings.likes}
                    </_Text>
                </View>

                <View style={styles.border} />

                <View style={styles.parts}>
                    <_Text textColor={color.tertiaryGray} bold fsLarge numberOfLines={1}>
                        {videoData.sharesCount}
                    </_Text>
                    <_Text textColor={color.tertiaryGray} fsPrimary>
                        {strings.shares}
                    </_Text>
                </View>

                <View style={styles.border} />

                <View style={styles.parts}>
                    <_Text textColor={color.tertiaryGray} bold fsLarge numberOfLines={1}>
                        {videoData.giftCount}
                    </_Text>
                    <_Text textColor={color.tertiaryGray} fsPrimary>
                        {strings.gifts}
                    </_Text>
                </View>



            </View>

        )
    }
    render() {
        const { videoData, videoList } = this.state

        console.log("videoData", videoData);
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: color.white }}>
                <View style={{ flex: 2 }}>

                    <_CustomHeader
                        title={videoData.videoTitle.length > 25 ? videoData.videoTitle.slice(0, 25) + '...' : videoData.videoTitle}
                        onLeftButtonPress={() => this.props.navigation.goBack()}
                    />


                    {this.countView()}

                    {/* {this.chartView()} */}

                    <View style={{ justifyContent: 'center', width: wp(100), paddingTop: 10, flex: 1 }}>
                        <FlatList
                            data={videoList}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={item => item.videoid.toString()}
                            renderItem={({ item, index }) => (this.showUploadedVideos(item, index))}
                        />
                    </View>

                </View>
            </SafeAreaView>
        );
    }
}



const styles = StyleSheet.create({
    border: {
        borderLeftWidth: 0.5,
        height: hp(12),
        borderLeftColor: color.gray,
    },
    parts: {
        alignItems: 'center', justifyContent: 'center',
    }

})


