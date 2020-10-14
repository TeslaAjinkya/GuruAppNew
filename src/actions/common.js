import {
    VIDEO_LISTING_DATA,
    VIDEO_LISTING_DATA_SUCCESS,
    VIDEO_LISTING_DATA_ERROR,
    VIDEO_LISTING_DATA_RESET_REDUCER,

} from '../actionTypes/actionTypes'


export const getVideoList = (data) => {
    console.log("VIDEO_LISTING_DATA", data);
    return {
        type: VIDEO_LISTING_DATA,
        payload: { data }
    }
}

export const getVideoListSuccess = (data) => {
    console.log("videoListSuccess", data);
    return {
        type: VIDEO_LISTING_DATA_SUCCESS,
        payload: { data }
    }
}

export const videoListError = (data) => {
    console.log("videoListError", data);
    return {
        type: VIDEO_LISTING_DATA_ERROR,
        payload: { data }
    }
}