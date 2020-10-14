import { all } from 'redux-saga/effects';
import Common from './Common';

export default function* rootSaga(getState) {
    yield all([
        Common()
    ]);
}
