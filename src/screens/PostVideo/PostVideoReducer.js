import {
    POST_VIDEO_DATA,
    POST_VIDEO_DATA_SUCCESS,
    POST_VIDEO_DATA_ERROR,
    POST_VIDEO_DATA_RESET_REDUCER,
    VIDEO_CATEGORY_LISTING_DATA_SUCCESS,
    VIDEO_CATEGORY_LISTING_DATA_ERROR,
    GET_PROFILE_DATA_ERROR,
    GET_PROFILE_DATA_SUCCESS,
    GET_PROFILE_DATA
  } from "@redux/types";
  
  
  const initialState = {
    isFetching: false,
    isFetchingTwo: false,

    postVideoData: [],
    errorPostVideo: false,
    errorPostMsg:"",
    successPostVideoVersion: 0,
    errorPostVideoVersion: 0,

    categoryData: '',
    successCategoryVersion: 0,
    errorCategoryDataVersion: 0,
    CatgoryDataErrorMsg: '',
    CategoryDataError: false,

    viewProfileData: [],
    errorViewProfile: false,
    errorViewProfileMsg: '',
    successViewProfileVersion: 0,
    errorViewProfileVersion: 0,
  };
  
  export default function dataReducer(state = initialState, action) {
    switch (action.type) {
      case POST_VIDEO_DATA:
        return {
          ...state,
          isFetchingTwo:true
        };

        case GET_PROFILE_DATA:
          return {
            ...state,
           isFetching:true
          };
  
      case POST_VIDEO_DATA_SUCCESS:
        
        return {
          ...state,
          isFetchingTwo: false,
          postVideoData: action.data,
          errorPostVideo: false,
          errorPostMsg:"",
          successPostVideoVersion: ++state.successPostVideoVersion,
        };
  
      case POST_VIDEO_DATA_ERROR:
        
        return {
          ...state,
          isFetchingTwo: false,
          postVideoData: "",
          errorPostVideo: true,
          errorPostMsg:action.error,
          errorPostVideoVersion: ++state.errorPostVideoVersion,
    
        };
     
        case VIDEO_CATEGORY_LISTING_DATA_SUCCESS:
          return {
            ...state,
            isFetching: false,
            categoryData: action.data,
            successCategoryVersion: ++state.successCategoryVersion,
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
        
    
          case GET_PROFILE_DATA_SUCCESS:            
            return {
              ...state,
              isFetching: false,
              viewProfileData: action.data,
              errorViewProfile: false,
              errorViewProfileMsg: '',
              successViewProfileVersion: ++state.successViewProfileVersion,
            };
      
          case GET_PROFILE_DATA_ERROR:
            return {
              ...state,
              isFetching: false,
              viewProfileData: [],
              errorViewProfile: true,
              errorViewProfileMsg: action.error,
              errorViewProfileVersion: ++state.errorViewProfileVersion,
            };

     case POST_VIDEO_DATA_RESET_REDUCER:
        return initialState;
  
      default:
        return state;
    }
  }
  