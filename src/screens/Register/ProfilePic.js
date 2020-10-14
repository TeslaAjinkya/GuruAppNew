import React, { Component } from 'react';
import { View, Image, Text, SafeAreaView ,TouchableOpacity} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import _InputBox from '@inputBox/_InputBox'
import _Container from '@container/_Container'
import { Container, Toast } from 'native-base'
import ImagePicker from 'react-native-image-picker';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { color } from '@values/colors';
import _Text from '@text/_Text'
import { strings } from '@values/strings';
const options = {
    title: 'Upload Picture',
    customButtons: [{ name: 'profile', title: 'Choose Photo from Gallery' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
class profilePic extends Component{
    constructor(props)
    {
        super(props)
        this.state={
            profilePhoto:"",
            false:false
        }
        this.uploadPic = this.uploadPic.bind(this)
    }
    
  uploadPic = () => {

    ImagePicker.showImagePicker(options, (response) => {

      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {

        const source = { uri: response.uri };
        this.setState({
          profilePhoto: source,
          flag: true
        });
      }
    });

  
  }

    render(){
        
        const {flag,profilePhoto} = this.state
        return(
            <View style={{alignItems:'center',flex:1, width:wp(100), backgroundColor:color.white}}>
                <View style={{ flex:0.2, justifyContent:'flex-end'}}>
                    <_Text style={{textAlign:'center', width:wp(90)}} fsExtraLarge>Add a profile picture so that user can find you</_Text>
                </View>
                <View style={{flex:0.6}}>
                <View style={{width:wp(50), height:hp(20), borderWidth:0.3, borderColor:'#000', marginTop:hp(5)}}>
               {
                   flag == true ?   <Image
                   resizeMode={"contain"}
                   style={{ width:wp(50), height:hp(20)}}
                   source={{ uri: profilePhoto.uri}}
                 /> : <Image resizeMode={"contain"} style={{width:wp(50), height:hp(20)}}  source={require('../../assets/img/profilePic.png')} />
               }
                
                </View>
                </View>
                <View style={{  flex:0.2, justifyContent:'center'}}>
                <TouchableOpacity onPress={this.uploadPic} style={{ width: wp(90), height: hp(6), alignItems: 'center', justifyContent: 'center', borderRadius:3, backgroundColor: color.loginColor }}>
                    <_Text fsSmall  textColor={color.white}>Take Photo</_Text>
                </TouchableOpacity>
                 </View>
            </View>
        )
    }
}


export default profilePic