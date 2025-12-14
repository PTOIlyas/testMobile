import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { NewsResponse } from '@/types/news';

const apiKey = process.env.EXPO_PUBLIC_NEWS_API_KEY;


export const newsApi = createApi({
  reducerPath: 'newsApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://gnews.io/api/v4/',
  }),

  endpoints: (builder) => ({
    getNews: builder.query<NewsResponse, { page?: number; query?: string }>({
      query: ({ page = 1, query = "technology" }) => ({
        url: 'search',
        params: {
          q: query,
          max: 10,
          page,
          lang: "en",
          token: apiKey,
        },
      }),

     
      transformResponse: (response: any): NewsResponse => {

        return {
          totalArticles: response.totalArticles,
          articles: response.articles.map((a: any) => ({
            id: a.id.toString(),
            title: a.title,
            description: a.description,
            url: a.url,
            image: a.image ?? null,
            publishedAt: a.publishedAt,
            source: {
              name: a.source?.name ?? "Unknown",
            },
          })),
        };
      },
    }),
  }),
});

export const { useGetNewsQuery } = newsApi;
