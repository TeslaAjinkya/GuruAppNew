/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import Image from 'react-native-scalable-image';
import PropTypes from 'prop-types';
import { urls } from '@api/urls'
import { color } from '@values/colors';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Story = (props) => {
  const { story } = props;
  const { url, type } = story || {};


  return (
    <View style={styles.container}>
      {/* {!props.isLoaded && (
      <View style={styles.loading}>
        <ActivityIndicator color="white" />
      </View>
      )} */}

      {type === 'image' ? (
        <Image
          // source={{ uri: urls.baseUrl + url }}
          // source={require('../../../assets/img/best.jpg')}
          source={{ uri: url }}
          onLoadEnd={props.onImageLoaded}
          style={styles.content}
          resizeMode="stretch"
          width={width}
        />
      )
        : (
          <Video
            // source={{ uri: urls.baseUrl + url }}
            source={require('../../../assets/video/demo.mp4')}
            paused={props.pause || props.isNewStory}
            onLoad={item => props.onVideoLoaded(item)}
            //style={styles.content}
            resizeMode={"cover"}
            style={{
              aspectRatio: 1,
              width: "100%"
            }}
          />
        )}
    </View>
  );
};

Story.propTypes = {
  story: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: color.primaryGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: width,
    height: height,
    flex: 1,
  },
  imageContent: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  loading: {
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

});

export default Story;
