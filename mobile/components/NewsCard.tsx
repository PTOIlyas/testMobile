import React from "react";
import { Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { NewsArticle } from "@/types/news";
import { View } from "react-native-reanimated/lib/typescript/Animated";

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const router = useRouter();

  const openDetail = () => {
    router.push({
      pathname: '/news/[id]',
      params: { id: encodeURIComponent(article.url) },
    });

  };

  return (
    <TouchableOpacity
      style={styles.productItem}
      onPress={openDetail}
    >
      {article.image && (
        <Image
          source={{ uri: article.image }}
          style={styles.imageProduct}
        />
      )}
      <View style={styles.textBox}>
        <Text style={styles.productTitle}>{article.title}</Text>
        {article.source.name && article.publishedAt && (
          <Text style={styles.meta}>
            {article.source.name} • {article.publishedAt}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productItem: {
    width: 165,
    height: 180,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  imageProduct: {
    width: "100%",
    height: 120,
    borderRadius: 16,
  },

  textBox: {
    top: 5,
    justifyContent: "flex-start",
  },

  productTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },

  meta: {
    color: "#555",
  },
});


