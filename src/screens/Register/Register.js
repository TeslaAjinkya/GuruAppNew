import React, { Component } from 'react';
import { View, Image, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import _InputBox from '@inputBox/_InputBox'
import _Container from '@container/_Container'
import { Container, Toast } from 'native-base'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { color } from '@values/colors';
import _Text from '@text/_Text'
import MobileScreen from './RegisterTabs/MobileScreen'
import EmailScreen from './RegisterTabs/EmailScreen'



const Tab = createMaterialTopTabNavigator();


function MyTabs() {
  return (
    <Tab.Navigator
     tabBarOptions={{
      labelStyle: { fontSize: hp(1.7), margin: 0, padding: 0, color: color.lightGray },
      indicatorStyle: { backgroundColor: color.black },

    }}>
      <Tab.Screen name="Mobile No."
        options={{
          tabBarLabel: 'Mobile Number',

        }}
        component={MobileScreen} />
      <Tab.Screen name="Email id" component={EmailScreen} />
    </Tab.Navigator>

  );
}

export default class Register extends Component {

  render() {
    return (
      <SafeAreaView style={{ height: hp(100) }}>
        <Container >
          <View style={{ height: hp(30), marginTop: hp(5), justifyContent: 'center', alignItems: 'center' }}>
            <Image
              resizeMode={"contain"}
              style={{ width: wp(30), height: hp(20), justifyContent: 'center', alignSelf: 'center' }}
              source={require('../../assets/img/logo.png')}
            />
          </View>
          <MyTabs />
        </Container>
      </SafeAreaView>
    );
  }
}