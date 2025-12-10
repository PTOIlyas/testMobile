import React, { useState, useEffect } from "react";
import { Image, View, FlatList, ActivityIndicator, Text, RefreshControl, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useGetNewsQuery } from "@/store/services/newsApi";
import { NewsCard } from "@/components/NewsCard";
import { NewsArticle } from "@/types/news";
import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";
import { router } from "expo-router";

export default function NewsListScreen() {
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("sports")

  const queryValue = searchQuery.length > 0 ? `${selectedCategory} ${searchQuery}` : selectedCategory;


  const { data, error, isLoading, refetch, isFetching } = useGetNewsQuery(
    {
      page,
      query: queryValue
    });

  const topNews = data?.articles?.[0]

  const categories = [
    { key: "sports", label: "Спорт" },
    { key: "science", label: "Наука" },
    { key: "technology", label: "Технологии" },
    { key: "politics", label: "Политика" },
    { key: "world", label: "Мир" },
  ];


  useEffect(() => {
    if (data?.articles) {
      setArticles(prev => page === 1 ? data.articles : [...prev, ...data.articles]);
    }
  }, [data, page]);

  useEffect(() => {
    setPage(1);
    setArticles([]);
  }, [searchQuery]);

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
        <Text onPress={() => refetch()} style={{ color: 'blue', marginTop: 8 }}>
          Повторить загрузку
        </Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.fon}>
        <View style={styles.input}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearIcon}>✖</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Оранжевая кнопка справа от поиска */}
        <View style={styles.filterBox}></View>
      </View>

      {/* сюда наверное */}
      <View style={styles.main}>
        <View style={styles.CategoryTabs}>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
      </View>


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
              setArticles([]);
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
      <View style={styles.container}>

        {isLoading && <ActivityIndicator size="large" />}

        {!isLoading && topNews && (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/news/[id]',
                params: {
                  id: encodeURIComponent(topNews.url),
                  article: JSON.stringify(topNews)
                }
              })
            }
            style={styles.card}
          >
            {topNews.image && (
              <Image source={{ uri: topNews.image }} style={styles.image} />
            )}
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.bottomTab}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/favorites/FavoritesScreen",
            })
          }
          style={styles.bottomButton}
        >
          <Text>🎁</Text>
        </TouchableOpacity>
        <Text>🔍</Text>
        <Text>🛒</Text>
        <Text>👤</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // Черный фон с поиском
  fon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A1A1A",
    padding: 20,
    height: 240,
  },

  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#353535",
    borderRadius: 10,
    width: 241,
    height: 53,
    margin: 12,
    padding: 20,
    top: -40,
  },

  searchIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  clearIcon: {
    fontSize: 12,
    marginLeft: 8,
    color: "#666",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },

  filterBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B14409",
    borderRadius: 10,
    width: 58,
    height: 53,
    top: -40,
  },

  // Серый контейнер поверх главного экрана
  container: {
    position: "absolute",
    zIndex: 10,
    top: 120,
    left: 35,
    right: 35,
    height: 200,
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 26,
    justifyContent: "center",
  },

  card: {
    backgroundColor: "#fff",
    height: 200,
    borderRadius: 26,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 2,
  },

  image: {
    height: "100%",
    width: "100%",
  },

  main: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },

  CategoryTabs: {
    top: 80,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  categoryButton: {
    paddingHorizontal: 15,
    marginBottom: 10,
    paddingVertical: 8,
    backgroundColor: "#ddd",
    borderRadius: 8,
    marginHorizontal: 5,
  },

  activeButton: {
    backgroundColor: "#B14409",
  },

  categoryText: {
    color: "#333",
    fontWeight: "500",
  },

  activeText: {
    color: "#fff",
  },

  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 20,
  },

  bottomTab: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: "#1A1A1A",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },

  bottomButton: {
    height: 30,
  },
});
