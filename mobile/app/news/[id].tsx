import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGetNewsQuery } from "@/store/services/newsApi";
import { useFavorites } from "../../favorites-context";

export default function ArticleDetail() {
  const router = useRouter();
  const { addToFavorites } = useFavorites();

  const { id } = useLocalSearchParams<{ id: string }>();
  const articleUrl = id ? decodeURIComponent(id) : "";

  const { data, isLoading, error } = useGetNewsQuery({
    query: "technology",
    page: 1,
  });

  const [showWeb, setShowWeb] = useState(false);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Загрузка…</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text>Ошибка загрузки</Text>
      </View>
    );
  }

  // ИЩЕМ СТАТЬЮ ПО URL
  const article = data.articles.find((a) => a.url === articleUrl);

  if (!article) {
    return (
      <View style={styles.center}>
        <Text>Статья не найдена</Text>
      </View>
    );
  }

  if (showWeb) {
    return <WebView source={{ uri: article.url }} style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.screen}>
      <ScrollView>

        {/* Хедер */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>⏪</Text>
          </TouchableOpacity>

          <Text style={styles.headertitle}>Detail</Text>

          <Text style={styles.headerIcon}>❤</Text>
        </View>
        {
          article.image && (<Image source={{ uri: article.image }} style={styles.image} />)
        }

        {/* Заголовок */}
        <View style={styles.titleBox}>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.subtitle}>{article.publishedAt}</Text>
        </View>

        {/* Линия */}
        <View style={styles.separator} />

        {/* Описание */}
        <View>
          <Text style={styles.sectionTitle}>Описание</Text>
          <Text style={styles.content}>{article.description}</Text>
        </View>

        {/* Открыть оригинал */}
        <TouchableOpacity
          style={styles.webButton}
          onPress={() => setShowWeb(true)}
        >
          <Text style={styles.webButtonText}>Открыть оригинал</Text>
        </TouchableOpacity>

        {/* Цена + избранное */}
        <View style={styles.bottomTop}>
          <View>
            <Text style={{ fontSize: 18 }}>Price</Text>
            <Text style={styles.price}>4.5</Text>
          </View>

          <TouchableOpacity
            style={styles.favButton}
            onPress={() => {
              addToFavorites(article);
              router.push("/favorites");
            }}
          >
            <Text style={styles.favButtonText}>В избранное</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  screen: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    paddingLeft: 22,
  },
  header: {
    flexDirection: "row", justifyContent: "space-between",
    width: 345, height: 44, marginVertical: 15,
  },
  back: { fontSize: 18 },
  headertitle: { fontSize: 18, fontWeight: "500" },
  headerIcon: { fontSize: 18 },
  image: { width: 345, height: 202, borderRadius: 12 },
  titleBox: { paddingVertical: 5, gap: 5 },
  title: { fontSize: 22, fontWeight: "bold", marginTop: 15 },
  subtitle: { color: "#8d8d8dff" },
  separator: {
    height: 1.5, backgroundColor: "#E3E3E3",
    marginVertical: 20, width: "90%", marginLeft: 15,
  },
  sectionTitle: { fontSize: 22, fontWeight: "bold" },
  content: { fontSize: 16, marginTop: 10 },
  webButton: {
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#B14409", width: 170, height: 30,
    borderRadius: 20, alignSelf: "center", marginTop: 14,
  },
  webButtonText: { color: "white", fontWeight: "bold" },
  bottomTop: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 25, paddingLeft: 20, alignItems: "center",
  },
  price: { fontSize: 25, fontWeight: "bold", color: "#B14409" },
  favButton: {
    backgroundColor: "#B14409", borderRadius: 20,
    width: 160, height: 65, alignItems: "center", justifyContent: "center",
  },
  favButtonText: { fontSize: 20, fontWeight: "bold", color: "white" },
});
