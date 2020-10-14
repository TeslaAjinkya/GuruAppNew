import {
  VIDEO_DETAILS_DATA,
  VIDEO_DETAILS_DATA_SUCCESS,
  VIDEO_DETAILS_DATA_ERROR,
  VIDEO_DETAILS_RESET_REDUCER,
  VIDEO_DETAILS_OTHER_DATA,
  VIDEO_DETAILS_OTHER_DATA_SUCCESS,
  VIDEO_DETAILS_OTHER_DATA_ERROR,
  VIDEO_DETAILS_OTHER_DATA_RESET_REDUCER,
  LIKE_DISLIKE_DATA,
  LIKE_DISLIKE_DATA_SUCCESS,
  LIKE_DISLIKE_DATA_ERROR,
  // LIKEDISLIKE_DETAILS_DATA,
  // LIKEDISLIKE_DETAILS_DATA_SUCCESS,
  // LIKEDISLIKE_DETAILS_DATA_ERROR,
  // LIKEDISLIKE_DETAILS_DATA_RESET_REDUCER,
  SUBSCRIPTION_DATA,
  SUBSCRIPTION_DATA_SUCCESS,
  SUBSCRIPTION_DATA_ERROR,
  SUBSCRIPTION_DATA_RESET_REDUCER,
  SUBSCRIBED_DATA,
  SUBSCRIBED_DATA_SUCCESS,
  SUBSCRIBED_DATA_ERROR,
  SUBSCRIBED_DATA_RESET_REDUCER,
  VIEWS_COUNT_SUCCESS,
  VIEWS_COUNT_ERROR,
  GIFT_LIST_DATA_SUCCESS,
  GIFT_LIST_DATA_ERROR,
  SEND_GIFT_DATA,
  SEND_GIFT_DATA_SUCCESS,
  SEND_GIFT_DATA_ERROR,
} from '@redux/types';

const initialState = {
  isFetching: false,
  data: '',
  error: false,
  successVideoDetailsDataVersion: 0,
  errorVideoDetailsDataVersion: 0,

  otherCategoryData: [],
  otherCategoryError: false,
  otherCategoryErrorMSg: '',
  successCategoryDataVersion: 0,
  errorCategoryDataVersion: 0,

  likeDislikeData: '',
  likeDislikeError: false,
  likeDislikeErrorMsg: '',
  errorLikeDislikeCountVersion: 0,
  successLikeDislikeCountVersion: 0,

  isSubscribed: '',
  subscriptionSuccessCountVersion: 0,
  subscriptionErrorCountVersion: 0,
  subscriptionError: false,
  subscriptionErrorMsg: '',

  subscribed: '',
  subscribedSuccessVersion: 0,
  subscribedErrorVersion: 0,
  subscribedErrorMsg: '',
  subscribedError: false,

  videoViewsData: '',
  videoViewsError: false,
  videoViewsErrorMsg: '',
  errorVideoViewsVersion: 0,
  successVideoViewsVersion: 0,

  giftData: '',
  successGiftVersion: 0,
  errorGiftVersion: 0,
  giftError: false,
  giftErrorMsg: '',

  getGiftData: '',
  giftSendError: false,
  giftSendErrorMsg: '',
  successGiftDataVersion: 0,
  errorGiftDataVersion: 0,
};

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case VIDEO_DETAILS_DATA:
      return {
        ...state,
        isFetching: true,
      };

    case VIDEO_DETAILS_DATA_SUCCESS:
      var increment = ++initialState.successVideoDetailsDataVersion;
      return {
        ...state,
        isFetching: false,
        data: action.data,
        error: false,
        successVideoDetailsDataVersion: increment,
      };

    case VIDEO_DETAILS_DATA_ERROR:
      var increment = ++initialState.errorVideoDetailsDataVersion;
      return {
        ...state,
        isFetching: false,
        error: true,
        errorMsg: action.error.msg,
        errorVideoDetailsDataVersion: incrementn,
      };

    case VIDEO_DETAILS_OTHER_DATA_SUCCESS:
      var increment = ++initialState.successCategoryDataVersion;
      return {
        ...state,
        otherCategoryData: action.data,
        otherCategoryError: false,
        otherCategoryErrorMSg: '',
        successCategoryDataVersion: increment,
        isFetching: false,
      };

    case VIDEO_DETAILS_OTHER_DATA_ERROR:
      return {
        ...state,
        otherCategoryData: '',
        otherCategoryError: true,
        otherCategoryErrorMSg: action.data,
        errorCategoryDataVersion: ++state.errorCategoryDataVersion,
        isFetching: false,
      };

    case LIKE_DISLIKE_DATA_SUCCESS:
      var increment = ++initialState.successLikeDislikeCountVersion;
      return {
        ...state,
        isFetching: false,
        likeDislikeData: action.data,
        likeDislikeError: false,
        likeDislikeErrorMsg: '',
        successLikeDislikeCountVersion: increment,
      };

    case LIKE_DISLIKE_DATA_ERROR:
      var increment = ++initialState.errorLikeDislikeCountVersion;
      return {
        ...state,
        isFetching: false,
        likeDislikeData: '',
        likeDislikeError: true,
        likeDislikeErrorMsg: action.error.msg,
        errorLikeDislikeCountVersion: increment,
      };

    // case LIKEDISLIKE_DETAILS_DATA_SUCCESS:
    //   return {
    //     ...state,
    //     isFetching: false,
    //     likeDislikeData:action.data,
    //     likeDislikeError:false,
    //     likeDislikeErrorMsg: "",
    //     successLikeDislikeCountVersion:++state.successLikeDislikeCountVersion
    //   };

    // case LIKEDISLIKE_DETAILS_DATA_ERROR:
    //   return {
    //     ...state,
    //     isFetching: false,
    //     likeDislikeData:"",
    //     likeDislikeError:true,
    //     likeDislikeErrorMsg: "",
    //     errorLikeDislikeCountVersion:++state.errorLikeDislikeCountVersion
    //   }

    case SUBSCRIPTION_DATA_SUCCESS:
      var increment = ++initialState.subscriptionSuccessCountVersion;
      return {
        ...state,
        isSubscribed: action.data,
        subscriptionSuccessCountVersion: increment,
        subscriptionError: false,
        subscriptionErrorMsg: '',
      };

    case SUBSCRIPTION_DATA_ERROR:
      var increment = ++initialState.subscriptionErrorCountVersion;
      return {
        ...state,
        isSubscribed: '',
        subscriptionErrorCountVersion: increment,
        subscriptionError: true,
        subscriptionErrorMsg: action.error.msg,
      };

    case SUBSCRIBED_DATA_SUCCESS:
      var increment = ++initialState.subscribedSuccessVersion;
      return {
        ...state,
        subscribed: action.data,
        subscribedSuccessVersion: increment,
        subscribedErrorMsg: '',
        subscribedError: false,
      };

    case SUBSCRIBED_DATA_ERROR:
      var increment = ++initialState.subscribedErrorVersion;
      return {
        ...state,
        subscribed: '',
        subscribedErrorVersion: increment,
        subscribedErrorMsg: action.error.msg,
        subscribedError: true,
      };

    case VIEWS_COUNT_SUCCESS:
      var increment = ++initialState.successVideoViewsVersion;
      return {
        ...state,
        videoViewsData: action.data,
        successVideoViewsVersion: increment,
        videoViewsErrorMsg: '',
        videoViewsError: false,
      };

    case VIEWS_COUNT_ERROR:
      var increment = ++initialState.errorVideoViewsVersion;
      return {
        ...state,
        videoViewsData: '',
        errorVideoViewsVersion: increment,
        videoViewsErrorMsg: action.error.msg,
        videoViewsError: true,
      };

    case GIFT_LIST_DATA_SUCCESS:
      var increment = ++initialState.successGiftVersion;

      return {
        isFetching: false,
        giftData: action.data.giftData,
        successGiftVersion: increment,
        giftError: false,
        giftErrorMsg: '',
      };

    case GIFT_LIST_DATA_ERROR:
      var increment = ++initialState.errorGiftVersion;
      return {
        isFetching: false,
        errorGiftVersion: ++state.errorGiftVersion,
        giftError: true,
        giftErrorMsg: action.error.msg,
      };


      case SEND_GIFT_DATA_SUCCESS:
      var increment  = ++initialState.successGiftDataVersion
      
      return {
        ...state,

        isFetching: false,

        getGiftData: action.data,
        giftSendError: false,
        giftSendErrorMsg: '',
        successGiftDataVersion: increment,
      };

    case SEND_GIFT_DATA_ERROR:
      var increment  = ++initialState.errorGiftDataVersion
      
      return {
        ...state,
        isFetching: false,
        getGiftData: '',
        giftSendError: true,
        giftSendErrorMsg: action.error.msg,
        errorGiftDataVersion: increment,
      };

    case VIDEO_DETAILS_RESET_REDUCER:
      return initialState;

    default:
      return state;
  }
}
