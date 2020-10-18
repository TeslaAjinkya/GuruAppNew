import {
  LOGIN_DATA,
  LOGIN_DATA_SUCCESS,
  LOGIN_DATA_ERROR,
  LOGIN_DATA_MOBILE_SUCCESS,
  LOGIN_DATA_MOBILE_ERROR,
  LOGIN_DATA_RESET_REDUCER,

} from "@redux/types";

import { strings } from '@values/strings'
import _ from "lodash";
import axios from 'axios'
import { urls } from '@api/urls'
import { Toast } from "native-base";
const qs = require('querystring')
const config = {
  headers: {
    'Content-Type': 'application/json',
  }
}
import AsyncStorage from '@react-native-community/async-storage';


export function showLoadingIndicator(type) {
  return {
    type: LOGIN_DATA
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

export function setLoginData(data) {
  global.userId = data.userId;
  AsyncStorage.setItem('userId', data.userId.toString())
  AsyncStorage.setItem('email', data.emailId)
  AsyncStorage.setItem('firstName', data.firstName)
  AsyncStorage.setItem('lastName', data.lastName)
  AsyncStorage.setItem('userName', data.userName)
  AsyncStorage.setItem('mobileNumber', data.mobileNumber)
  AsyncStorage.setItem('dob', data.dob)
  AsyncStorage.setItem('userpic', data.userpic)
  //AsyncStorage.setItem('walletBalance', data.walletBalance.toString())
  AsyncStorage.setItem('subscribersCount', data.subscribersCount.toString())

}

export function signInRequestNormal(payload) {

  const { emailId, password } = payload

  return dispatch => {
    dispatch(showLoadingIndicator());

    axios.post(urls.Login.url,
      {
        payload: {
          loginKey: emailId.toLowerCase(),
          password: password,
          api: 0
        }
      },
      config
    )
      .then(response => {
        if (response.data.success && response.data.userProfile.length > 0) {
          setLoginData(response.data.userProfile[0])
          dispatch(
            onSuccess(response.data, LOGIN_DATA_SUCCESS)
          )
        }
        else {

          dispatch(
            onFailure(response.data.msg, LOGIN_DATA_ERROR)
          )
        }
      })
      .catch(function (error) {
        dispatch(
          onFailure(strings.serverFailedMsg, LOGIN_DATA_ERROR)
        );
      });
  }
}


export function signInRequestFb(payload) {

  const { first_name, last_name, email, dob, accessToken, base64ProfileUrl } = payload


  return dispatch => {
    dispatch(showLoadingIndicator());

    axios.post(urls.Login.url,
      {
        payload: {
          firstName: first_name ? first_name : '',
          lastName: last_name ? last_name : '',
          emailId: email.toLowerCase(),
          api: 1,
          accessToken: accessToken,
          profilePic: base64ProfileUrl,
          //dob:dob
        }
      },
      config
    )
      .then(response => {
        if (response.data.success && response.data.userProfile.length > 0) {
          setLoginData(response.data.userProfile[0])
          dispatch(
            onSuccess(response.data, LOGIN_DATA_SUCCESS)
          )
        }
        else {

          dispatch(
            onFailure(response.data.msg, LOGIN_DATA_ERROR)
          )
        }
      })
      .catch(function (error) {
        dispatch(
          onFailure(strings.serverFailedMsg, LOGIN_DATA_ERROR)
        );
      });
  }
}


export function signInRequestGoogle(payload) {

  const { first_name, last_name, email, token, base64ProfileUrlGoogle } = payload

  return dispatch => {
    dispatch(showLoadingIndicator());

    axios.post(urls.Login.url,
      {
        'payload': {
          firstName: first_name ? first_name : '',
          lastName: last_name ? last_name : '',
          emailId: email.toLowerCase(),
          api: 1,
          accessToken: token,
          profilePic: base64ProfileUrlGoogle,
        }
      },
      config
    )
      .then(response => {
        if (response.data.success && response.data.userProfile.length > 0) {
          setLoginData(response.data.userProfile[0])
          dispatch(
            onSuccess(response.data, LOGIN_DATA_SUCCESS)
          )
        }
        else {
          dispatch(
            onFailure(response.data.msg, LOGIN_DATA_ERROR)
          )
        }
      })
      .catch(function (error) {
        dispatch(
          onFailure(strings.serverFailedMsg, LOGIN_DATA_ERROR)
        );
      });
  }
}


export function signInRequestWithMobileNo(payload) {
  const { userName, mobileNumber, token } = payload


  return dispatch => {
    dispatch(showLoadingIndicator());

    axios.post(urls.Login.url,
      {
        'payload': {
          mobileNumber: mobileNumber,
          userName: userName,
          api: 1,
          accessToken: token,
        }
      },
      config
    )
      .then(response => {
        if (response.data.success && response.data.userProfile.length > 0) {
          setLoginData(response.data.userProfile[0])
          dispatch(onSuccess(response.data, LOGIN_DATA_MOBILE_SUCCESS))
        }
        else {
          dispatch(onFailure(response.data.msg, LOGIN_DATA_MOBILE_ERROR))
        }
      })
      .catch(function (error) {
        dispatch(
          onFailure(strings.serverFailedMsg, LOGIN_DATA_MOBILE_ERROR)
        );
      });
  }
}