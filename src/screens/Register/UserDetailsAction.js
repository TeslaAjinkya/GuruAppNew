import {
    REGISTER_DATA,
    REGISTER_DATA_SUCCESS,
    REGISTER_DATA_ERROR,
} from "@redux/types";

import { strings } from '@values/strings'
import _ from "lodash";
import axios from 'axios'
import { urls } from '@api/urls'
import { Toast } from "native-base";
const config = {
    headers: {
        // Accept: 'application/json',
        'Content-Type': 'application/json',
    }
}
import AsyncStorage from '@react-native-community/async-storage';


export function showLoadingIndicator(type) {
    return {
        type: REGISTER_DATA
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

export function setRegisterData(data) {
    console.log("data", data);

   // AsyncStorage.setItem('userId', data.userId.toString())
    AsyncStorage.setItem('email', data.emailId)
    AsyncStorage.setItem('firstName', data.firstName)
    AsyncStorage.setItem('lastName', data.lastName)
    AsyncStorage.setItem('userName', data.userName)
    AsyncStorage.setItem('mobileNumber', data.mobileNumber)
    AsyncStorage.setItem('dob', data.dob)
    AsyncStorage.setItem('userpic', data.profilePic)
    //AsyncStorage.setItem('walletBalance', data.walletBalance.toString())
   // AsyncStorage.setItem('subscribersCount', data.subscribersCount.toString())

}

export function registerUser(payloadOne,payload) {

    const { firstName, lastName, base46Profile, mobileNumber,
        emailId, userName,datePicked, password,verified,api } = payload

    return dispatch => {
        dispatch(showLoadingIndicator());

        axios.post(urls.RegisterUser.url, {
            "payload":{
                firstName:firstName,
                lastName:lastName,
                emailId:emailId,
                mobileNumber:mobileNumber,
                userName:userName,
                password:password,
                dob:datePicked,
                verified:verified,
                api:api,
                profilePic:base46Profile
            }
        }, config

        ).then(response => {
            console.log("response.data.success", response);
            if (response.data.success) {
                dispatch(onSuccess(response.data, REGISTER_DATA_SUCCESS))

               // setRegisterData(payloadOne.body)
            }
            else {
                dispatch(onFailure(response.data.msg, REGISTER_DATA_ERROR))
            }
        })
            .catch(function (error) {
                console.log("error login normal", error);
                dispatch(
                    onFailure(strings.serverFailedMsg, REGISTER_DATA_ERROR)
                );
            });
    }
}
