import { configureStore } from "@reduxjs/toolkit";
import collection from "./collectionSlice";
import reviewCard from "./reviewCardSlice";
import user from "./userSlice";
import model from "./modalSlice";
export const store = configureStore({
  reducer: {
    collection,
    reviewCard,
    user,
    model,
  },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
