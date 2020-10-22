import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import VideoListing from '@videoListing/VideoListing';
import VideoDetails from '@videoDetails/VideoDetails';
import HomePage from '@videoListing/HomePage';
import Register from '@register/Register';
import Login from '@login/Login';
import OtpScreen from '@register/OtpScreen';
import UserDetails from '@register/UserDetails';
import Trending from '@trending/Trending';
import Post from '@post/Post';
import PostDetails from '@post/PostDetails';
import ProfileNew from '@profile/ProfileNew';
import SubscribeChannel from '@subscribeChannel/SubscribeChannel';
import MobileScreen from '@login/MobileScreen';
import ViewBalance from '@viewBalance/ViewBalance'
import ManageAccount from '@manageAccount/ManageAccount'
import SendPayment from '@sendPayment/SendPayment'
import SendGifts from '@sendPayment/SendGifts'
import Gift from '@sendPayment/Gift'
import AsyncStorage from '@react-native-community/async-storage';
import Transactions from '@transactions/Transactions';
import GiftSuccess from '@videoDetails/GiftSuccess';
import EditProfile from '@profile/EditProfile';
import MobileScreenValidate from '@registerTabs/MobileScreen';
import EmailScreen from '@registerTabs/EmailScreen';
import ForgotPassword from '@forgotPassword/ForgotPassword';
import ResetPassword from '@forgotPassword/ResetPassword';
import YourStory from '@yourStory/YourStory'
import ImageStory from '@yourStory/ImageStory'
import VideoStory from '@yourStory/VideoStory'
import CameraStory from '@yourStory/CameraStory'
import ChangePassword from '@changePassword/ChangePassword'
import Notification from '@notification/Notification'
import VideoAnalytics from '@profile/VideoAnalytics'



const Stack = createStackNavigator();

class Scene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginValue: '',
    };
  }

  componentDidMount() {
    this.getItem();
  }

  async getItem() {
    let value = await AsyncStorage.getItem('userId');

    if (value) {
      let parsed = JSON.parse(value);
      if (parsed) {
        global.userId = parsed;
        this.setState({ isLoginValue: true });
      } else {
        this.setState({ isLoginValue: false });
      }
    } else {
      this.setState({ isLoginValue: false });
    }
  }

  getLoginScene() {
    return (
      <Stack.Navigator initialRouteName={Login}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomePage"
          component={HomePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MobileScreen"
          component={MobileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen name="HomePage" component={HomePage} options={{ headerShown: false }} /> */}

        <Stack.Screen
          name="OtpScreen"
          component={OtpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Post"
          component={Post}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileNew"
          component={ProfileNew}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PostDetails"
          component={PostDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SubscribeChannel"
          component={SubscribeChannel}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Trending"
          component={Trending}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserDetails"
          component={UserDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VideoListing"
          component={VideoListing}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VideoDetails"
          component={VideoDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ViewBalance"
          component={ViewBalance}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ManageAccount"
          component={ManageAccount}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SendPayment"
          component={SendPayment}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SendGifts"
          component={SendGifts}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Gift"
          component={Gift}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Transactions"
          component={Transactions}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GiftSuccess"
          component={GiftSuccess}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MobileScreenValidate"
          component={MobileScreenValidate}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EmailScreen"
          component={EmailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="ForgotPassword"
          component={ForgotPassword} options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword} options={{ headerShown: false }}
        />
        <Stack.Screen name="YourStory"
          component={YourStory} options={{ headerShown: false }}
        />
        <Stack.Screen name="ImageStory"
          component={ImageStory} options={{ headerShown: false }}
        />
        <Stack.Screen name="VideoStory"
          component={VideoStory} options={{ headerShown: false }}
        />
        <Stack.Screen name="CameraStory"
          component={CameraStory} options={{ headerShown: false }}
        />
        <Stack.Screen name="ChangePassword"
          component={ChangePassword} options={{ headerShown: false }}
        />
        <Stack.Screen name="Notification"
          component={Notification} options={{ headerShown: false }}
        />
        <Stack.Screen name="VideoAnalytics"
          component={VideoAnalytics} options={{ headerShown: false }}
        />



      </Stack.Navigator>
    );
  }

  getHomeScene() {
    return (
      <Stack.Navigator initialRouteName={HomePage}>
        <Stack.Screen
          name="HomePage"
          component={HomePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="MobileScreen"
          component={MobileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="OtpScreen"
          component={OtpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Post"
          component={Post}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileNew"
          component={ProfileNew}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PostDetails"
          component={PostDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SubscribeChannel"
          component={SubscribeChannel}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Trending"
          component={Trending}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserDetails"
          component={UserDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VideoListing"
          component={VideoListing}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VideoDetails"
          component={VideoDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ViewBalance"
          component={ViewBalance}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ManageAccount"
          component={ManageAccount}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SendPayment"
          component={SendPayment}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SendGifts"
          component={SendGifts}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Gift"
          component={Gift}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Transactions"
          component={Transactions}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GiftSuccess"
          component={GiftSuccess}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MobileScreenValidate"
          component={MobileScreenValidate}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EmailScreen"
          component={EmailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="ForgotPassword"
          component={ForgotPassword} options={{ headerShown: false }} />

        <Stack.Screen name="ResetPassword"
          component={ResetPassword} options={{ headerShown: false }}
        />
        <Stack.Screen name="YourStory"
          component={YourStory} options={{ headerShown: false }}
        />
        <Stack.Screen name="ImageStory"
          component={ImageStory} options={{ headerShown: false }}
        />
        <Stack.Screen name="VideoStory"
          component={VideoStory} options={{ headerShown: false }}
        />
        <Stack.Screen name="CameraStory"
          component={CameraStory} options={{ headerShown: false }}
        />
        <Stack.Screen name="ChangePassword"
          component={ChangePassword} options={{ headerShown: false }}
        />
        <Stack.Screen name="Notification"
          component={Notification} options={{ headerShown: false }}
        />
        <Stack.Screen name="VideoAnalytics"
          component={VideoAnalytics} options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  render() {
    const { isLoginValue } = this.state;
    return (
      <NavigationContainer>
        {isLoginValue !== ''
          ? isLoginValue == true
            ? this.getHomeScene()
            : this.getLoginScene()
          : null}
      </NavigationContainer>
    );
  }
}

export default Scene;
