import {
    TRENDING_DATA,
    TRENDING_DATA_SUCCESS,
    TRENDING_DATA_ERROR,
    TRENDING_DATA_RESET_REDUCER,
    LIKE_DISLIKE_DATA,
    LIKE_DISLIKE_DATA_SUCCESS,
    LIKE_DISLIKE_DATA_ERROR,
    VIEWS_COUNT_SUCCESS,
    VIEWS_COUNT_ERROR
  } from "@redux/types";
  
  
  const initialState = {
    isFetching: false,
    trendingData: "",
    errorTrending: false,
    errorMsg:"",
    successTrendingDataVersion: 0,
    errorTrendingDataVersion: 0,

    likeDislikeData: '',
    likeDislikeError: false,
    likeDislikeErrorMsg: '',
    errorLikeDislikeCountVersion: 0,
    successLikeDislikeCountVersion: 0,

    videoViewsData: '',
    videoViewsError: false,
    videoViewsErrorMsg: '',
    errorVideoViewsVersion: 0,
    successVideoViewsVersion: 0
  };
  
  export default function dataReducer(state = initialState, action) {
    switch (action.type) {
      case TRENDING_DATA:
        
        return {
          ...state,
         isFetching:true
        };
  
      case TRENDING_DATA_SUCCESS:
        return {
          ...state,
         isFetching:false,
          errorTrending: false,
          trendingData: action.data,
          errorMsg:"",
          successTrendingDataVersion: ++state.successTrendingDataVersion
        };
  
      case TRENDING_DATA_ERROR:
        return {
          ...state,
          errorTrending: true,
          trendingData:"",
          isFetching:false,
          errorTrendingDataVersion:++state.errorTrendingDataVersion,
          errorMsg: action.error,

        };

        case LIKE_DISLIKE_DATA_SUCCESS:
          
          return {
            ...state,
            isFetching: false,
            likeDislikeData: action.data,
            likeDislikeError: false,
            likeDislikeErrorMsg: '',
            successLikeDislikeCountVersion: ++state.successLikeDislikeCountVersion,
          };
    
        case LIKE_DISLIKE_DATA_ERROR:
          
          return {
            ...state,
            isFetching: false,
            likeDislikeData: '',
            likeDislikeError: true,
            likeDislikeErrorMsg: action.error,msg,
            errorLikeDislikeCountVersion: ++state.errorLikeDislikeCountVersion,
          };

          case VIEWS_COUNT_SUCCESS:
            
            return {
              ...state,
              videoViewsData: action.data,
              successVideoViewsVersion: ++state.successVideoViewsVersion,
              videoViewsErrorMsg: "",
              videoViewsError: false
            }
      
          case VIEWS_COUNT_ERROR:
            return {
              ...state,
              videoViewsData: "",
              errorVideoViewsVersion: ++state.errorVideoViewsVersion,
              videoViewsErrorMsg: action.error.msg,
              videoViewsError: true
            }
      

  
    //  case TRENDING_DATA_RESET_REDUCER:
    //     return initialState;
  
      default:
        return state;
    }
  }
  