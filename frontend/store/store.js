import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import auth from '../app/reducers/auth-reducer';

const reducers = combineReducers({
    auth
});

const store = createStore(reducers, applyMiddleware(thunk));
export default store;