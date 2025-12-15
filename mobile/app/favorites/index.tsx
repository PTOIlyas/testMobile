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
import { useFavorites } from "../../favorites-context";
import { NewsArticle } from "@/types/news";
import { router } from "expo-router";
import {
  SearchIcon,
  ClearIcon,
  FilterIcon,
  HomeIcon,
  SettingIcon,
  BellIcon,
  HeartIcon,
  ExitIcon,
} from "@/assets/icons";

const categories = ["Спорт", "Наука", "Технологии", "Политика", "Мир"];

export default function FavoritesScreen() {
  const { favorites, removeFromFavorites } = useFavorites();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  // ----- Фильтрация -----
  const filteredFavorites = favorites.filter((item) => {
    const matchTitle = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchCategory = selectedCategory
      ? item.description?.toLowerCase().includes(selectedCategory.toLowerCase())
      : true;

    return matchTitle && matchCategory;
  });

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerBaza}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/",
              })
            }
          >
            <ExitIcon width={25} height={25} fill="white" />
          </TouchableOpacity>
          <Text style={styles.headertitle}>Избранное</Text>
        </View>

        <View style={styles.input}>
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <ClearIcon width={20} height={20} fill="black" />
            </TouchableOpacity>
          )}
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск..."
            placeholderTextColor="#424242ff"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Text style={styles.searchIcon}>🔍</Text>
          <SearchIcon width={25} height={25} fill="#424242ff" />
        </View>

        {/* Category tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.CategoryTabs}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.activeButton,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.activeText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* FAVORITES LIST */}
      <FlatList<NewsArticle>
        data={filteredFavorites}
        keyExtractor={(item) => item.url}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/news/[id]",
                params: {
                  id: encodeURIComponent(item.url),
                  article: JSON.stringify(item),
                },
              })
            }
          >
            {/* Картинка */}
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.image} />
            )}

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

            <TouchableOpacity onPress={() => removeFromFavorites(item.url)}>
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },

  header: {
    backgroundColor: "#fff",
    paddingTop: 60,
    padding: 20,
    paddingBottom: 10,
    elevation: 6,
  },

  headerBaza: {
    gap: 80,
    flexDirection: "row",
  },

  headertitle: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 15,
  },

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

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000ff",
  },

  searchIcon: {
    fontSize: 16,
    marginLeft: 6,
  },


  CategoryTabs: {
    marginTop: 15,
  },

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

  activeButton: {
    backgroundColor: "#B14409",
    borderColor: "#B14409",
  },

  categoryText: {
    color: "#333",
    fontSize: 14,
  },

  activeText: {
    color: "#fff",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    height: 120,
    padding: 10,
    marginBottom: 15,
    alignItems: "center",
  },

  image: {
    width: 110,
    height: 100,
    borderRadius: 10,
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
  },

  subtitle: {
    color: "gray",
    marginTop: 6,
  },

  more: {
    fontSize: 22,
    paddingHorizontal: 8,
  },
});
