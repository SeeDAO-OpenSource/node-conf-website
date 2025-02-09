import {configureStore} from "@reduxjs/toolkit";
import mainReducer from "./reducer";
import storageSession from 'redux-persist/lib/storage/session';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'

const persistConfig = {
    key: "root",
    storage:storageSession,
    blacklist: ["loading"],
};
const persistedReducer = persistReducer(persistConfig, mainReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            }
        }),
})

export const persistor = persistStore(store)
export default store;
