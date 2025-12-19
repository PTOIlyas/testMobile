import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { useFavorites } from "../../favorites-context"; // Контекст избранного
import { NewsArticle } from "@/types/news";
import { router } from "expo-router";
import { SearchIcon, ClearIcon, ExitIcon } from "@/assets/icons";

/**
 * Категории для фильтрации избранного
 */
const categories = [
  { key: "sports", label: "Спорт" },
  { key: "science", label: "Наука" },
  { key: "technology", label: "Технологии" },
  { key: "politics", label: "Политика" },
  { key: "world", label: "Мир" },
];

export default function FavoritesScreen() {
  // Получаем список избранного и функцию удаления
  const { favorites, removeFromFavorites } = useFavorites();

  // Состояние для поиска и выбранной категории
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0].key);

  // ----- Фильтрация избранного -----
  const filteredFavorites = favorites.filter((item) => {
    const matchTitle = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory
      ? item.query === selectedCategory
      : true;
    return matchTitle && matchCategory;
  });

  // ----- Рендер экрана -----
  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* Кнопка выхода на главный экран */}
        <View style={styles.headerBaza}>
          <TouchableOpacity onPress={() => router.push("/")}>
            <ExitIcon width={30} height={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.headertitle}>Избранное</Text>
        </View>

        {/* Поисковая строка */}
        <View style={styles.input}>
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <ClearIcon width={20} height={20} color="black" />
            </TouchableOpacity>
          )}
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск..."
            placeholderTextColor="#424242ff"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <SearchIcon width={30} height={25} color="black" />
        </View>

        {/* Категории */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.CategoryTabs}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryButton,
                selectedCategory === category.key && styles.activeButton,
              ]}
              onPress={() => setSelectedCategory(category.key)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.key && styles.activeText,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* LIST OF FAVORITES */}
      <FlatList<NewsArticle>
        data={filteredFavorites} // Отфильтрованный список
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/news/[id]", // Переход на экран статьи
                params: {
                  id: item.id,
                  article: JSON.stringify(item), // Передаем данные статьи
                },
              })
            }
          >
            {/* Картинка статьи */}
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.image} />
            )}

            {/* Заголовок и дата */}
            <View style={styles.info}>
              <Text numberOfLines={2} style={styles.title}>
                {item.title}
              </Text>
              <Text style={styles.subtitle}>
                {item.publishedAt
                  ? new Date(item.publishedAt).toLocaleDateString()
                  : ""}
              </Text>
            </View>

            {/* Удаление из избранного */}
            <TouchableOpacity onPress={() => removeFromFavorites(item.id)}>
              <Text style={styles.more}>🗑</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40 }}>
            Пока ничего не добавлено 🔖
          </Text>
        }
      />
    </View>
  );
}

// ----- Стили -----
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F2F2F2" },
  header: {
    backgroundColor: "#fff",
    paddingTop: 60,
    padding: 20,
    paddingBottom: 10,
    elevation: 6,
  },
  headerBaza: { gap: 80, flexDirection: "row" },
  headertitle: { fontSize: 26, fontWeight: "700", marginBottom: 15 },
  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#979797",
    borderRadius: 20,
    height: 45,
    paddingHorizontal: 10,
  },
  searchInput: { flex: 1, fontSize: 16, color: "#000000ff" },
  CategoryTabs: { marginTop: 15 },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: "#505050",
    borderRadius: 18,
    marginRight: 10,
    height: 40,
    justifyContent: "center",
  },
  activeButton: { backgroundColor: "#B14409", borderColor: "#B14409" },
  categoryText: { color: "#333", fontSize: 14 },
  activeText: { color: "#fff" },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    height: 120,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  image: { width: 110, height: 100, borderRadius: 10, marginRight: 12 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: "bold" },
  subtitle: { color: "gray", marginTop: 6 },
  more: { fontSize: 22, paddingHorizontal: 8 },
});
