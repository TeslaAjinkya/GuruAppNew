import {
  VIDEO_CATEGORY_LISTING_DATA,
  VIDEO_CATEGORY_LISTING_DATA_SUCCESS,
  VIDEO_CATEGORY_LISTING_DATA_ERROR,
  VIDEO_STORIES_LISTING_DATA_SUCCESS,
  VIDEO_STORIES_LISTING_DATA_ERROR,
  VIDEO_LISTING_DATA,
  VIDEO_LISTING_DATA_SUCCESS,
  VIDEO_LISTING_DATA_ERROR,
  VIDEO_LISTING_DATA_RESET_REDUCER,
  LIKE_DISLIKE_DATA,
  LIKE_DISLIKE_DATA_SUCCESS,
  LIKE_DISLIKE_DATA_ERROR,
  SHARE_DATA,
  SHARE_DATA_SUCCESS,
  SHARE_DATA_ERROR,
} from '@redux/types';

const initialState = {
  isFetching: false,

  categoryData: '',
  successCategoryDataVersion: 0,
  errorCategoryDataVersion: 0,
  CatgoryDataErrorMsg: '',
  CategoryDataError: false,

  successStoriesVersion: 0,
  storiesData: '',
  errorStoriesVersion: 0,
  storiesDataErrorMsg: '',
  storieDataError: false,

  videoData: '',
  successVideoDataVersion: 0,
  videoListErrorVersion: 0,
  videoListingError: false,
  videoErrorMsg: '',

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
};


export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case VIDEO_CATEGORY_LISTING_DATA:
      return {
        ...state,
        isFetching: true,
      };

    // categoryData
    case VIDEO_CATEGORY_LISTING_DATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        categoryData: action.data,
        successCategoryDataVersion: ++state.successCategoryDataVersion,
        CatgoryDataErrorMsg: '',
        CategoryDataError: false,
      };

    case VIDEO_CATEGORY_LISTING_DATA_ERROR:

      return {
        ...state,
        isFetching: false,
        categoryData: '',
        errorCategoryDataVersion: ++state.errorCategoryDataVersion,
        CatgoryDataErrorMsg: action.error,
        CategoryDataError: true,
      };

    //stories
    case VIDEO_STORIES_LISTING_DATA_SUCCESS:
      var storyIncrement = ++initialState.successStoriesVersion;
      return {
        ...state,
        successStoriesVersion: storyIncrement,
        storiesData: action.data,
        storiesDataErrorMsg: '',
        storieDataError: false,
      };

    case VIDEO_STORIES_LISTING_DATA_ERROR:
      var storyIncrement2 = ++initialState.errorStoriesVersion;

      return {
        storiesData: action.error,
        errorStoriesVersion: storyIncrement2,
        storiesDataErrorMsg: action.error,
        storieDataError: true,

      };

    case VIDEO_LISTING_DATA_SUCCESS:
      var increment = ++initialState.successVideoDataVersion;
      return {
        ...state,
        videoData: action.data,
        videoListingError: false,
        successVideoDataVersion: increment,
        videoErrorMsg: ""
      };

    case VIDEO_LISTING_DATA_ERROR:
      var increment = ++initialState.videoListErrorVersion;
      return {
        ...state,
        videoListErrorVersion: increment,
        videoListingError: true,
        videoErrorMsg: action.error,
      };

    case LIKE_DISLIKE_DATA_SUCCESS:
      var increment1 = ++initialState.successLikeDislikeCountVersion;

      return {
        ...state,
        isFetching: false,
        likeDislikeData: action.data,
        likeDislikeError: false,
        likeDislikeErrorMsg: '',
        successLikeDislikeCountVersion: increment1,
      };

    case LIKE_DISLIKE_DATA_ERROR:
      var increment2 = ++initialState.errorLikeDislikeCountVersion;

      return {
        ...state,
        isFetching: false,
        likeDislikeData: '',
        likeDislikeError: true,
        likeDislikeErrorMsg: action.error,
        errorLikeDislikeCountVersion: increment2,
      };

    case SHARE_DATA_SUCCESS:
      var shareIncrement = ++initialState.successShareCountVersion;

      return {
        ...state,
        isFetching: false,
        shareData: action.data,
        shareError: false,
        shareErrorMsg: '',
        successShareCountVersion: shareIncrement,
      };

    case SHARE_DATA_ERROR:
      var shareIncrement2 = ++initialState.errorShareCountVersion;
      return {
        ...state,
        isFetching: false,
        shareData: '',
        shareError: true,
        shareErrorMsg: action.error,
        errorShareCountVersion: shareIncrement2,
      };

    case VIDEO_LISTING_DATA_RESET_REDUCER:
      return initialState;

    default:
      return state;
  }
}
