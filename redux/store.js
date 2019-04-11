
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { persistStore, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/es/storage'

import combineReducers from './reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const config = { key: 'root', storage, blacklist: [] }

const combinedReducer = persistCombineReducers(config, combineReducers)
const loggerMiddleware = createLogger()
const middleware = [thunk]

// if (__DEV__) middleware.push(loggerMiddleware)

const configureStore = composeEnhancers(applyMiddleware(...middleware))(createStore)

export default createAppStore = () => {
    let store = configureStore(combinedReducer)
    let persistor = persistStore(store, () => store.getState())
    return { persistor, store }
}
