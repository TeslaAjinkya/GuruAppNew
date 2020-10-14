import {
    REGISTER_DATA,
    REGISTER_DATA_SUCCESS,
    REGISTER_DATA_ERROR,
    REGISTER_DATA_RESET_REDUCER,

} from "@redux/types";


const initialState = {
    isFetching: false,
    error: false,
    registerErrorMsg: "",
    successRegisterVersion: 0,
    errorRegisterVersion: 0,
    registerData: []
};

export default function dataReducer(state = initialState, action) {
    switch (action.type) {

        case REGISTER_DATA:
            return {
                ...state,
                isFetching: true
            };

        case REGISTER_DATA_SUCCESS:
            return {
                ...state,
                registerErrorMsg: "",
                isFetching: false,
                registerData: action.data,
                successRegisterVersion: ++state.successRegisterVersion,
                error: false
            };

        case REGISTER_DATA_ERROR:
            console.log("action.error",action.error);
            
            return {
                ...state,
                isFetching: false,
                error: true,
                registerErrorMsg: action.error,
                errorRegisterVersion: ++state.errorRegisterVersion
            };

        case REGISTER_DATA_RESET_REDUCER:
            return initialState;

        default:
            return state;
    }
}
