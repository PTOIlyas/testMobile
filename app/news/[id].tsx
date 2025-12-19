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
import { useRouter } from "expo-router";
import { useGetNewsQuery } from "@/store/services/newsApi";
import { useFavorites } from "../../favorites-context";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ExitIcon, HeartIcon } from "@/assets/icons";

export default function ArticleDetail() {
  const router = useRouter();
  const { addToFavorites } = useFavorites(); // Функция добавления в избранное
  const article = useSelector(
    (state: RootState) => state.currentArticle.currentArticle
  ); // Получаем выбранную статью из Redux

  const { data, isLoading, error } = useGetNewsQuery({
    query: "technology",
    page: 1,
  }); // Пример запроса новостей

  const [showWeb, setShowWeb] = useState(false); // Состояние для открытия WebView

  // ----- Загрузка -----
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Загрузка…</Text>
      </View>
    );
  }

  // ----- Ошибка -----
  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text>Ошибка загрузки</Text>
      </View>
    );
  }

  // ----- Статья не найдена -----
  if (!article) {
    return (
      <View style={styles.center}>
        <Text>Статья не найдена</Text>
      </View>
    );
  }

  // ----- Открытие WebView -----
  if (showWeb) {
    return <WebView source={{ uri: article.url }} style={{ flex: 1 }} />;
  }

  // ----- Основной экран статьи -----
  return (
    <View style={styles.screen}>
      <ScrollView>
        {/* Хедер с кнопкой выхода и переходом в избранное */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/")}>
            <ExitIcon width={25} height={25} fill="black" />
          </TouchableOpacity>

          <Text style={styles.headertitle}>Detail</Text>

          <TouchableOpacity onPress={() => router.push("../favorites")}>
            <HeartIcon width={25} height={22} color="red" />
          </TouchableOpacity>
        </View>

        {/* Изображение статьи */}
        {article.image && (
          <Image source={{ uri: article.image }} style={styles.image} />
        )}

        {/* Заголовок и дата */}
        <View style={styles.titleBox}>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.subtitle}>{article.publishedAt}</Text>
        </View>

        <View style={styles.separator} />

        {/* Описание статьи */}
        <View>
          <Text style={styles.sectionTitle}>Описание</Text>
          <Text style={styles.content}>{article.description}</Text>
        </View>

        {/* Кнопка открыть оригинал */}
        
        <TouchableOpacity style={styles.webButton} onPress={() => setShowWeb(true)}>
          <Text style={styles.webButtonText}>Открыть оригинал</Text>
        </TouchableOpacity>
        

        {/* Рейтинг и добавление в избранное */}
        <View style={styles.bottomTop}>
          <View>
            <Text style={{ fontSize: 18 }}>Rating</Text>
            <Text style={styles.price}>4.5</Text>
          </View>

          <TouchableOpacity
            style={styles.favButton}
            onPress={async () => {
              await addToFavorites(article, article.query || "technology"); // Добавляем в избранное
              router.push("/favorites"); // Переходим в избранное
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
    flexDirection: "row",
    justifyContent: "space-between",
    width: 345,
    height: 58,
    marginVertical: 15,
    top: 28,
  },
  back: { fontSize: 18 },
  headertitle: { fontSize: 18, fontWeight: "500", color: "black" },
  headerIcon: { fontSize: 18 },
  image: { width: 345, height: 202, borderRadius: 12 },
  titleBox: { paddingVertical: 5, gap: 5 },
  title: { fontSize: 22, fontWeight: "bold", marginTop: 15 },
  subtitle: { color: "#8d8d8dff" },
  separator: {
    height: 1.5,
    backgroundColor: "#E3E3E3",
    marginVertical: 20,
    width: "90%",
    marginLeft: 15,
  },
  sectionTitle: { fontSize: 22, fontWeight: "bold" },
  content: { fontSize: 16, marginTop: 10 },
  
  webButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B14409",
    width: 170,
    height: 30,
    borderRadius: 20,
    marginTop: 14,
  },
  webButtonText: { color: "white", fontWeight: "bold" },
  bottomTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 25,
    paddingLeft: 20,
    alignItems: "center",
  },
  price: { fontSize: 25, fontWeight: "bold", color: "#B14409" },
  favButton: {
    backgroundColor: "#B14409",
    borderRadius: 20,
    width: 160,
    height: 65,
    alignItems: "center",
    justifyContent: "center",
  },
  favButtonText: { fontSize: 20, fontWeight: "bold", color: "white" },
});
