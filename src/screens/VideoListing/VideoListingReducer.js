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
      return {
        ...state,
        successStoriesVersion: ++state.successStoriesVersion,
        storiesData: action.data,
        storiesDataErrorMsg: '',
        storieDataError: false,
      };

    case VIDEO_STORIES_LISTING_DATA_ERROR:
      return {
        storiesData: action.error,
        errorStoriesVersion: ++state.errorStoriesVersion,
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
      console.log("action.error", action.error);
      return {
        ...state,
        videoListErrorVersion: increment,
        videoListingError: true,
        videoErrorMsg: action.error,
      };

    case LIKE_DISLIKE_DATA_SUCCESS:
      var increment2 = ++initialState.successLikeDislikeCountVersion;

      return {
        ...state,
        isFetching: false,
        likeDislikeData: action.data,
        likeDislikeError: false,
        likeDislikeErrorMsg: '',
        successLikeDislikeCountVersion: increment2,
      };

    case LIKE_DISLIKE_DATA_ERROR:
      var increment2 = ++initialState.videoListErrorVersion;

      return {
        ...state,
        isFetching: false,
        likeDislikeData: '',
        likeDislikeError: true,
        likeDislikeErrorMsg: action.error,
        errorLikeDislikeCountVersion: increment2,
      };

    case SHARE_DATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        shareData: action.data,
        shareError: false,
        shareErrorMsg: '',
        successShareCountVersion: ++state.successShareCountVersion,
      };

    case SHARE_DATA_ERROR:
      return {
        ...state,
        isFetching: false,
        shareData: '',
        shareError: true,
        shareErrorMsg: action.error,
        errorShareCountVersion: ++state.errorShareCountVersion,
      };

    case VIDEO_LISTING_DATA_RESET_REDUCER:
      return initialState;

    default:
      return state;
  }
}
