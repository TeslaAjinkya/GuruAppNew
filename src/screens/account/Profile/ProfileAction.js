import {
  VIEW_PROFILE_DATA,
  VIEW_PROFILE_DATA_SUCCESS,
  VIEW_PROFILE_DATA_ERROR,
  UPDATE_PROFILE_DATA,
  UPDATE_PROFILE_DATA_SUCCESS,
  UPDATE_PROFILE_DATA_ERROR,
} from '@redux/types';
import { strings } from '@values/strings';
import _ from 'lodash';
import axios from 'axios';
import { urls } from '../../../api/urls';

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

export function showLoadingIndicator(type) {
  return {
    type: type,
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




export function viewProfile(requestpayload) {
  console.log("viewProfile requestpayload", requestpayload);
  return dispatch => {
    dispatch(showLoadingIndicator(VIEW_PROFILE_DATA));

    axios
      .post(urls.ViewProfile.url, requestpayload, configTwo)
      .then(response => {
        console.log("viewProfile response.data", response.data);

        if (response.data.success) {
          dispatch(onSuccess(response.data, VIEW_PROFILE_DATA_SUCCESS));
        } else {
          dispatch(onFailure(response.data, VIEW_PROFILE_DATA_ERROR));
        }
      })
      .catch(function (error) {
        dispatch(onFailure(strings.serverFailedMsg, VIEW_PROFILE_DATA_ERROR));
      });
  };
}



export function updateProfile(requestpayload) {

  return dispatch => {
    dispatch(showLoadingIndicator(UPDATE_PROFILE_DATA));

    axios
      .post(urls.UpdateProfile.url, requestpayload, configTwo)
      .then(response => {

        if (response.data.success) {
          dispatch(onSuccess(response.data, UPDATE_PROFILE_DATA_SUCCESS));
        } else {
          dispatch(onFailure(response.data, UPDATE_PROFILE_DATA_ERROR));
        }
      })
      .catch(function (error) {
        dispatch(onFailure(strings.serverFailedMsg, UPDATE_PROFILE_DATA_ERROR));
      });
  };
}

// export function resetAllReducer() {
//   return {
//     type: POST_VIDEO_DATA_RESET_REDUCER,
//   };
// }
