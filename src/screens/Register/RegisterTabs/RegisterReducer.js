import {
    VALIDAT_DATA,
    VALIDATE_MOB_DATA_SUCCESS,
    VALIDATE_MOB_DATA_ERROR,
    VALIDATE_EMAIL_DATA_SUCCESS,
    VALIDATE_EMAIL_DATA_ERROR,
    VALIDAT_DATA_RESET_REDUCER
} from "@redux/types";


const initialState = {
    isFetching: false,
    mobValidateError: false,
    mobValidateErrorMsg: "",
    successMobValidateVersion: 0,
    errorMobValidateVersion: 0,
    mobValidateData: [],

    emailValidateError: false,
    emailValidateErrorMsg: "",
    successEmailValidateVersion: 0,
    errorEmailValidateVersion: 0,
    emailValidateData: []
};

export default function dataReducer(state = initialState, action) {
    switch (action.type) {

        case VALIDAT_DATA:
            return {
                ...state,
                isFetching: true
            };

        case VALIDATE_MOB_DATA_SUCCESS:
            return {
                ...state,
                mobValidateErrorMsg: "",
                isFetching: false,
                mobValidateData: action.data,
                successMobValidateVersion: ++state.successMobValidateVersion,
                mobValidateError: false
            };

        case VALIDATE_MOB_DATA_ERROR:            
            return {
                ...state,
                isFetching: false,
                mobValidateError: true,
                mobValidateData:[],
                mobValidateErrorMsg: action.error,
                errorMobValidateVersion: ++state.errorMobValidateVersion
            };

            case VALIDATE_EMAIL_DATA_SUCCESS:
                return {
                    ...state,
                    emailValidateErrorMsg: "",
                    isFetching: false,
                    emailValidateData: action.data,
                    successEmailValidateVersion: ++state.successEmailValidateVersion,
                    emailValidateError: false
                };
    
            case VALIDATE_EMAIL_DATA_ERROR:            
                return {
                    ...state,
                    isFetching: false,
                    emailValidateError: true,
                    emailValidateData:[],
                    emailValidateErrorMsg: action.error,
                    errorEmailValidateVersion: ++state.errorEmailValidateVersion
                };

        case VALIDAT_DATA_RESET_REDUCER:
            return initialState;

        default:
            return state;
    }
}
