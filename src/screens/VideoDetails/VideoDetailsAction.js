import {
    VIDEO_DETAILS_DATA,
    VIDEO_DETAILS_DATA_SUCCESS ,
    VIDEO_DETAILS_DATA_ERROR, 
    VIDEO_DETAILS_RESET_REDUCER ,
    VIDEO_DETAILS_OTHER_DATA,
    VIDEO_DETAILS_OTHER_DATA_SUCCESS ,
    VIDEO_DETAILS_OTHER_DATA_ERROR, 
    VIDEO_DETAILS_OTHER_DATA_RESET_REDUCER ,

    LIKEDISLIKE_DETAILS_DATA,
    LIKEDISLIKE_DETAILS_DATA_SUCCESS,
    LIKEDISLIKE_DETAILS_DATA_ERROR,
    LIKEDISLIKE_DETAILS_DATA_RESET_REDUCER,

    SUBSCRIPTION_DATA,
    SUBSCRIPTION_DATA_SUCCESS,
    SUBSCRIPTION_DATA_ERROR,
    SUBSCRIPTION_DATA_RESET_REDUCER,

    SUBSCRIBED_DATA,
    SUBSCRIBED_DATA_SUCCESS,
    SUBSCRIBED_DATA_ERROR,
    SUBSCRIBED_DATA_RESET_REDUCER,
  
    VIEWS_COUNT_ERROR,
    VIEWS_COUNT_SUCCESS,

    GIFT_LIST_DATA,
    GIFT_LIST_DATA_SUCCESS,
    GIFT_LIST_DATA_ERROR

    } from "@redux/types";
  
  import _ from "lodash";
  import axios from 'axios'
  import {urls} from '../../api/urls'
  const qs = require('querystring')
  
const configTwo = {
  headers: {
    'Content-Type': 'application/json'
  },
}
const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

export function showLoadingIndicator(type) {
  return {
    type: VIDEO_DETAILS_DATA
  };
}

export function onSuccess(data, type) {
  return {
    type: type,
    data
  };
}

export function onFailure(error, type) {
  return {
    type: type,
    error
  };
}



export function getVideoDetails(requestBody) {
  return dispatch => {
    dispatch(showLoadingIndicator());
    axios.post(urls.VideoListing.url, requestBody, configTwo)
      .then(response => {
        if (response.data.success == true && response.data.videoData.length !== 0) {
          dispatch(
            onSuccess(response.data.videoData, VIDEO_DETAILS_DATA_SUCCESS)
          );
        }
        else {
          dispatch(
            onFailure(response, VIDEO_DETAILS_DATA_ERROR)
          );
        }
      })
      .catch(function (error) {
        dispatch(
           onFailure(error, VIDEO_DETAILS_DATA_ERROR)
           );
       });
     }
   }


   export function getOtherDetails(requestBody) {
    
    return dispatch => {
     dispatch(showLoadingIndicator());
     axios.post(urls.OtherCategories.url, qs.stringify(requestBody), config)
     .then(response => {
     if(response.data.success == true &&  response.data.videoData.length !== 0)
       {
       dispatch(
           onSuccess(response.data.videoData, VIDEO_DETAILS_OTHER_DATA_SUCCESS)
         );
         dispatch(getGiftList())
       }
       else
       {
         dispatch(
           onFailure(response, VIDEO_DETAILS_OTHER_DATA_ERROR)
         );
         dispatch(getGiftList())
       }       
     })
     .catch(function (error) {
      dispatch(
         onFailure(error, VIDEO_DETAILS_OTHER_DATA_ERROR)
         );
         dispatch(getGiftList())
     });
   }
 }
    
//  export function getLikeDislikeCount(payload) {

//   return dispatch => {
//     axios.post(urls.LikeDisLike.url, payload, configTwo).then(response => {
//     if (response.data.success) {
//      if (response.data.success) {
//         dispatch(
//          onSuccess(response.data, LIKEDISLIKE_DETAILS_DATA_SUCCESS)
//        )
//      }
//    }
//        else {
//          dispatch(
//            onFailure(response.data, LIKEDISLIKE_DETAILS_DATA_ERROR)
//          );
//        }
//      })
//      .catch(function (error) {
//        dispatch(
//          onFailure(error, LIKEDISLIKE_DETAILS_DATA_ERROR)
//        );
//      });

//  }
// }


export function isSubcribed(payload) {


  return dispatch => {
    axios.post(urls.subscription.url, payload, configTwo).then(response => {
      if (response.data.success) {
        if (response.data.success) {

          dispatch(
            onSuccess(response.data, SUBSCRIPTION_DATA_SUCCESS)
          )
        }
      }
      else {
        dispatch(
          onFailure(response.data, SUBSCRIPTION_DATA_ERROR)
        );
      }
    })
      .catch(function (error) {
        dispatch(
          onFailure(strings.serverFailedMsg, SUBSCRIPTION_DATA_ERROR)
        );
      });
  }
}


export function subscribedClicked(payload) {

  return dispatch => {
    axios.post(urls.subscribe.url, payload, configTwo).then(response => {
      if (response.data.success) {
        if (response.data.success) {

          dispatch(
            onSuccess(response.data, SUBSCRIBED_DATA_SUCCESS)
          )
        }
      }
      else {
        dispatch(
          onFailure(response.data, SUBSCRIBED_DATA_ERROR)
        );
      }
    })
      .catch(function (error) {
        dispatch(
          onFailure(strings.serverFailedMsg, SUBSCRIBED_DATA_ERROR)
        );
      });

  }
}


export function getViewsCount(payload) {
  const { createrId, videoid } = payload

  console.log("payload", payload);

  return dispatch => {
    axios.post(urls.ViewsCount.url,
      {
        "payload": {
          createrId: createrId,
          videoId: videoid.toString()
        }
      },
      configTwo
    ).then(response => {

      console.log("response getViewsCount", response);

      if (response.data.success) {
        dispatch(
          onSuccess(response.data, VIEWS_COUNT_SUCCESS)
        )
      }
      else {
        dispatch(
          onFailure(response.data, VIEWS_COUNT_ERROR)
        );
      }
    })
      .catch(function (error) {
        dispatch(
          onFailure(strings.serverFailedMsg, VIEWS_COUNT_ERROR)
        );
      });

  }
}


export function getGiftList() {

  return dispatch => {
    dispatch(showLoadingIndicator());
    axios.get(urls.giftList.url).then(response => {
      
      if (response.data.success) {
        if (response.data.success) {

          dispatch(
            onSuccess(response.data, GIFT_LIST_DATA_SUCCESS)
          )
        }
      }
      else {
        dispatch(
          onFailure(response.data, GIFT_LIST_DATA_ERROR)
        );
      }
    })
      .catch(function (error) {
        dispatch(
          onFailure(strings.serverFailedMsg, GIFT_LIST_DATA_ERROR)
        );
      });

  }
}

