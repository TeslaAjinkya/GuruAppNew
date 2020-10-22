import React, { Component } from 'react';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
    View, Text,
    Image, Button,
    ActivityIndicator,
    FlatList, SafeAreaView,
    Alert, TouchableOpacity,
} from 'react-native';
import { color } from '@values/colors';
import { strings } from '@values/strings';
import _Text from '@text/_Text';
import Modal from 'react-native-modal';


export default class ImageStory extends Component {
    constructor(props) {
        super(props);
        const imageData = this.props.route.params.imageData;
        const image = this.props.route.params.image;

        this.state = {
            image: image,
            emoji: '',
            isEmojiModalOpen: false
        };
    }


    selectedEmoji = (e) => {
        this.setState({
            emoji: e,
            isEmojiModalOpen: false
        })
        console.log("e", e);
    }

    openEmojiModal = () => {
        this.setState({
            isEmojiModalOpen: true
        })
    }

    closeEmojiModal = () => {
        this.setState({
            isEmojiModalOpen: false
        })
    }

    // emojiModal = () => {

    //     return (
    //         <View>
    //             <Modal
    //                 style={{
    //                     justifyContent: 'flex-end',
    //                     marginBottom: 0,
    //                     marginLeft: 0,
    //                     marginRight: 0,
    //                 }}
    //                 isVisible={this.state.isEmojiModalOpen}
    //                 onRequestClose={this.closeEmojiModal}
    //                 onBackdropPress={() => this.closeEmojiModal()}>
    //                 <SafeAreaView>
    //                     <View
    //                         style={{
    //                             backgroundColor: 'white',
    //                             alignItems: 'center',
    //                             justifyContent: 'center',
    //                             height: hp(60),
    //                             borderTopLeftRadius:30,borderTopRightRadius:30
    //                         }}>
    //                         <EmojiSelector
    //                             showTabs={false}
    //                             columns={5}
    //                             showSearchBar={false}
    //                             category={Categories.emotion}
    //                             onEmojiSelected={emoji => this.selectedEmoji(emoji)} />
    //                     </View>
    //                 </SafeAreaView>
    //             </Modal>
    //         </View>
    //     );
    // };


    render() {
        const { image } = this.state

        return (
            <SafeAreaView style={{ height: hp(100), backgroundColor: '#DDDDDD' }}>

                <View style={{ height: hp(6), backgroundColor: '#DDDDDD' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                            style={{
                                top: hp(1), flex: 0.1, paddingLeft: hp(3),
                            }}>
                            <Image
                                defaultSource={require('../../../assets/img/close1.png')}
                                source={require('../../../assets/img/close1.png')}
                                style={{ height: hp(2.5), width: hp(2.5) }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: hp(80), top: hp(0.5), justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        style={{ height: hp(75), width: wp(100), resizeMode: 'cover' }}
                        source={image}
                        defaultSource={require('../../../assets/img/default.png')}
                    />
                </View>

                <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                    <TouchableOpacity>
                        <View style={{
                            top: hp(2),
                            height: hp(6), width: hp(12), borderRadius: 25,
                            backgroundColor: color.white, borderWidth: 0.5, borderColor: color.textNote,
                            alignItems: "center", justifyContent: 'center',
                            marginRight: hp(3)
                        }}>
                            <_Text fsHeading fwHeading>Post</_Text>
                        </View>
                    </TouchableOpacity>
                </View>


            </SafeAreaView>
        );
    }
}
