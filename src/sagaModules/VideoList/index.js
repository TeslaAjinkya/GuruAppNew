import { createAction, handleActions } from "redux-actions";

// ACTIONS


export const getVideoList = createAction("GET_VIDEO_LIST");
export const videoListingDataSuccess = createAction("VIDEO_LISTING_DATA_SUCCESS");
export const videoListingDataError = createAction("VIDEO_LISTING_DATA_ERROR");
export const requestStart = createAction("REQUEST_START");
export const resetState = createAction("RESET_STATE");


export const getCategory = createAction("GET_CATEGORY");
export const getCategorySuccess = createAction("GET_CATEGORY_SUCCESS");
export const getCategoryError = createAction("GET_CATEGORY_ERROR");

export const getLikeDislikeCount = createAction("LIKE_DISLIKE_DATA");
export const getLikeDislikeCountSuccess = createAction("LIKE_DISLIKE_DATA_SUCCESS");
export const getLikeDislikeCountError = createAction("LIKE_DISLIKE_DATA_ERROR");


export const getShareCount = createAction("SHARE_COUNT");
export const getShareCountSuccess = createAction("SHARE_COUNT_SUCCESS");
export const getShareCountError = createAction("SHARE_COUNT_ERROR");


export const getStories = createAction("GET_STORIES");
export const getStoriesSuccess = createAction("GET_STORIES_SUCCESS");
export const getStoriesError = createAction("GET_STORIES_ERROR");



// REDUCER
const defaultState = {
    isFetching: false,
    videoData: '',
    successVideoDataVersion: 0,
    videoListErrorVersion: 0,
    videoListingError: false,
    videoErrorMsg: '',

    categoryData: '',
    successCategoryDataVersion: 0,
    errorCategoryDataVersion: 0,
    CatgoryDataErrorMsg: '',
    CategoryDataError: false,

    likeDislikeData: '',
    likeDislikeError: false,
    likeDislikeErrorMsg: '',
    errorLikeDislikeCountVersion: 0,
    successLikeDislikeCountVersion: 0,

    shareData: '',
    shareError: false,
    shareErrorMsg: '',
    errorShareCountVersion: 0,
    successShareCountVersion: 0,

    successStoriesVersion: 0,
    storiesData: '',
    errorStoriesVersion: 0,
    storiesDataErrorMsg: '',
    storieDataError: false,



};

export default handleActions(
    {
        [requestStart]: state => ({ ...state, isFetching: true, videoErrorMsg: "" }),
        [resetState]: state => ({ ...state, videoErrorMsg: "", }),

        [videoListingDataSuccess]: (state, { payload }) => {
            var increment = ++state.successVideoDataVersion;
            return {
                ...state,
                isFetching: false,
                videoData: payload,
                videoListingError: false,
                successVideoDataVersion: increment,
                videoErrorMsg: ""
            }
        },

        [videoListingDataError]: (state, { payload }) => {
            var increment1 = ++state.videoListErrorVersion;
            return {
                ...state,
                videoListErrorVersion: increment1,
                videoListingError: true,
                videoErrorMsg: payload,
                isFetching: false,
            }
        },


        [getCategorySuccess]: (state, { payload }) => {
            var increment3 = ++state.successCategoryDataVersion;
            return {
                ...state,
                isFetching: false,
                categoryData: payload,
                successCategoryDataVersion: increment3,
                CatgoryDataErrorMsg: '',
                CategoryDataError: false,
            }
        },

        [getCategoryError]: (state, { payload }) => {
            var increment4 = ++state.errorCategoryDataVersion;
            return {
                ...state,
                isFetching: false,
                categoryData: '',
                errorCategoryDataVersion: increment4,
                CatgoryDataErrorMsg: payload,
                CategoryDataError: true,
            }
        },


        [getLikeDislikeCountSuccess]: (state, { payload }) => {
            var increment5 = ++state.successLikeDislikeCountVersion;
            return {
                ...state,
                isFetching: false,
                likeDislikeData: payload,
                likeDislikeError: false,
                likeDislikeErrorMsg: '',
                successLikeDislikeCountVersion: increment5,
            };
        },

        [getLikeDislikeCountError]: (state, { payload }) => {
            var increment6 = ++state.errorLikeDislikeCountVersion;
            return {
                ...state,
                isFetching: false,
                likeDislikeData: '',
                likeDislikeError: true,
                likeDislikeErrorMsg: payload,
                errorLikeDislikeCountVersion: increment6,
            };
        },

        [getShareCountSuccess]: (state, { payload }) => {
            console.log("getShareCountSuccess payload", payload);
            var shareIncrement = ++state.successShareCountVersion;
            return {
                ...state,
                isFetching: false,
                shareData: payload,
                shareError: false,
                shareErrorMsg: '',
                successShareCountVersion: shareIncrement,
            };
        },

        [getShareCountError]: (state, { payload }) => {
            var shareIncrement2 = ++state.errorShareCountVersion;
            return {
                ...state,
                isFetching: false,
                shareData: '',
                shareError: true,
                shareErrorMsg: payload,
                errorShareCountVersion: shareIncrement2,
            };
        },

        [getStoriesSuccess]: (state, { payload }) => {
            console.log("getStoriesSuccess payload", payload);
            var storyIncrement = ++state.successStoriesVersion;
            return {
                ...state,
                successStoriesVersion: storyIncrement,
                storiesData: payload,
                storiesDataErrorMsg: '',
                storieDataError: false,
            };
        },

        [getStoriesError]: (state, { payload }) => {
            var storyIncrement2 = ++state.errorStoriesVersion;
            return {
                storiesData: '',
                errorStoriesVersion: storyIncrement2,
                storiesDataErrorMsg: payload,
                storieDataError: true,

            };
        },

    },
    defaultState
);


