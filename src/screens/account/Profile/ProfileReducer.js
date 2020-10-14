import {
  VIEW_PROFILE_DATA,
  VIEW_PROFILE_DATA_SUCCESS,
  VIEW_PROFILE_DATA_ERROR,
  UPDATE_PROFILE_DATA,
  UPDATE_PROFILE_DATA_SUCCESS,
  UPDATE_PROFILE_DATA_ERROR,
} from '@redux/types';

const initialState = {
  isFetching: false,
  viewProfileData: [],
  errorViewProfile: false,
  errorViewProfileMsg: '',
  successViewProfileVersion: 0,
  errorViewProfileVersion: 0,

  updateProfileData:[],
  errorUpdateProfile:false,
  errorUpdateProfileMsg:'',
  successUpdateProfileVersion:0,
  errorUpdateProfileVersion:0,
  successUpdateProfileMsg:''
};

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case VIEW_PROFILE_DATA:
      return {
        ...state,
        isFetching: true,
      };

    case VIEW_PROFILE_DATA_SUCCESS:
      return {
        ...state,

        isFetching: false,
        viewProfileData: action.data,
        errorViewProfile: false,
        errorViewProfileMsg: '',
        successViewProfileVersion: ++state.successViewProfileVersion,
      };

    case VIEW_PROFILE_DATA_ERROR:
      return {
        ...state,
        isFetching: false,
        viewProfileData: [],
        errorViewProfile: true,
        errorViewProfileMsg: action.error,
        errorViewProfileVersion: ++state.errorViewProfileVersion,
      };

      case UPDATE_PROFILE_DATA:
        return {
          ...state,
          isFetching: true,
        };
  
      case UPDATE_PROFILE_DATA_SUCCESS:        
        return {
          ...state,
          isFetching: false,
          updateProfileData: action.data,
          errorUpdateProfile: false,
          successUpdateProfileMsg: action.data.msg,
          successUpdateProfileVersion: ++state.successUpdateProfileVersion,
        };
  
      case UPDATE_PROFILE_DATA_ERROR:
        return {
          ...state,
          isFetching: false,
          updateProfileData: [],
          errorUpdateProfile: true,
          errorUpdateProfileMsg: action.error,
          errorUpdateProfileVersion: ++state.errorUpdateProfileVersion,
        };
  
    default:
      return state;
  }
}
