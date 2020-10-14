import {
    VIDEO_LISTING_DATA_SUCCESS,
    VIDEO_LISTING_DATA_ERROR,
    VIDEO_LISTING_DATA_RESET_REDUCER,
    VIDEO_LISTING_DATA

} from '../actionTypes/actionTypes';

const INIT_STATE = {
    isFetching: false,
    videoData: '',
    successVideoDataVersion: 0,
    videoListErrorVersion: 0,
    videoListingError: false,
    videoErrorMsg: '',
}
export default (state = INIT_STATE, action) => {
    switch (action.type) {


        case VIDEO_LISTING_DATA_SUCCESS:
            var increment = ++state.successVideoDataVersion;
            return {
                ...state,
                videoData: action.data,
                videoListingError: false,
                successVideoDataVersion: increment,
                videoErrorMsg: ""
            };

        case VIDEO_LISTING_DATA_ERROR:
            var increment = ++state.videoListErrorVersion;
            return {
                ...state,
                videoListErrorVersion: increment,
                videoListingError: true,
                videoErrorMsg: action.error,
            };

        case VIDEO_LISTING_DATA:
            return {
                ...state,
            };


        default:
            return {
                ...state
            }
    }
}   