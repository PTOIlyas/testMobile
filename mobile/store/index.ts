import { configureStore } from "@reduxjs/toolkit";
import { newsApi } from "./services/newsApi";
import notificationsReducer from "./notificationsSlice";


export const store = configureStore({
  reducer: {
    [newsApi.reducerPath]: newsApi.reducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(newsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
