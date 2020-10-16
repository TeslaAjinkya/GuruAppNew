
import { all } from "redux-saga/effects";
import { fork } from 'redux-saga/effects'

import videoListSaga from "../sagaModules/VideoList/saga";

const sagas = [videoListSaga()];

export default function* () {
    yield all(sagas);
}

