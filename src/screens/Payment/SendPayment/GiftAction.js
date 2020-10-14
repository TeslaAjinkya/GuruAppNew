import {
    SEND_GIFT_DATA,
    SEND_GIFT_DATA_SUCCESS,
    SEND_GIFT_DATA_ERROR,
    VIEW_BALANCE_DATA
  } from '@redux/types';
  import {strings} from '@values/strings';
  import _ from 'lodash';
  import axios from 'axios';
  import {urls} from '../../../api/urls';
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
  
  export function showLoadingIndicator(type) {
    return {
      type: SEND_GIFT_DATA,
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
  
  export function sendGift(requestpayload) {
    
    return dispatch => {
      dispatch(showLoadingIndicator());
      
      axios
        .post(urls.sendGift.url, requestpayload, configTwo)
        .then(response => {
            
          if (response.data.success) {
            
            dispatch(onSuccess(response.data, SEND_GIFT_DATA_SUCCESS));
          } else {
            dispatch(onFailure(response.data, SEND_GIFT_DATA_ERROR));
          }
        })
        .catch(function(error) {
          console.log('error---', error);
  
          dispatch(onFailure(strings.serverFailedMsg, SEND_GIFT_DATA_ERROR));
        });
    };
  }
  