import React, { useState, useEffect } from "react";
import { View, FlatList, ActivityIndicator, Text, RefreshControl } from "react-native";
import { useGetNewsQuery } from "@/store/services/newsApi";
import { NewsCard } from "@/components/NewsCard";
import { NewsArticle } from "@/types/news";

export default function NewsListScreen() {
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  const { data, error, isLoading, refetch, isFetching } = useGetNewsQuery({ page });

  useEffect(() => {
    if (data?.articles) {
      setArticles(prev => page === 1 ? data.articles : [...prev, ...data.articles]);
    }
  }, [data, page]);

  if (isLoading && page === 1) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Загрузка...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Ошибка загрузки новостей</Text>
        <Text onPress={() => refetch()} style={{ color: "blue", marginTop: 8 }}>
          Повторить
        </Text>
      </View>
    );
  }

  if (!articles.length) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Новостей нет</Text>
        <Text onPress={() => refetch()} style={{ color:'blue', marginTop: 8 }}>
          Повторить загрузку
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={articles}
      keyExtractor={(item) => item.url}
      renderItem={({ item }) => <NewsCard article={item} />}

      onEndReached={() => setPage((p) => p + 1)}
      onEndReachedThreshold={0.5}

      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={() => {
            setPage(1);
            setArticles([]);  // сбрасываем статьи при обновлении
            refetch();
          }}
        />
      }

      ListFooterComponent={
        isFetching && page > 1 ? (
          <ActivityIndicator style={{ marginVertical: 16 }} />
        ) : null
      }
    />
  );
}
