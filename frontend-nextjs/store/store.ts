import {
  applyMiddleware,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import collection from "./collectionSlice";
import reviewCard from "./reviewCardSlice";
import user from "./userSlice";
import model from "./modalSlice";
import localStorage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { PersistGate } from "redux-persist/integration/react";
import { PersistConfig } from "redux-persist/es/types"; // Import the PersistConfig type
import { persistReducer, persistStore } from "redux-persist";
import auth from "./authSilce";
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { authApi } from "./RTK-query/authApi";
import { userApi } from "./RTK-query/userApi";
import { collectionApi } from "./RTK-query/collectionApi";
import createNewCollection from "./createCollectionSlice";
const rootReducer = combineReducers({
  collection,
  reviewCard,
  user,
  model,
  createNewCollection,
  auth,
});

import thunk from "redux-thunk";
import { CollectionGraphqlApi } from "./graphql/COLLECTION.modify";
// Create GQL client (or any extra argument)

const persistConfig = {
  key: "root",
  whitelist: ["auth"], // Specify which reducers should be persisted
  storage: localStorage, // You can use other storages like sessionStorage, AsyncStorage (for React Native), etc.
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

// const apiReducer = combineReducers({
//   [authApi.reducerPath]: authApi.reducer,
// });

export const store = configureStore({
  reducer: {
    persistedReducer,
    // apiReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [CollectionGraphqlApi.reducerPath]: CollectionGraphqlApi.reducer,
    [collectionApi.reducerPath]: collectionApi.reducer,
  },

  // devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      userApi.middleware,
      CollectionGraphqlApi.middleware,
      collectionApi.middleware
    ),
});

// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export const persistor = persistStore(store);
