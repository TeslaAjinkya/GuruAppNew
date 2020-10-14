import {
    SENT_TRANSACTIONS_DATA,
    SENT_TRANSACTIONS_DATA_SUCCESS,
    SENT_TRANSACTIONS_DATA_ERROR,
    RECEIVED_TRANSACTIONS_DATA,
    RECEIVED_TRANSACTIONS_DATA_ERROR,
    RECEIVED_TRANSACTIONS_DATA_SUCCESS,
    TRANSACTIONS_DATA_RESET_REDUCER
} from '@redux/types';

const initialState = {
    isFetching: false,
    sentTxData: [],
    errorSentTx: false,
    errorSentTxMsg: '',
    successSentTxVersion: 0,
    errorSentTxVersion: 0,

    receivedTxData: [],
    errorReceivedTx: false,
    errorReceivedTxMsg: '',
    successReceivedTxVersion: 0,
    errorReceivedTxVersion: 0,
};

export default function dataReducer(state = initialState, action) {
    switch (action.type) {
        case SENT_TRANSACTIONS_DATA:
            return {
                ...state,
                isFetching: true,
            };

        case SENT_TRANSACTIONS_DATA_SUCCESS:
            return {
                ...state,
                isFetching: false,
                sentTxData: action.data,
                errorSentTx: false,
                errorSentTxMsg: '',
                successSentTxVersion: ++state.successSentTxVersion,
            };

        case SENT_TRANSACTIONS_DATA_ERROR:
            return {
                ...state,
                isFetching: false,
                sentTxData: '',
                errorSentTx: true,
                errorSentTxMsg: action.error.msg,
                errorSentTxVersion: ++state.errorSentTxVersion,
            };


        case RECEIVED_TRANSACTIONS_DATA:
            return {
                ...state,
                isFetching: true,
            };

        case RECEIVED_TRANSACTIONS_DATA_SUCCESS:
            return {
                ...state,
                isFetching: false,
                receivedTxData: action.data,
                errorReceivedTx: false,
                errorReceivedTxMsg: '',
                successReceivedTxVersion: ++state.successReceivedTxVersion,
            };

        case RECEIVED_TRANSACTIONS_DATA_ERROR:
            return {
                ...state,
                isFetching: false,
                receivedTxData: '',
                errorReceivedTx: true,
                errorReceivedTxMsg: action.error.msg,
                errorReceivedTxVersion: ++state.errorReceivedTxVersion,
            };

        // case TRANSACTIONS_DATA_RESET_REDUCER:
        //     return initialState;

        default:
            return state;
    }
}
