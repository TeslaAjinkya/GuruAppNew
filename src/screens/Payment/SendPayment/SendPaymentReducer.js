import {
  VIEW_BALANCE_DATA,
  VIEW_BALANCE_DATA_SUCCESS,
  VIEW_BALANCE_DATA_ERROR,
 
} from '@redux/types';

const initialState = {
  isFetching: false,
  viewBalanceData: [],
  errorViewBalance: false,
  errorViewBalanceMsg: '',
  successViewBalanceVersion: 0,
  errorViewBalanceVersion: 0,

  getGiftData: '',
  giftError: false,
  giftErrorMsg: '',
  successGiftDataVersion: 0,
  errorGiftDataVersion: 0,
};

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case VIEW_BALANCE_DATA:
      return {
        ...state,
        isFetching: true,
      };

    case VIEW_BALANCE_DATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        viewBalanceData: action.data,
        errorViewBalance: false,
        errorViewBalanceMsg: '',
        successViewBalanceVersion: ++state.successViewBalanceVersion,
      };

    case VIEW_BALANCE_DATA_ERROR:
      return {
        ...state,
        isFetching: false,
        viewBalanceData: '',
        errorViewBalance: true,
        errorViewBalanceMsg: action.error.msg,
        errorViewBalanceVersion: ++state.errorViewBalanceVersion,
      };


    default:
      return state;
  }
}
