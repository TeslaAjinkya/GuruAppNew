import {
    SENT_TRANSACTIONS_DATA,
    SENT_TRANSACTIONS_DATA_SUCCESS,
    SENT_TRANSACTIONS_DATA_ERROR,
    RECEIVED_TRANSACTIONS_DATA,
    RECEIVED_TRANSACTIONS_DATA_ERROR,
    RECEIVED_TRANSACTIONS_DATA_SUCCESS,

    TRANSACTIONS_DATA_RESET_REDUCER
} from "@redux/types";
import { strings } from '@values/strings';
import _ from "lodash";
import axios from 'axios'
import { urls } from '../../../api/urls'


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


export function getSentTransaction(payload) {

    return dispatch => {
        

        dispatch(showLoadingIndicator(SENT_TRANSACTIONS_DATA));

        axios.post(urls.Transactions.url, payload, configTwo)
            .then(response => {
                console.log("response", response);
                if (response.data.success) {
                    
                    dispatch(
                        onSuccess(response.data, SENT_TRANSACTIONS_DATA_SUCCESS)
                    );
                }
                else {
                    dispatch(
                        onFailure(response.data, SENT_TRANSACTIONS_DATA_ERROR)
                    );
                }
            })
            .catch(function (error) {
                console.log("error---", error);
                dispatch(
                    onFailure(strings.serverFailedMsg, SENT_TRANSACTIONS_DATA_ERROR)
                );
            });
    }
}


export function getReceivedTransaction(payload) {

    return dispatch => {

        dispatch(showLoadingIndicator(RECEIVED_TRANSACTIONS_DATA));

        axios.post(urls.Transactions.url, payload, configTwo)
            .then(response => {
                console.log("response", response);
                if (response.data.success) {
                    dispatch(
                        onSuccess(response.data, RECEIVED_TRANSACTIONS_DATA_SUCCESS)
                    );
                }
                else {
                    dispatch(
                        onFailure(response.data, RECEIVED_TRANSACTIONS_DATA_ERROR)
                    );
                }
            })
            .catch(function (error) {
                console.log("error---", error);
                dispatch(
                    onFailure(strings.serverFailedMsg, RECEIVED_TRANSACTIONS_DATA_ERROR)
                );
            });
    }
}


// export function resetAllReducer() {
//     return {
//         type: TRANSACTIONS_DATA_RESET_REDUCER
//     };
// }


