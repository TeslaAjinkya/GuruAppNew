import { combineReducers } from 'redux';
import Common from './Common';
export default (history) => combineReducers({
    common: Common,
})