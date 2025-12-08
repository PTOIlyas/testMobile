import React from "react";
import { Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { NewsArticle } from "@/types/news";

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const router = useRouter();

  const openDetail = () => {
    // Вместо router.push(...)
    router.push({
      pathname: '/news/[id]',
      params: { id: encodeURIComponent(article.url) },
    });

  };

  return (
    <TouchableOpacity onPress={openDetail} style={styles.container}>
      <Text style={styles.title}>{article.title}</Text>

      {article.image || article.urlToImage ? (
        <Image
          source={{ uri: article.image ?? article.urlToImage ?? undefined }}
          style={styles.image}
        />
      ) : null}

      <Text style={styles.description}>{article.description}</Text>
      <Text style={styles.date}>
        {new Date(article.publishedAt).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: { fontWeight: "700", marginBottom: 6, fontSize: 16 },
  image: { width: "100%", height: 180, borderRadius: 8, marginBottom: 8 },
  description: { color: "#444", marginBottom: 6 },
  date: { color: "#888", fontSize: 12 },
});
