import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { NewsArticle } from "@/types/news";

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const router = useRouter();

  const openDetail = () => {
    router.push({
      pathname: "/news/[id]",
      params: { id: encodeURIComponent(article.id) },
    });
  };

  return (
    <TouchableOpacity style={styles.productItem} onPress={openDetail}>
      {article.image && (
        <Image source={{ uri: article.image }} style={styles.imageProduct} />
      )}
      <View style={styles.textBox}>
        <Text
          style={styles.productTitle}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {article.title}
        </Text>

        <TouchableOpacity onPress={openDetail}>
          <Text style={styles.readMore}>Дальше</Text>
        </TouchableOpacity>

        {article.source.name && article.publishedAt && (
          <>
            <Text style={styles.meta}>{article.source.name}</Text>
            <Text style={styles.meta}>{article.publishedAt}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productItem: {
    width: 175,
    height: 240,
    padding: 8,
    backgroundColor: "#ffffffff",
    borderRadius: 16,
    // marginBottom: 5,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 2,
  },

  imageProduct: {
    width: "100%",
    height: 120,
    borderRadius: 12,
  },

  textBox: {
    top: 8,
    gap: 2,
    justifyContent: "flex-start",
  },

  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  readMore: {
    marginTop: 4,
    fontSize: 12,
    color: "#B14409",
    fontWeight: "500",
  },

  meta: {
    fontSize: 14,
    marginTop: 4,
    color: "#555",
  },
});
