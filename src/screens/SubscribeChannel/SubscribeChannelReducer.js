import {
    SUBSCRIBED_LIST_DATA,
    SUBSCRIBED_LIST_DATA_SUCCESS,
    SUBSCRIBED_LIST_DATA_ERROR,
    SUBSCRIBED_LIST_DATA_RESET_REDUCER ,

    SUBSCRIBED_CHANNEL_DATA,
    SUBSCRIBED_CHANNEL_DATA_SUCCESS,
    SUBSCRIBED_CHANNEL_DATA_ERROR,
    
    LIKE_DISLIKE_DATA,
    LIKE_DISLIKE_DATA_SUCCESS,
    LIKE_DISLIKE_DATA_ERROR,
    VIEWS_COUNT_SUCCESS,
    VIEWS_COUNT_ERROR
  } from "@redux/types";
  
  
  const initialState = {
    isFetching: false,
    subscriptionData: "",
    errorSubscription: false,
    errorMsg:"",
    successSubscriptionDataVersion: 0,
    errorSubscriptionDataVersion: 0,

    subscribedChannelData:[],
    errorSubscribedChannel:false,
    errorSubscribedChannelMsg:'',
    successSubscribedChannelDataVersion:0,
    errorSubscribedChannelDataVersion:0,

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
      case SUBSCRIBED_LIST_DATA:
        return {
          ...state,
         isFetching:true
        };
  
      case SUBSCRIBED_LIST_DATA_SUCCESS:
        
        return {
          ...state,
          isFetching: false,
          subscriptionData: action.data,
          errorSubscription: false,
          errorMsg:"",
          successSubscriptionDataVersion: ++state.successSubscriptionDataVersion,
    
         
        };
  
      case SUBSCRIBED_LIST_DATA_ERROR:
        
        return {
          ...state,
          isFetching: false,
          subscriptionData: "",
          errorSubscription: true,
          errorMsg:action.error,
          errorSubscriptionDataVersion: ++state.errorSubscriptionDataVersion,
    
        };
     

//FOR SUBSCRIBED CHANNEL(CREATOR) LIST (HORIZONTAL)ON SUBSCRIPTION PAGE
      case SUBSCRIBED_CHANNEL_DATA:
        return {
          ...state,
          isFetching: true
        };
  
      case SUBSCRIBED_CHANNEL_DATA_SUCCESS:
        
        return {
          ...state,
          isFetching: false,
          subscribedChannelData: action.data,
          errorSubscribedChannel: false,
          errorSubscribedChannelMsg:"",
          successSubscribedChannelDataVersion: ++state.successSubscribedChannelDataVersion,
        };
  
      case SUBSCRIBED_CHANNEL_DATA_ERROR:
        
        return {
          ...state,
          isFetching: false,
          subscribedChannelData: [],
          errorSubscribedChannel: true,
          errorSubscribedChannelMsg:action.error,
          errorSubscribedChannelDataVersion: ++state.errorSubscribedChannelDataVersion,
    
        };

        case LIKE_DISLIKE_DATA_SUCCESS:
          
          return {
            ...state,
            isFetching: false,
            likeDislikeData: action.data,
            likeDislikeError: false,
            likeDislikeErrorMsg: "",
            successLikeDislikeCountVersion: ++state.successLikeDislikeCountVersion
          };
    
        case LIKE_DISLIKE_DATA_ERROR:
          
          return {
            ...state,
            isFetching: false,
            likeDislikeData: "",
            likeDislikeError: true,
            likeDislikeErrorMsg: action.error,
            errorLikeDislikeCountVersion: ++state.errorLikeDislikeCountVersion
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
      
    
    //  case SUBSCRIBED_LIST_DATA_RESET_REDUCER:
    //     return initialState;
  
  
      default:
        return state;
    }
  }
  