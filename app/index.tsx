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

// RTK Query — получение новостей
import { useGetNewsQuery } from "@/store/services/newsApi";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { addNotifications } from "@/store/notificationsSlice";
import { RootState } from "@/store";

// Компоненты и типы
import { NewsCard } from "@/components/NewsCard";
import { NewsArticle } from "@/types/news";

// Навигация
import { router } from "expo-router";

// Иконки
import {
  SearchIcon,
  ClearIcon,
  FilterIcon,
  HomeIcon,
  SettingIcon,
  BellIcon,
  HeartIcon,
} from "@/assets/icons";

// Контекст авторизации
import { useAuth } from "@/auth-context";

/**
 * Главный экран приложения
 * Отображает список новостей, поиск, категории и навигацию
 */
export default function NewsListScreen() {
  // Текущая страница для пагинации
  const [page, setPage] = useState(1);

  // Список новостей
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  // Поисковый запрос
  const [searchQuery, setSearchQuery] = useState("");

  // Выбранная категория
  const [selectedCategory, setSelectedCategory] = useState<string>("sports");

  /**
   * Выход из аккаунта
   * Редирект на экран логина
   */
  const handleLogout = () => {
    router.replace("/login");
  };

  /**
   * Формирование поискового запроса
   * Если есть текст поиска — добавляем его к категории
   */
  const queryValue =
    searchQuery.length > 0
      ? `${selectedCategory} ${searchQuery}`
      : selectedCategory;

  /**
   * Получение новостей через RTK Query
   */
  const { data, error, isLoading, refetch, isFetching } = useGetNewsQuery({
    page,
    query: queryValue,
  });

  // Первая новость для большого верхнего баннера
  const topNews = data?.articles?.[0];

  // Список категорий
  const categories = [
    { key: "sports", label: "Спорт" },
    { key: "science", label: "Наука" },
    { key: "technology", label: "Технологии" },
    { key: "politics", label: "Политика" },
    { key: "world", label: "Мир" },
  ];

  const dispatch = useDispatch();

  // Получаем уведомления из Redux
  const notifications = useSelector(
    (state: RootState) => state.notifications
  );

  // Проверка авторизации
  const { isAuthenticated } = useAuth();

  /**
   * Если пользователь не авторизован — редирект на login
   */
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null; // можно вернуть спиннер
  }

  /**
   * Создание уведомлений при появлении новых новостей
   */
  useEffect(() => {
    if (!data?.articles) return;

    // Уже существующие articleId
    const existingIds = notifications
      .map((n) => n.articleId)
      .filter(Boolean);

    // Новые уведомления
    const newNotifications = data.articles
      .filter((a) => !existingIds.includes(a.id))
      .map((a) => ({
        id: `news-${a.id}`,
        title: "New article",
        description: a.title,
        createdAt: new Date().toISOString(),
        unread: true,
        articleId: a.id,
      }));

    if (newNotifications.length > 0) {
      dispatch(addNotifications(newNotifications));
    }
  }, [data]);

  /**
   * Обновление списка новостей
   * page === 1 → перезаписываем
   * page > 1 → добавляем
   */
  useEffect(() => {
    if (data?.articles) {
      setArticles((prev) =>
        page === 1 ? data.articles : [...prev, ...data.articles]
      );
    }
  }, [data, page]);

  // Обработка поиска
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  /**
   * Состояние загрузки
   */
  if (isLoading && page === 1) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Загрузка...</Text>
      </View>
    );
  }

  /**
   * Ошибка загрузки
   */
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

  /**
   * Если новостей нет
   */
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

  /**
   * Основной рендер
   */
  return (
    <>
      <View style={styles.fon}>
        <View style={styles.input}>
          <SearchIcon width={25} height={25} color="white" />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <ClearIcon width={25} height={25} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Оранжевая кнопка справа от поиска */}
        <View style={styles.filterBox}>
          <FilterIcon width={30} height={30} color="white" />
        </View>
      </View>

      
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

        <View style={styles.listContainer}>
          <FlatList
            data={articles}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <NewsCard article={item} query={selectedCategory} />
              </View>
            )}
            ListHeaderComponent={<View style={{ height: 20 }} />} 
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
        <HomeIcon width={25} height={25} color="white" />

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "../favorites",
            })
          }
          style={styles.bottomButton}
        >
          <HeartIcon width={25} height={25} color="white" />
        </TouchableOpacity>

        <SettingIcon width={25} height={25} color="white" />

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "../notifications",
            })
          }
          style={styles.bottomButton}
        >
          <BellIcon width={25} height={25} color="white" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleLogout}>
        <Text>Выйти</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  
  fon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A1A1A",
    padding: 20,
    height: 300,
    gap: 5,
  },

  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#353535",
    borderRadius: 10,
    width: 260,
    height: 55,
    margin: 10,
    padding: 20,
    gap: 5,
    top: -30,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: "#ffffffff",
  },

  filterBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B14409",
    borderRadius: 10,
    width: 58,
    height: 53,
    top: -30,
  },

  // Серый контейнер поверх главного экрана
  container: {
    position: "absolute",
    zIndex: 10,
    top: 170,
    left: 25,
    right: 25,
    height: 200,
    flex: 1,
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
    shadowColor: "#1d1d1dff",
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
    backgroundColor: "#ffffffff",
    padding: 10,
  },

  CategoryTabs: {
    paddingTop: 70,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  categoryButton: {
    paddingHorizontal: 15,
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
    overflow: "hidden", 
  },

  listContent: {
    paddingBottom: 100,
  },

  row: {
    justifyContent: "space-between",
  },

  cardWrapper: {
    flex: 1,
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
  },

  bottomButton: {
    height: 30,
  },
});
