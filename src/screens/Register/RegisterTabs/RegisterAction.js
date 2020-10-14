import {
    VALIDAT_DATA,
    VALIDATE_MOB_DATA_SUCCESS,
    VALIDATE_MOB_DATA_ERROR,
    VALIDATE_EMAIL_DATA_SUCCESS,
    VALIDATE_EMAIL_DATA_ERROR
} from "@redux/types";

import { strings } from '@values/strings'
import _ from "lodash";
import axios from 'axios'
import { urls } from '@api/urls'
const config = {
    headers: {
        // Accept: 'application/json',
        'Content-Type': 'application/json',
    }
}


export function showLoadingIndicator(type) {
    return {
        type: VALIDAT_DATA
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


export function validateMob(payload) {
console.log("payload validateMob",payload);

    return dispatch => {
        dispatch(showLoadingIndicator());

        axios.post(urls.ValidateMobEmail.url, payload, config

        ).then(response => {
            console.log("response.data.success", response);
            if (response.data.success) {
                dispatch(onSuccess(response.data, VALIDATE_MOB_DATA_SUCCESS))
            }
            else {
                dispatch(onFailure(response.data.msg, VALIDATE_MOB_DATA_ERROR))
            }
        })
            .catch(function (error) {
                console.log("error login normal", error);
                dispatch(
                    onFailure(strings.serverFailedMsg, VALIDATE_MOB_DATA_ERROR)
                );
            });
    }
}


export function validateEmail(payload) {
    console.log("payload validateEmail",payload);

    return dispatch => {
        dispatch(showLoadingIndicator());

        axios.post(urls.ValidateMobEmail.url, payload, config

        ).then(response => {
            console.log("response.data.success", response);
            if (response.data.success) {
                dispatch(onSuccess(response.data, VALIDATE_EMAIL_DATA_SUCCESS))
            }
            else {
                dispatch(onFailure(response.data.msg,VALIDATE_EMAIL_DATA_ERROR ))
            }
        })
            .catch(function (error) {
                console.log("error login normal", error);
                dispatch(
                    onFailure(strings.serverFailedMsg, VALIDATE_EMAIL_DATA_ERROR)
                );
            });
    }
}