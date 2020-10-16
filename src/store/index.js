import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import createSagaMiddleware from 'redux-saga';
import sagas from './sagas';
import reducers from './reducers';
import ReduxThunk from 'redux-thunk'

const sagaMiddleware = createSagaMiddleware();

// const middlewares = [sagaMiddleware, ReduxThunk];

const composedEnhancers = composeWithDevTools(
    applyMiddleware(...[sagaMiddleware, ReduxThunk])
);

const reducer = combineReducers(reducers);

export const store = createStore(reducer, composedEnhancers);

sagaMiddleware.run(sagas);


// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


// export default function configureStore(initialState) {
//     const store = createStore(reducers(), initialState,
//         composeEnhancers(applyMiddleware(...middlewares)));

//     sagaMiddleware.run(rootSaga);

//     if (module.hot) {
//         // Enable Webpack hot module replacement for reducers
//         module.hot.accept('../reducers/index', () => {
//             const nextRootReducer = require('../reducers/index');
//             store.replaceReducer(nextRootReducer);
//         });
//     }
//     return store;
// }
