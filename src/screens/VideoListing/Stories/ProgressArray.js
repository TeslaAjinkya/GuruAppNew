import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet,Platform } from 'react-native';
import ProgressBar from '@stories/ProgressBar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ProgressArray = (props) => {
  const opacity = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (props.pause) {
      Animated.timing(opacity, {
        toValue: 0,
        timing: 300,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 1,
        timing: 300,
      }).start();
    }
  }, [props.pause]);

  return (
    <Animated.View style={[styles.progressBarArray, { opacity }]}>
      {props.length.map((j, k) => (
        <ProgressBar
          index={k}
          duration={props.duration || 3}
          isNewStory={props.isNewStory}
          currentIndex={props.currentIndex}
          next={props.next}
          length={props.stories.length}
          active={j === props.currentIndex ? 1 : (j < props.currentIndex ? 2 : 0)}
          isLoaded={props.isLoaded}
          pause={props.pause}
        />
      ))
  }
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  progressBarArray: {
    flexDirection: 'row',
    position: 'absolute',
    top: Platform.OS === 'ios' ? hp(4) : hp(1),
    width: '98%',
    height: hp(2),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default ProgressArray;
