import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { NewsResponse } from '@/types/news';

/**
 * API-ключ берётся из переменных окружения Expo
 * EXPO_PUBLIC_NEWS_API_KEY прописывается в .env
 */
const apiKey = process.env.EXPO_PUBLIC_NEWS_API_KEY;

/**
 * newsApi — RTK Query API-слайс для работы с новостями
 * Используется для получения данных с внешнего сервиса GNews
 */
export const newsApi = createApi({
  /**
   * Уникальный ключ редьюсера,
   * под которым RTK Query будет хранить данные в store
   */
  reducerPath: 'newsApi',

  /**
   * Базовая настройка запроса
   * baseUrl — корневой URL API
   */
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://gnews.io/api/v4/',
  }),

  /**
   * Описание всех эндпоинтов API
   */
  endpoints: (builder) => ({
    /**
     * getNews — запрос для получения списка новостей
     *
     * Аргументы:
     *  - page: номер страницы (пагинация)
     *  - query: поисковый запрос или категория
     */
    getNews: builder.query<NewsResponse, { page?: number; query?: string }>({
      /**
       * Формирование HTTP-запроса
       */
      query: ({ page = 1, query = "technology" }) => ({
        url: 'search',
        params: {
          q: query,          // поисковый запрос
          max: 10,           // количество новостей на страницу
          page,              // номер страницы
          lang: "en",        // язык новостей
          token: apiKey,     // API-ключ
        },
      }),

      /**
       * transformResponse
       * Преобразует "сырые" данные от API
       * в формат, удобный для приложения
       */
      transformResponse: (response: any): NewsResponse => {
        return {
          totalArticles: response.totalArticles,

          /**
           * Приведение структуры статьи к внутреннему типу NewsArticle
           */
          articles: response.articles.map((a: any) => ({
            id: a.id.toString(),          // id приводится к строке
            title: a.title,
            description: a.description,
            url: a.url,
            image: a.image ?? null,       // если изображения нет — null
            publishedAt: a.publishedAt,
            source: {
              name: a.source?.name ?? "Unknown", // защита от undefined
            },
          })),
        };
      },
    }),
  }),
});

/**
 * Хук, автоматически сгенерированный RTK Query
 * Используется в компонентах для получения новостей
 *
 * Пример:
 * const { data, isLoading, error } = useGetNewsQuery({ page: 1, query: "sports" })
 */
export const { useGetNewsQuery } = newsApi;
