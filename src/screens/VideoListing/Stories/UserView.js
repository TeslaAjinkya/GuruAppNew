/* eslint-disable */
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { color } from '@values/colors';
import { urls } from '@api/urls'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Animatable from 'react-native-animatable';


class UserView extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      props,
    } = this;


    return (
      <View style={styles.userView}>
        <Animatable.Image
          animation="zoomIn"
          source={{ uri: urls.baseUrl + props.profile }}
          style={styles.image}
          source={require('../../../assets/img/defaultImage.png')}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{props.name.charAt(0).toUpperCase() + props.name.slice(1)}</Text>
          <Text style={styles.time}>Posted 2h ago</Text>
        </View>
        <TouchableOpacity onPress={props.onClosePress}>
          <Image source={require('../../../assets/img/close2.png')}
            style={{ height: 30, width: 30, marginRight: 20 }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginLeft: 8,
    borderColor: color.borderOrange,
    borderWidth: 1,
  },
  userView: {
    flexDirection: 'row',
    position: 'absolute',
    top: Platform.OS === 'ios' ? hp(7) : hp(4),
    width: '98%',
    alignItems: 'center',
    // backgroundColor: '#D7D7D7'
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: color.borderOrange,
    // color: "#DDDDDD",

  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: Platform.OS === 'ios' ? 8 : 4,
    marginLeft: 10,
    color: 'black',
  },
});

export default UserView;
