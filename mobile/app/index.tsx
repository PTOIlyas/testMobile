import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Image,
  View,
  FlatList,
  ActivityIndicator,
  Text,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useGetNewsQuery } from "@/store/services/newsApi";
import { NewsCard } from "@/components/NewsCard";
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
} from "@/assets/icons";

export default function NewsListScreen() {
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("sports");

  const queryValue =
    searchQuery.length > 0
      ? `${selectedCategory} ${searchQuery}`
      : selectedCategory;

  const { data, error, isLoading, refetch, isFetching } = useGetNewsQuery({
    page,
    query: queryValue,
  });

  const topNews = data?.articles?.[0];

  const categories = [
    { key: "sports", label: "Спорт" },
    { key: "science", label: "Наука" },
    { key: "technology", label: "Технологии" },
    { key: "politics", label: "Политика" },
    { key: "world", label: "Мир" },
  ];

  useEffect(() => {
    if (data?.articles) {
      setArticles((prev) =>
        page === 1 ? data.articles : [...prev, ...data.articles]
      );
    }
  }, [data, page]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

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
        <Text onPress={() => refetch()} style={{ color: "blue", marginTop: 8 }}>
          Повторить загрузку
        </Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.fon}>
        <View style={styles.input}>
          <SearchIcon width={25} height={25} fill="white" />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <ClearIcon width={25} height={25} fill="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Оранжевая кнопка справа от поиска */}
        <View style={styles.filterBox}>
          <FilterIcon width={30} height={30} fill="white" />
        </View>
      </View>

      {/* сюда наверное */}
      <View style={styles.main}>
        {/* Категории — НЕ скроллятся */}
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

        {/* ⬇️ СКРОЛЛ ОБРЕЗАН */}
        <View style={styles.listContainer}>
          <FlatList
            data={articles}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <NewsCard article={item} />
              </View>
            )}
            ListHeaderComponent={<View style={{ height: 20 }} />} // 👈 отступ
            contentContainerStyle={styles.listContent}
            onEndReached={() => setPage((p) => p + 1)}
            onEndReachedThreshold={0.5}
          />
        </View>
      </View>

      <View style={styles.container}>
        {isLoading && <ActivityIndicator size="large" />}

        {!isLoading && topNews && (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "../news/[id]",
                params: {
                  id: encodeURIComponent(topNews.id),
                  article: JSON.stringify(topNews),
                },
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

        <HomeIcon width={25} height={25} fill="white" />

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "../favorites",
            })
          }
          style={styles.bottomButton}
        >
          <HeartIcon width={25} height={25} fill="white" />
        </TouchableOpacity>

        <SettingIcon width={25} height={25} fill="white" />

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "../notifications",
            })
          }
          style={styles.bottomButton}
        >
          <BellIcon width={25} height={25} fill="white" />
        </TouchableOpacity>
        
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
    height: 280,
  },

  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#353535",
    borderRadius: 10,
    width: 241,
    height: 55,
    margin: 12,
    padding: 20,
    top: -20,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: "#000",
  },

  filterBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B14409",
    borderRadius: 10,
    width: 58,
    height: 53,
    top: -20,
  },

  // Серый контейнер поверх главного экрана
  container: {
    position: "absolute",
    zIndex: 10,
    top: 170,
    left: 35,
    right: 35,
    height: 200,
    flex: 1,
    // backgroundColor: "#f2f2f2",
    borderRadius: 26,
    justifyContent: "center",
  },

  card: {
    backgroundColor: "#fff",
    height: 212,
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
    // top: 80
  },

  CategoryTabs: {
    // top: 80,
    paddingTop:95,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  categoryButton: {
    paddingHorizontal: 15,
    // marginBottom: 1,
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

  listContainer: {
    flex: 1,
    overflow: "hidden", // 🔥 ВАЖНО
  },

  listContent: {
    // paddingTop: 10,
    paddingBottom: 100,
  },

  row: {
    justifyContent: "space-between",
  },

  cardWrapper: {
    flex: 1,
    // paddingVertical: 70,
    // marginTop: 70,
    marginBottom: 20,
    marginHorizontal: 6,
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
