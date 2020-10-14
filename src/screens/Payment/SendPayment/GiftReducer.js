import {
  SEND_GIFT_DATA,
  SEND_GIFT_DATA_SUCCESS,
  SEND_GIFT_DATA_ERROR,
} from '@redux/types';

const initialState = {
  isFetching: false,

  getGiftData: '',
  giftError: false,
  giftErrorMsg: '',
  successGiftDataVersion: 0,
  errorGiftDataVersion: 0,
};

export default function dataReducer(state = initialState, action) {
  switch (action.type) {
    case SEND_GIFT_DATA:
      return {
        ...state,
        isFetching: true,
      };

    case SEND_GIFT_DATA_SUCCESS:
      return {
        ...state,

        isFetching: false,

        getGiftData: action.data,
        giftError: false,
        giftErrorMsg: '',
        successGiftDataVersion: ++state.successGiftDataVersion,
      };

    case SEND_GIFT_DATA_ERROR:
      return {
        ...state,
        isFetching: false,
        getGiftData: '',
        giftError: true,
        giftErrorMsg: action.error.msg,
        errorGiftDataVersion: ++state.errorGiftDataVersion,
      };

    default:
      return state;
  }
}
