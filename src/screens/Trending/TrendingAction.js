import {
  TRENDING_DATA,
  TRENDING_DATA_SUCCESS,
  TRENDING_DATA_ERROR,
  TRENDING_DATA_RESET_REDUCER,

} from '@redux/types';
import { strings } from '@values/strings';
import _ from 'lodash';
import axios from 'axios';
import { urls } from '../../api/urls';
const qs = require('querystring');
const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

const configTwo = {
  headers: {
    'Content-Type': 'application/json'
  },
}

export function showLoadingIndicator() {

  return {
    type: TRENDING_DATA,
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

export function getTrendingList(requestBody) {
  return dispatch => {

    dispatch(showLoadingIndicator());
    axios
      .post(urls.Trending.url, requestBody, configTwo)
      .then(response => {
        if (
          response.data.success == true &&
          response.data.videoData.length !== 0
        ) {

          dispatch(onSuccess(response.data.videoData, TRENDING_DATA_SUCCESS));

        } else if (
          response.data.success == true &&
          response.data.videoData.length == 0
        ) {
          dispatch(onSuccess(response.data.videoData, TRENDING_DATA_ERROR));


        } else {
          dispatch(onFailure(response.data, TRENDING_DATA_ERROR));
        }
      })
      .catch(function (error) {
        dispatch(onFailure(strings.serverFailedMsg, TRENDING_DATA_ERROR));
      });
  };
}


// export function resetAllReducer() {
//   return {
//     type: TRENDING_DATA_RESET_REDUCER
//   };
// }
// export function getLikeDislikeCount(payload) {
//   return dispatch => {
//     axios
//       .post(urls.LikeDisLike.url, payload, configTwo)
//       .then(response => {
//         if (response.data.success) {
//           if (response.data.success) {
//             dispatch(onSuccess(response.data, LIKE_DISLIKE_DATA_SUCCESS));
//           }
//         } else {
//           dispatch(onFailure(response.data, LIKE_DISLIKE_DATA_ERROR));
//         }
//       })
//       .catch(function(error) {
//         dispatch(onFailure(strings.serverFailedMsg, LIKE_DISLIKE_DATA_ERROR));
//       });
//   };
// }
