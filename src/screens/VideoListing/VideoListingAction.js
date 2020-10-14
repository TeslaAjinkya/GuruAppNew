import {
  VIDEO_CATEGORY_LISTING_DATA,
  VIDEO_CATEGORY_LISTING_DATA_SUCCESS,
  VIDEO_CATEGORY_LISTING_DATA_ERROR,
  VIDEO_CATEGORY_LISTING_RESET_REDUCER,
  VIDEO_STORIES_LISTING_DATA,
  VIDEO_STORIES_LISTING_DATA_SUCCESS,
  VIDEO_STORIES_LISTING_DATA_ERROR,
  VIDEO_STORIES_LISTING_RESET_REDUCER,
  VIDEO_LISTING_DATA,
  VIDEO_LISTING_DATA_SUCCESS,
  VIDEO_LISTING_DATA_ERROR,
  VIDEO_LISTING_DATA_RESET_REDUCER,
  LIKE_DISLIKE_DATA,
  LIKE_DISLIKE_DATA_SUCCESS,
  LIKE_DISLIKE_DATA_ERROR,
  LIKE_DISLIKE_DATA_RESET_REDUCER,
  SHARE_DATA,
  SHARE_DATA_SUCCESS,
  SHARE_DATA_ERROR,
  SHARE_DATA_RESET_REDUCER,
} from '@redux/types';

import { strings } from '@values/strings';

import _ from 'lodash';

import axios from 'axios';
import { urls } from '../../api/urls';
import { Toast } from 'native-base';
const qs = require('querystring');



const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

const configTwo = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export function showLoadingIndicator() {
  return {
    type: VIDEO_CATEGORY_LISTING_DATA,
  };
}

export function onSuccess(data, type) {
  return {
    data,
    type: type,
  };
}

export function onFailure(error, type) {
  return {
    type: type,
    error,
  };
}

export function getShareCount(payload) {

  return dispatch => {
    axios
      .post(urls.Share.url, payload, configTwo)
      .then(response => {
        console.log('response share', response.data);

        if (response.data.success) {
          dispatch(onSuccess(response.data, SHARE_DATA_SUCCESS));
        } else {
          dispatch(onFailure(response.data, SHARE_DATA_ERROR));
        }
      })
      .catch(function (error) {
        dispatch(onFailure(error, SHARE_DATA_ERROR));
      });
  };
}

export function getLikeDislikeCount(payload) {
  console.log("getLikeDislikeCount", payload);

  return dispatch => {
    axios
      .post(urls.LikeDisLike.url, payload, configTwo)
      .then(response => {
        if (response.data.success) {
          console.log("getLikeDislikeCount", response.data);
          if (response.data.success) {
            dispatch(onSuccess(response.data, LIKE_DISLIKE_DATA_SUCCESS));
          }
        } else {
          dispatch(onFailure(response.data, LIKE_DISLIKE_DATA_ERROR));
        }
      })
      .catch(function (error) {
        dispatch(onFailure(strings.serverFailedMsg, LIKE_DISLIKE_DATA_ERROR));
      });
  };
}

export function getCategory() {
  return dispatch => {
    dispatch(showLoadingIndicator());
    axios
      .get(urls.Category.url)
      .then(response => {

        if (
          response.data.success == true &&
          response.data.category.length !== 0
        ) {
          dispatch(
            onSuccess(
              response.data.category,
              VIDEO_CATEGORY_LISTING_DATA_SUCCESS,
            ),
          );
          dispatch(getStories());
        } else {
          dispatch(onFailure(response.data, VIDEO_CATEGORY_LISTING_DATA_ERROR));
          dispatch(getStories());
        }
      })
      .catch(function (error) {
        dispatch(
          onFailure(strings.serverFailedMsg, VIDEO_CATEGORY_LISTING_DATA_ERROR),
        );
        dispatch(getStories());
      });
  };
}

export function getStories() {
  return dispatch => {
    axios
      .get(urls.Stories.url)
      .then(response => {
        console.log("response story", response.data);
        if (
          response.data.success == true &&
          (response.data.stories !== [] && response.data.stories !== undefined)
        ) {

          dispatch(
            onSuccess(
              response.data.stories,
              VIDEO_STORIES_LISTING_DATA_SUCCESS,
            ),
          );
          // dispatch(getVideoList(videoListPayload));
        } else {

          dispatch(onFailure(response.data, VIDEO_STORIES_LISTING_DATA_ERROR));
          // dispatch(getVideoList(videoListPayload));
        }
      })
      .catch(function (error) {

        dispatch(
          onFailure(strings.serverFailedMsg, VIDEO_STORIES_LISTING_DATA_ERROR),
        );
        // dispatch(getVideoList(videoListPayload));
      });
  };
}

export function getVideoList(videoListPayload) {

  return dispatch => {
    axios
      .post(urls.VideoListing.url, videoListPayload, configTwo)
      .then(response => {
        console.log("response list", response.data);

        if (
          response.data.success == true &&
          (response.data.videoData !== [] && response.data.videoData !== undefined)
        ) {
          dispatch(
            onSuccess(response.data.videoData, VIDEO_LISTING_DATA_SUCCESS),
          );
        } else if (
          response.data.success == true && response.data.msg !== ""
        ) {
          dispatch(
            onSuccess([], VIDEO_LISTING_DATA_SUCCESS),
          );
        } else {
          dispatch(onFailure(response.data, VIDEO_LISTING_DATA_ERROR));
        }
      })
      .catch(function (error) {
        dispatch(onFailure(strings.serverFailedMsg, VIDEO_LISTING_DATA_ERROR));
      });
  };
}

export function resetAllReducer() {
  return {
    type: VIDEO_LISTING_DATA_RESET_REDUCER,
  };
}
