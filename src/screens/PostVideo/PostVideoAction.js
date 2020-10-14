import {
  POST_VIDEO_DATA,
  POST_VIDEO_DATA_SUCCESS,
  POST_VIDEO_DATA_ERROR,
  POST_VIDEO_DATA_RESET_REDUCER,
  GET_PROFILE_DATA_ERROR,
  GET_PROFILE_DATA_SUCCESS,
  GET_PROFILE_DATA
} from "@redux/types";
import { strings } from '@values/strings';
import _ from "lodash";
import axios from 'axios'
import { urls } from '../../api/urls'
const qs = require('querystring')

const header = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data',
  },
}

const configTwo = {
  headers: {
    'Content-Type': 'application/json'
  },
}

export function showLoadingIndicator(type) {
  return {
    type: type
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
    error
  };
}


export function postVideo(config) {
  console.log("config postVideo", config);

  return dispatch => {
    dispatch(showLoadingIndicator(POST_VIDEO_DATA));

    // const process = {
    //   onUploadProgress: function(progressEvent) {
    //     var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
    //     console.log(percentCompleted)
    //   }
    // }

    axios.post(urls.PostVideo.url, config, header)
      .then(response => {
        console.log("response.data postVideo", response);
        if (response.data.success) {
          dispatch(
            onSuccess(response.data, POST_VIDEO_DATA_SUCCESS)
          );
        }
        else {
          dispatch(
            onFailure(response.data, POST_VIDEO_DATA_ERROR)
          );
        }
      })
      .catch(function (error) {
        console.log("error---", error);
        dispatch(
          onFailure(strings.serverFailedMsg, POST_VIDEO_DATA_ERROR)
        );
      });
  }
}


export function getProfile(requestpayload) {
  return dispatch => {
    dispatch(showLoadingIndicator(GET_PROFILE_DATA));

    axios
      .post(urls.ViewProfile.url, requestpayload, configTwo)
      .then(response => {
        console.log("response", response.data);

        if (response.data.success) {
          dispatch(onSuccess(response.data, GET_PROFILE_DATA_SUCCESS));
        } else {
          dispatch(onFailure(response.data, GET_PROFILE_DATA_ERROR));
        }
      })
      .catch(function (error) {

        dispatch(onFailure(strings.serverFailedMsg, GET_PROFILE_DATA_ERROR));
      });
  };
}


export function resetAllReducer() {
  return {
    type: POST_VIDEO_DATA_RESET_REDUCER
  };
}