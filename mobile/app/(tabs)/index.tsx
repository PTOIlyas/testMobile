import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";

// -----------------------------
// Данные для первой карточки (ниже)
// -----------------------------
const DATA = [
  {
    id: 1,
    title: "Breaking News",
    image:
      "https://cdn04.qazsporttv.kz/720x/2025/11/25/1764070207_6925933f26801.jpg",
    author: "Admin",
    date: "2025-02-10",
    content: "Full article text example...",
    url: "https://google.com",
  },
];

// -----------------------------
// Категории новостей
// -----------------------------
const categories = ["Спорт", "Наука и технологии", "Политика", "Происшествия"];

// Модель товара/новости
interface Product {
  id: number;
  title: string;
  badge?: string;
  image?: string;
  author?: string;
  date?: string;
  content?: string;
  url?: string;
}

// -----------------------------
// Объект со списком товаров по категориям
// -----------------------------
const products: Record<string, Product[]> = {
  Спорт: [
    {
      id: 1,
      title: "Breaking News",
      image:
        "https://sportnews.kz/static/n/miiquu0dacjyrxowlhkorg.webp.desktop.webp",
      author: "Admin",
      date: "2025-02-10",
      content: "Full article text example...",
      url: "https://google.com",
    },
    {
      id: 2,
      title: "Breaking News",
      image:
        "https://rus.baq.kz/storage/storage/news/2025/11/21/mainphoto/196635/364x242_dysVnEjorwQbrnvx57RrJDfn0Kt77HcbHtaFGuWF.jpg",
      author: "Admin",
      date: "2025-02-10",
      content: "Full article text example...",
      url: "https://google.com",
    },
    {
      id: 3,
      title: "Breaking News",
      image:
        "https://iy.kommersant.ru/Issues.photo/DAILY/2025/221/KMO_120232_34063_1_t241_173745.jpg",
      author: "Admin",
      date: "2025-02-10",
      content: "Full article text example...",
      url: "https://google.com",
    },
  ],

  // другие блоки — аналогично
  "Наука и технологии": [
    {
      id: 4,
      title: "Breaking News",
      image:
        "https://cdn.iz.ru/sites/default/files/styles/420x275/public/article-2025-11/ERS00458%20copy%20%281%29%20copy.jpg?itok=gtzA5Pdb",
      author: "Admin",
      date: "2025-02-10",
      content: "Full article text example...",
      url: "https://google.com",
    },
    {
      id: 5,
      title: "Breaking News",
      image:
        "https://api.amurobl.tv/upload/resize_cache/iblock/d00/640_424_2/sfphi6v86j9pe5cyugu27zgl816zj7mv.jpeg",
      author: "Admin",
      date: "2025-02-10",
      content: "Full article text example...",
      url: "https://google.com",
    },
  ],

  Политика: [
    {
      id: 6,
      title: "Breaking News",
      image:
        "https://www.zakon.kz/pbi/WEBP/2025-11-28/file-ed79a08d-65c8-4487-9607-ae8fada4741c/800x450.webp",
      author: "Admin",
      date: "2025-02-10",
      content: "Full article text example...",
      url: "https://google.com",
    },
  ],

  Происшествия: [
    {
      id: 7,
      title: "Breaking News",
      image:
        "https://rus.baq.kz/storage/storage/news/2025/11/25/mainphoto/196919/350x234_PLJw4IyeFFJOW5zP2O2d7nyMLmnplRoWK2ptRrHs.png",
      author: "Admin",
      date: "2025-02-10",
      content: "Full article text example...",
      url: "https://google.com",
    },
    {
      id: 8,
      title: "Breaking News",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT72Vb_CM8nvH83KE3vcQ14koukoCmTuMIcTA&s",
      author: "Admin",
      date: "2025-02-10",
      content: "Full article text example...",
      url: "https://google.com",
    },
    {
      id: 9,
      title: "Breaking News",
      image:
        "https://www.kt.kz/neofiles/serve-image/692801a216b84891c5ddf2c2/738x473/c1",
      author: "Admin",
      date: "2025-02-10",
      content: "Full article text example...",
      url: "https://google.com",
    },
  ],
};

export default function HomeScreen() {
  const router = useRouter();

  const [text, onChangeText] = React.useState("Поиск Новостей");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  return (
    <>
      {/* ----------------------------- */}
      {/* Верхний блок со строкой поиска */}
      {/* ----------------------------- */}
      <View style={styles.fon}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
        />

        {/* Оранжевая кнопка справа от поиска */}
        <View style={styles.filterBox}></View>
      </View>

      {/* ----------------------------- */}
      {/* Основной контент */}
      {/* ----------------------------- */}
      <View style={styles.main}>
        <View style={styles.CategoryTabs}>
          {/* Горизонтальная прокрутка категорий */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.activeButton,
                ]}
                onPress={() => setSelectedCategory(category)} // смена категории
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

          {/* ----------------------------- */}
          {/* Товары выбранной категории */}
          {/* ----------------------------- */}
          <View style={styles.productsGrid}>
            {products[selectedCategory]?.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.productItem}
                onPress={() =>
                  router.push({
                    pathname: "/article/article-detail",
                    params: { article: JSON.stringify(item) },
                  })
                }
              >
                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.imageProduct}
                  />
                )}

                <View style={styles.textBox}>
                  <Text style={styles.productTitle}>{item.title}</Text>

                  <Text style={styles.meta}>
                    {item.author} • {item.date}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* ----------------------------- */}
      {/* Контейнер поверх экрана (всплывающее окно) */}
      {/* ----------------------------- */}
      <View style={styles.container}>
        <FlatList
          data={DATA}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/article/article-detail",
                  params: { article: JSON.stringify(item) },
                })
              }
              style={styles.card}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
            </TouchableOpacity>
          )}
        />
      </View>
    </>
  );
}

// ---------------------------------------
//               СТИЛИ
// ---------------------------------------
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
    backgroundColor: "#353535",
    borderRadius: 10,
    width: 241,
    height: 53,
    margin: 12,
    padding: 20,
    top: -40,
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
    justifyContent: "space-between",
    paddingHorizontal: 10,
    top: 20,
  },

  productItem: {
    width: 165,
    height: 180,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  imageProduct: {
    width: "100%",
    height: 120,
    borderRadius: 16,
  },

  textBox: {
    top: 5,
    justifyContent: "flex-start",
  },

  productTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },

  meta: {
    color: "#555",
  },
});
