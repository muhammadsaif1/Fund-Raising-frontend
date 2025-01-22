import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import postsReducer from "./post-slice";
import CommentsReducer from "./comment-slice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    comments: CommentsReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
