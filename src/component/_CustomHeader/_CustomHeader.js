import React, { Component } from 'react'

import {
    View, Image, TouchableOpacity
} from 'react-native';
import _Text from '@text/_Text'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { color } from '@values/colors';


export default class _CustomHeader extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }


    render() {
        const { backgroundColor, title } = this.props

        return (
            <View >
                <View style={{ height: hp(6), backgroundColor: backgroundColor ? backgroundColor : color.white }}>
                    <View
                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.props.onLeftButtonPress()}
                            style={{
                                flex: 0.1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Image
                                defaultSource={require('../../assets/img/left.png')}
                                source={require('../../assets/img/left.png')}
                                style={{ height: hp(2.5), width: hp(2.5) }}
                            />
                        </TouchableOpacity>
                        <View style={{ flex: 0.8, alignItems: 'center' }}>
                            <_Text fsHeading bold textColor={color.tertiaryGray}>
                                {title ? title : ''}
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

            </View>
        )
    }

}

