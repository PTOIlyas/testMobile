import { configureStore } from "@reduxjs/toolkit";
import { newsApi } from "./services/newsApi";
import notificationsReducer from "./notificationsSlice";
import currentArticleReducer from "./slices/currentArticleSlice";

/**
 * Глобальное Redux-хранилище приложения
 * Объединяет все редьюсеры и middleware
 */
export const store = configureStore({
  reducer: {
    /**
     * RTK Query reducer для работы с новостями
     * reducerPath задаётся внутри newsApi
     */
    [newsApi.reducerPath]: newsApi.reducer,

    /**
     * Слайс уведомлений
     * Хранит список уведомлений, их статус (прочитано / не прочитано)
     */
    notifications: notificationsReducer,

    /**
     * Слайс текущей выбранной статьи
     * Используется для передачи данных статьи
     * между экранами без повторного запроса к API
     */
    currentArticle: currentArticleReducer,
  },

  /**
   * Middleware
   * Добавляем middleware RTK Query для:
   *  - кэширования запросов
   *  - автоматического refetch
   *  - управления состояниями loading/error
   */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(newsApi.middleware),
});

/**
 * Тип состояния всего Redux-хранилища
 * Используется в useSelector
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Тип dispatch-функции
 * Используется для типизированного useDispatch
 */
export type AppDispatch = typeof store.dispatch;
