import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import _Text from '@text/_Text'
import { color } from '@values/colors';

export default {
  mainContainer: {
    flex: 1,
    backgroundColor: color.white
  },

  mainScrollView: {
    backgroundColor: color.white,
    flex: 1
  },

  channelMainView: {
    height: hp(11),
    width: wp(100),paddingHorizontal:10,
  },
  channelInnerView: {
    width: wp(18), justifyContent: 'center', alignItems: 'center', 
  },
  
  channelImageView: {
   marginTop: hp(2.5), borderColor: color.borderOrange, justifyContent: 'center', alignItems: 'center',height: hp(7), width: hp(7), borderRadius:hp(7)/2,borderWidth: 3
  },
  channelImage: {
    height: hp(7), width: hp(7), borderRadius:hp(7)/2, borderWidth: 3, borderColor: color.borderOrange,
  },
  channelText: {
    marginTop: hp(0.2), marginBottom: hp(1), justifyContent: 'center', alignItems: 'center'
  },

  



  videoListMainConatiner: {
    flex: 1, backgroundColor: color.secondaryGray, marginTop: hp(1), marginBottom: hp(1)
  },
  videoListInnerConatiner: {
    flex: 1, flexDirection: 'row', alignItems: 'center'
  },
  videoProfileShape: {
    flex: 0.15, justifyContent: 'center', alignItems: 'center', marginTop: hp(0.9), marginBottom: hp(0.9)
  },
  videImageProfile: {
    height: hp(5), width: hp(5), borderRadius: hp(5) / 2, borderWidth: wp(0.5), borderColor: color.borderOrange, backgroundColor: color.white
  },
  createrNameView: {
    flex: 0.44
  },
  subscriptionView: {
    flex: 0.35, alignItems: 'center'
  },
  menuView: {
    flex: 0.06, alignItems: 'center'
  },
  menuImg: {
    height: hp(2), width: hp(2)
  },
  videoListMainView: {
    height: hp(20)
  },
  videoBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: wp(100)
  },
  timeMainView: {
    flex: 1,
    paddingBottom: 8, paddingRight: 8,
    justifyContent: 'flex-end', alignSelf: 'flex-end',
  },
  timeInnerView: {
    backgroundColor: 'black', paddingHorizontal: 5,
    borderRadius: 2
  },
  defaultValueTime: {
    fontSize: 12, fontWeight: 'bold', color: color.white
  },
  remainingTimeView: {
    backgroundColor: 'black', paddingHorizontal: 5,
    borderRadius: 2
  },
  remainingTimeText: {
    fontSize: 12, fontWeight: 'bold', color: 'white'
  },
  viewsView: {
    padding: hp(1.5)
  },
  mainView: {
    flex: 1, flexDirection: 'row', paddingLeft: hp(1.2), paddingBottom: hp(1), paddingRight: hp(2)
  },
  innerMainView: {
    flex: 0.15, justifyContent: 'center', alignItems: 'center'
  },
  iconSize: {
    height: hp(3), width: hp(3)
  },
  iconCountText: {
    marginTop: hp(0.8)
  },
  saveView: {
    flex: 0.40, alignItems: 'flex-end'
  },
  saveIconSize: {
    height: hp(3), width: hp(2)
  }

};
