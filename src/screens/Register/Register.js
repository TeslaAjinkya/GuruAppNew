import React, { Component } from 'react';
import { View, Image, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import _InputBox from '@inputBox/_InputBox'
import _Container from '@container/_Container'
import { Container, Toast } from 'native-base'
import { strings } from '@values/strings'

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
        labelStyle: { fontSize: hp(1.7), marginTop: hp(10), padding: 0, color: color.lightGray },
        indicatorStyle: { backgroundColor: color.black },
      }}>
      <Tab.Screen name="Mobile No."
        options={{ tabBarLabel: 'Mobile Number', }}
        component={MobileScreen} />

      <Tab.Screen name="Email id" component={EmailScreen} />

    </Tab.Navigator>

  );
}

export default class Register extends Component {

  render() {

    const height = hp(18)
    const width = wp(100) + 40
    const profileTop = height - hp(5)

    return (
      <SafeAreaView style={{ height: hp(100), backgroundColor: color.white }}>

        <Container >
          <View style={{
            backgroundColor: color.disabledLoginColor,
            height: height,
            left: -20,
            width: width,
            borderBottomLeftRadius: (height + width) / 2,
            borderBottomRightRadius: (height + width) / 2
          }}>
            <View style={{ height: hp(20), justifyContent: 'center', alignItems: 'center' }}>
              <_Text fsLogoName bold textColor={color.black}>{strings.appName}</_Text>
            </View>
          </View>

          <MyTabs />
        </Container>
      </SafeAreaView>
    );
  }
}