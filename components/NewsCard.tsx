import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { NewsArticle } from "@/types/news";

// Redux
import { useDispatch } from "react-redux";
import { setCurrentArticle } from "@/store/slices/currentArticleSlice";

/**
 * Пропсы карточки новости
 * article — объект новости
 * query — текущая категория/поисковый запрос (нужен для detail-экрана)
 */
interface NewsCardProps {
  article: NewsArticle;
  query: string;
}

/**
 * Компонент карточки новости
 * Используется в FlatList на главном экране
 */
export const NewsCard: React.FC<NewsCardProps> = ({ article, query }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  /**
   * Переход на экран детального просмотра
   *
   * 1. Сохраняем текущую статью в Redux
   *    (чтобы detail-экран не делал повторный запрос)
   * 2. Передаём также query (категорию), из которой открыта новость
   * 3. Переходим на маршрут /news/[id]
   */
  const openDetail = () => {
    dispatch(
      setCurrentArticle({
        ...article,
        query, // сохраняем контекст (категория/поиск)
      })
    );

    router.push("/news/[id]");
  };

  return (
    // Вся карточка кликабельна
    <TouchableOpacity style={styles.productItem} onPress={openDetail}>
      {/* Изображение новости */}
      {article.image && (
        <Image source={{ uri: article.image }} style={styles.imageProduct} />
      )}

      {/* Текстовый блок */}
      <View style={styles.textBox}>
        {/* Заголовок новости */}
        <Text
          style={styles.productTitle}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {article.title}
        </Text>

        {/* Кнопка "Дальше" */}
        <TouchableOpacity onPress={openDetail}>
          <Text style={styles.readMore}>Дальше</Text>
        </TouchableOpacity>

        {/* Источник и дата публикации */}
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

/**
 * Стили карточки новости
 */
const styles = StyleSheet.create({
  productItem: {
    width: 175,
    height: 240,
    padding: 8,
    backgroundColor: "#ffffffff",
    borderRadius: 16,
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
