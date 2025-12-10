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
import { Product } from "../../favorites-context"; // IMPORT THE SAME TYPE
import { useRouter } from "expo-router";

// Категории
const categories = ["Спорт", "Наука", "Технологии", "Политика", "Происшествия"];

export default function FavoritesScreen() {
  const { favorites, removeFromFavorites } = useFavorites();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  // Поиск по избранным
  const filteredProducts = searchQuery
    ? favorites.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : favorites;

  return (
    <View style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerBox}>
          <Text style={styles.back}>⏪</Text>
          <Text style={styles.headertitle}>Избранное</Text>
          {/* SEARCH */}
          <View style={styles.input}>
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Text style={styles.clearIcon}>✖</Text>
              </TouchableOpacity>
            )}
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />{" "}
            <Text style={styles.searchIcon}>🔍</Text>
          </View>
        </View>
        {/* CATEGORY SCROLL */}
        <View style={styles.CategoryTabs}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.main}>
        {/* FAVORITES LIST */}
        <FlatList<Product>
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/article/article-detail",
                  params: { article: JSON.stringify(item) },
                })
              }
            >
              <Image source={{ uri: item.image }} style={styles.image} />

              <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>
                  {item.author ?? "Автор неизвестен"}
                </Text>
              </View>

              <TouchableOpacity onPress={() => removeFromFavorites(item.id)}>
                <Text style={styles.more}>⋯</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },

  header: {
    flexDirection: "column",
    // alignItems: "center",
    backgroundColor: "#ffffffff",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
    borderWidth: 0,
    // justifyContent: "space-between",
  },
  headerBox: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: 'space-between',
    gap: 10,
    padding: 20,
    marginBottom: 20,
  },

  back: {
    fontSize: 18,
  },
  headertitle: {
    fontSize: 25,
    fontWeight: "600",
    marginRight: 60,
  },

  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffffff",
    borderWidth: 1,
    borderColor: "#979797ff",
    borderRadius: 20,
    height: 45,
    width: 120,
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },

  searchIcon: {
    fontSize: 14,
    color: "#000000ff",
  },

  clearIcon: {
    fontSize: 12,
    color: "#fff",
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000ff",
  },

  CategoryTabs: {
    marginHorizontal: 15,
    marginBottom: 15,
    // paddingLeft: 15,
  },

  categoryButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: "#505050ff",
    borderRadius: 18,
    marginHorizontal: 5,
    height: 45,
  },

  activeButton: {
    borderColor: "#B14409",
    backgroundColor: "#B14409",
  },

  categoryText: {
    color: "#333",
    fontWeight: "500",
  },
  activeText: {
    color: "#fff",
  },

  main:{
    marginTop: 10,
    padding: 20,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    height: 130,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
  },

  image: {
    width: 120,
    height: 110,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    color: "gray",
    marginTop: 4,
  },
  more: {
    fontSize: 26,
    paddingHorizontal: 8,
  },
});
