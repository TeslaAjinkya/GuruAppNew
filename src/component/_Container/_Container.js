import React, { Component } from 'react';
import { ActivityIndicator, View } from 'react-native'
import { Container } from 'native-base';
import containerStyle from '@container/_ContainerStyle'
import _Header from '@header/_Header'
import { NavigationContainer } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import _Tabs from '@tabs/_Tabs'
class _Container extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {  children , showHeader, showBack } = this.props
        const { mainContainer } = containerStyle
    
        return (
            <Container style={mainContainer} >
               
                {
                    showHeader &&  <_Header showBack={showBack}></_Header> 
                }
                 {children}
            </Container>
        )
    }
}

export default _Container