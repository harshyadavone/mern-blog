import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice'; // Assuming it's a slice reducer
import themeReducer from './theme/themeSlice';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import persistStore from 'redux-persist/es/persistStore';

const rootReducer = combineReducers({
    user: userReducer, // Use userReducer instead of useReducer
    theme: themeReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer, // Use persistedReducer as the root reducer
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
