import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { EXPO_PUBLIC_NEWS_API_KEY } from '@env';

const apiKey = EXPO_PUBLIC_NEWS_API_KEY;

export interface GNewsArticle {
  title: string;
  description: string;
  url: string;
  image: string | null;
  publishedAt: string;
}

export interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

export const newsApi = createApi({
  reducerPath: 'newsApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://gnews.io/api/v4/',
  }),

  endpoints: (builder) => ({
    getNews: builder.query<GNewsResponse, { page?: number; query?: string }>({
      query: ({ page = 1, query = "technology" }) => ({
        url: 'search',
        params: {
          q: query,
          max: 10,
          page,
          lang: "en",
          token: apiKey,  // Или apikey, если требует API (проверь)
        },
      }),

      transformResponse: (response: any) => {
        console.log("🔥 GNEWS RESPONSE:", response);
        return response;
      },
    }),
  }),
});

export const { useGetNewsQuery } = newsApi;
