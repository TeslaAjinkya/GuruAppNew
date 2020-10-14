import {
    SEARCH_DATA,
    SEARCH_DATA_SUCCESS,
    SEARCH_DATA_ERROR,
    SEARCH_DATA_RESET_REDUCER,

} from "@redux/types";
import { strings } from '@values/strings'

import _ from "lodash";
import axios from 'axios'
import { urls } from '../../api/urls'
import { Toast } from "native-base";
const qs = require('querystring')
import AsyncStorage from '@react-native-community/async-storage';

const config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
}

const configTwo = {
    headers: {
        'Content-Type': 'application/json'
    },
}

export function showLoadingIndicator(type) {
    return {
        type: SEARCH_DATA
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



export function getSearchResult(searchKey) {
    console.log("searchKey", searchKey);

    return dispatch => {

        dispatch(showLoadingIndicator());

        // axios.post(urls.Search.url,searchKey.searchKey,config)
        // Or

        axios.post(urls.Search.url, searchKey , configTwo)
            .then(response => {

                console.log("response,data",response.data);
                
                if (response.data.success) {
                    dispatch(
                        onSuccess(response.data.videoData, SEARCH_DATA_SUCCESS)
                    )
                }
                else {
                    dispatch(
                        onFailure(response, SEARCH_DATA_ERROR)
                    )
                }
            })
            .catch(function (error) {
                dispatch(
                    onFailure(strings.serverFailedMsg, SEARCH_DATA_ERROR)
                );
            });
    }
}
