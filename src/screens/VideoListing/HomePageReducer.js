import {
  SEARCH_DATA,
  SEARCH_DATA_SUCCESS,
  SEARCH_DATA_ERROR,
  SEARCH_DATA_RESET_REDUCER,
  VIEW_PROFILE_DATA,
  VIEW_PROFILE_DATA_SUCCESS,
  VIEW_PROFILE_DATA_ERROR,
} from '@redux/types';

const initialState = {
  isFetching: false,
  searchError: false,
  searchedData: [],
  successSearchedDataVersion: 0,
  errorSearchedDataVersion: 0,
  searchErrorMsg: '',
  viewProfileData: [],
  errorViewProfile: false,
  errorViewProfileMsg: '',
  successViewProfileVersion: 0,
  errorViewProfileVersion: 0,
};

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_DATA:
      return {
        ...state,
        isFetching: true,
      };

    case SEARCH_DATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        searchedData: action.data,
        successSearchedDataVersion: ++state.successSearchedDataVersion,
        searchError: false,
      };

    case SEARCH_DATA_ERROR:
      return {
        ...state,
        isFetching: false,
        searchError: true,
        searchErrorMsg: action.data,
        errorSearchedDataVersion: ++state.errorSearchedDataVersion,
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

    case SEARCH_DATA_RESET_REDUCER:
      return initialState;

    default:
      return state;
  }
}
