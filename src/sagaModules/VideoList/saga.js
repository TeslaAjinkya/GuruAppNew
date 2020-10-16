import { takeLatest, put, select, call } from "redux-saga/effects";
// import { AsyncStorage } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';

import {
    getVideoList,
    videoListingDataSuccess,
    requestStart,
    videoListingDataError,
    getCategory,
    getCategorySuccess,
    getCategoryError,
    getLikeDislikeCount,
    getLikeDislikeCountSuccess,
    getLikeDislikeCountError,
    getShareCount,
    getShareCountSuccess,
    getShareCountError,
    getStories,
    getStoriesSuccess,
    getStoriesError
} from ".";
import apiManager from "../../api/apiManager";
import { strings } from '@values/strings';


const configTwo = {
    headers: {
        'Content-Type': 'application/json',
    },
};



function* getVideoListWorker({ payload }) {
    const { categoryId, startLimit, userId } = payload.payload

    console.log(categoryId, startLimit, userId);
    yield put(requestStart());

    try {
        const { data } = yield apiManager.post(
            "/videolist",
            {
                payload: {
                    categoryId: categoryId,
                    startLimit: startLimit,
                    userId: userId
                }
            },
            { headers: configTwo }
        );

        console.log("videolist data", data);

        if (data.success == true && (data.videoData !== [] && data.videoData !== undefined)) {
            yield put(videoListingDataSuccess(data.videoData));
        }
        else if (data.success == true && data.msg !== "") {
            yield put(videoListingDataSuccess([]));
        }
        else {
            yield put(videoListingDataError(data));
        }

    } catch (errorCatch) {
        console.log("errorCatch", errorCatch);
        yield put(videoListingDataError(strings.serverFailedMsg));
    }
}


function* getCategoryWorker({ }) {

    yield put(requestStart());

    try {
        const { data } = yield apiManager.get(
            "/categorylist",
            {},
            { headers: configTwo }
        );

        if (data.success == true && data.category.length !== 0) {
            yield put(getCategorySuccess(data.category));
        }
        else {
            yield put(getCategoryError(data));
        }

    } catch (errorCatch) {
        console.log("errorCatch", errorCatch);
        yield put(getCategoryError(strings.serverFailedMsg));
    }
}


function* getLikeDislikeCountWorker({ payload }) {
    const { userId, videoId, operation, action } = payload.payload

    try {
        const { data } = yield apiManager.post(
            "/videooperations",
            {
                payload: {
                    userId: userId,
                    videoId: videoId,
                    operation: operation,
                    action: action
                }
            },
            { headers: configTwo }
        );


        if (data.success) {
            yield put(getLikeDislikeCountSuccess(data));
        }
        else {
            yield put(getLikeDislikeCountError(data));
        }

    } catch (errorCatch) {
        console.log("errorCatch", errorCatch);
        yield put(getLikeDislikeCountError(strings.serverFailedMsg));
    }
}



function* getShareCountWorker({ payload }) {
    const { userId, videoId } = payload.payload

    try {
        const { data } = yield apiManager.post(
            "/share",
            {
                userId: userId,
                videoId: videoId,
            },
            { headers: configTwo }
        );

        if (data.success) {
            yield put(getShareCountSuccess(data));
        }
        else {
            yield put(getShareCountError(data));
        }

    } catch (errorCatch) {
        console.log("errorCatch", errorCatch);
        yield put(getShareCountError(strings.serverFailedMsg));
    }
}


function* getStoriesWorker({ }) {
    console.log("getStoriesWorker");
    try {
        const { data } = yield apiManager.get(
            "/stories",
            {},
            { headers: configTwo }
        );

        console.log("getStoriesWorker data", data);

        if (data.success && (data.stories !== [] && data.stories !== undefined)) {
            yield put(getStoriesSuccess(data.stories));
        }
        else yield put(getStoriesError(data))

    } catch (errorCatch) {
        console.log("errorCatch", errorCatch);
        yield put(getStoriesError(strings.serverFailedMsg));
    }
}


export default function* () {
    yield takeLatest(getVideoList, getVideoListWorker);
    yield takeLatest(getCategory, getCategoryWorker);
    yield takeLatest(getLikeDislikeCount, getLikeDislikeCountWorker);
    yield takeLatest(getShareCount, getShareCountWorker);
    yield takeLatest(getStories, getStoriesWorker);


}