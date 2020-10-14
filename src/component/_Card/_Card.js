import React, {Component, createRef} from 'react';
import { View } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Card} from 'native-base';
import {color} from '@values/colors';

class _Card extends Component {
  render() {
    const {style, children: propChildren, propWidth,borderRadius,backgroundColor} = this.props;
    
    return (
      <View style={{alignItems:'center'}}>
        <Card
          style={[
            style,
            {
              backgroundColor: backgroundColor ? backgroundColor : color.white,
              width: propWidth ? propWidth :wp(99),
              borderRadius: borderRadius ? borderRadius : 0
            },
          ]}>
          {propChildren}
        </Card>
      </View>
    );
  }
}

export default _Card;
