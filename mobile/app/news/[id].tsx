import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import { useGetNewsQuery } from '@/store/services/newsApi';
import { NewsArticle } from '@/types/news';

export default function NewsDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const articleUrl = id ? decodeURIComponent(id) : "";

  const { data, isLoading, error } = useGetNewsQuery({
    query: "technology",
    page: 1
  });

  // Ищем статью по URL
  const article: NewsArticle | undefined = data?.articles.find(
    (a) => a.url === articleUrl
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading article...</Text>
      </View>
    );
  }

  if (error || !article) {
    return (
      <View style={styles.center}>
        <Text>Article not found or failed to load.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView source={{ uri: article.url }} style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
});
