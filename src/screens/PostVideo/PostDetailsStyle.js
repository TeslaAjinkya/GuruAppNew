import { View, Text, Image, SafeAreaView, Dimensions, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { color } from '@values/colors';

const { width, height } = Dimensions.get('window')

export default {
    btnView:{
        marginTop: hp(5), alignItems: 'center'
    },
    nextBtn:{
        width: wp(90), borderRadius: 3, height: hp(7), alignItems: 'center', justifyContent: 'center',
    },
   
};