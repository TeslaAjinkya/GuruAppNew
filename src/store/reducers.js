
// thunk reducers
import homePageReducer from "@videoListing/HomePageReducer";
import videoListingReducer from "@videoListing/VideoListingReducer";
import videoDetailsReducer from "@videoDetails/VideoDetailsReducer";
import loginReducer from '@login/LoginReducer'
import trendingReducer from '@trending/TrendingReducer'
import subscribeChannelReducer from '@subscribeChannel/SubscribeChannelReducer'
import postVideoReducer from '@post/PostVideoReducer'
import profileReducer from '@profile/ProfileReducer'
import userDetailsReducer from '@register/UserDetailsReducer'
import viewBalanceReducer from '@viewBalance/ViewBalanceReducer'
import sendPaymentReducer from '@sendPayment/SendPaymentReducer'
import giftReducer from '@sendPayment/GiftReducer'
import transactionReducer from '@transactions/TransactionsReducer'
import registerReducer from '@registerTabs/RegisterReducer'

import videoListingReducerSaga from '../sagaModules/VideoList'

export default {
    //   auth: AuthReducer,
    homePageReducer,
    videoListingReducer,
    videoDetailsReducer,
    loginReducer,
    trendingReducer,
    subscribeChannelReducer,
    postVideoReducer,
    profileReducer,
    userDetailsReducer,
    viewBalanceReducer,
    sendPaymentReducer,
    giftReducer,
    registerReducer,
    transactionReducer,
    videoListingReducerSaga
};
