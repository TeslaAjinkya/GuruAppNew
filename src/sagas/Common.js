import { all, call, fork, put, takeLatest, takeEvery } from "redux-saga/effects";
import {
    VIDEO_LISTING_DATA,
    VIDEO_LISTING_DATA_SUCCESS,
    VIDEO_LISTING_DATA_ERROR,
    VIDEO_LISTING_DATA_RESET_REDUCER,
} from '../actionTypes/actionTypes'

import { videoListSuccess, videoListError } from '../actions/common'

import { strings } from '@values/strings';

import _ from 'lodash';

import axios from 'axios';
import urls from '../api/urls';
import apiManager from "../api/apiManager";

const configTwo = {
    headers: {
        'Content-Type': 'application/json',
    },
};



function* getVideoListFunction({ payload }) {
    console.log("getVideoListFunstion", payload.data.requestBody);

    const data = payload
    try {
        const response = yield apiManager.post(
            "videolist",
            { data },
            { headers: configTwo }
        );

        if (response.data.success == true && (response.data.videoData !== [] && response.data.videoData !== undefined)) {
            yield put(videoListSuccess(response.data.videoData));
        }
        else if (response.data.success == true && response.data.msg !== "") {
            yield put(videoListSuccess([]));
        }
        else {
            yield put(videoListError(response.data));
        }

    } catch (errorCatch) {
        console.log("errorCatch", errorCatch);
        yield put(videoListError(strings.serverFailedMsg));
    }
}


export function* getVideoListDispatcher() {
    yield takeLatest(VIDEO_LISTING_DATA, getVideoListFunction)
}



export default function* rootSaga() {
    console.log("rootSaga");
    yield all([
        fork(getVideoListDispatcher)
    ])
}