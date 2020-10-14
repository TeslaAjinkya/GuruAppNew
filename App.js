import 'react-native-gesture-handler';
import * as React from 'react';
import Scene from './src/navigation/Scene'
import { Root } from 'native-base';
import { StatusBar, View } from 'react-native'
import { Provider } from "react-redux";
import configureStore from "@redux/store";

const store = configureStore();

class App extends React.Component {

  componentDidMount = () => {
    console.disableYellowBox = true;
  }

  render() {
    return (
      <View style={{ flex: 1, }}>
        <Root>
          <Provider store={store}>
            <Scene />
          </Provider>
        </Root>

      </View>
    );
  }
}

export default App;




//SHA1: D9:DB:67:A1:B0:EF:E5:B0:5E:ED:BE:9D:7F:E5:E9:5D:B7:7B:BB:BA
//SHA-256: 59:5E:CD:5F:8B:F7:85:D6:41:04:77:A1:F0:6F:35:82:4B:A4:93:F7:B3:A2:95:75:B5:1A:93:F6:AE:2E:85:EA

// RELEASE KEY HASH FOR FACEBOOK
//keytool -exportcert -alias guruApp -keystore android/app | openssl sha1 -binary | openssl base64

//O/P ==> W8clealZZN9pyst5WgE5mBHz4fw=

// APP KEYSTORE
// keytool -genkey -v -keystore my-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
// const socket = io('http://13.233.165.115:8000/');
   // console.log("socket", socket.io);
    // const socket = io('http://13.233.165.115:8000/', {      
    //   transports: ['websocket'], jsonp: false });   
    //   socket.connect(); 
    //   socket.on('connect', () => { 
    //     console.log('connected to socket server'); 
    //   });