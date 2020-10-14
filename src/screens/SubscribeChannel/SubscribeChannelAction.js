import {
  SUBSCRIBED_LIST_DATA,
  SUBSCRIBED_LIST_DATA_SUCCESS,
  SUBSCRIBED_LIST_DATA_ERROR,
  SUBSCRIBED_LIST_DATA_RESET_REDUCER,

  SUBSCRIBED_CHANNEL_DATA,
  SUBSCRIBED_CHANNEL_DATA_SUCCESS,
  SUBSCRIBED_CHANNEL_DATA_ERROR,



} from "@redux/types";
import { strings } from '@values/strings';
import _ from "lodash";
import axios from 'axios'
import { urls } from '../../api/urls'
const qs = require('querystring')
const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

const configTwo = {
  headers: {
    'Content-Type': 'application/json'
  },
}

export function showLoadingIndicator(type) {
  return {
    type: SUBSCRIBED_LIST_DATA
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


export function getSubscribedChannelList(payload) {

  return dispatch => {

    dispatch(showLoadingIndicator());

    axios.post(urls.UserSubscribedChannel.url, payload, configTwo)
      .then(response => {
        console.log("response---", response);

        if (response.data.success) {

          dispatch(
            onSuccess(response.data.creatorDetails, SUBSCRIBED_CHANNEL_DATA_SUCCESS)
          );
        }
        else if (response.data.success && response.data.creatorDetails.length === 0) {

          dispatch(
            onSuccess(response.data.creatorDetails, SUBSCRIBED_CHANNEL_DATA_SUCCESS)
          );
        }
        else {
          dispatch(
            onFailure(response.data, SUBSCRIBED_CHANNEL_DATA_ERROR)
          );
        }
      })
      .catch(function (error) {
        dispatch(
          onFailure(strings.serverFailedMsg, SUBSCRIBED_CHANNEL_DATA_ERROR)
        );
      });
  }
}



export function getSubscribedVideoList(requestPayload) {

  return dispatch => {

    dispatch(showLoadingIndicator());
    axios.post(urls.subScribeVideoList.url, requestPayload, configTwo)
      .then(response => {
        console.log("response getSubscribedVideoList", response);

        if (response.data.success == true && response.data.videoData.length !== 0) {

          dispatch(
            onSuccess(response.data.videoData, SUBSCRIBED_LIST_DATA_SUCCESS)
          );
        }
        else if (response.data.success == true && response.data.videoData.length == 0) {

          dispatch(
            onSuccess(response.data.videoData, SUBSCRIBED_LIST_DATA_SUCCESS)
          );
        }
        else {
          dispatch(
            onFailure(response.data, SUBSCRIBED_LIST_DATA_ERROR)
          );
        }
      })
      .catch(function (error) {

        dispatch(
          onFailure(strings.serverFailedMsg, SUBSCRIBED_LIST_DATA_ERROR)
        );
      });
  }
}

// export function resetAllReducer() {
//   return {
//     type: SUBSCRIBED_LIST_DATA_RESET_REDUCER
//   };
// }


