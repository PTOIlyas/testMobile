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

// const { getDefaultConfig } = require("expo/metro-config");

// module.exports = (() => {
//   const config = getDefaultConfig(__dirname);

//   config.transformer = {
//     babelTransformerPath: require.resolve("react-native-svg-transformer"),
//   };
//   config.resolver.assetExts = config.resolver.assetExts.filter((ext: string) => ext !== "svg");
//   config.resolver.sourceExts.push("svg");

//   return config;
// })();

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
    content: "7 декабря 2025 года чемпион мира в среднем весе по версиям WBO и IBF Жанибек Алимханулы проведёт объединительный бой против чемпиона мира по версии WBA, 42-летнего Эрисланди Лары. На кону будет три чемпионских пояса.",
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
    {
      id: 4,
      title: "Breaking News",
      image:
        "https://sportnews.kz/static/n/miiquu0dacjyrxowlhkorg.webp.desktop.webp",
      author: "Admin",
      date: "2025-02-10",
      content: "Full article text example...",
      url: "https://google.com",
    },
  ],

  // другие блоки — аналогично
  "Наука и технологии": [
    {
      id: 5,
      title: "Breaking News",
      image:
        "https://cdn.iz.ru/sites/default/files/styles/420x275/public/article-2025-11/ERS00458%20copy%20%281%29%20copy.jpg?itok=gtzA5Pdb",
      author: "Admin",
      date: "2025-02-10",
      content: "Full article text example...",
      url: "https://google.com",
    },
    {
      id: 6,
      title: "Breaking News",
      image:
        "https://api.amurobl.tv/upload/resize_cache/iblock/d00/640_424_2/sfphi6v86j9pe5cyugu27zgl816zj7mv.jpeg",
      author: "Admin",
      date: "2025-02-10",
      content: "Full article text example...",
      url: "https://google.com",
    },
    {
      id: 7,
      title: "Breaking News",
      image:
        "https://cdn.iz.ru/sites/default/files/styles/420x275/public/article-2025-11/ERS00458%20copy%20%281%29%20copy.jpg?itok=gtzA5Pdb",
      author: "Admin",
      date: "2025-02-10",
      content: "Full article text example...",
      url: "https://google.com",
    },
    {
      id: 8,
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
      id: 9,
      title: "Breaking News",
      image:
        "https://www.zakon.kz/pbi/WEBP/2025-11-28/file-ed79a08d-65c8-4487-9607-ae8fada4741c/800x450.webp",
      author: "Admin",
      date: "2025-02-10",
      content: "Full article text example...",
      url: "https://google.com",
    },
    {
      id: 10,
      title: "Breaking News",
      image:
        "https://www.zakon.kz/pbi/WEBP/2025-11-28/file-ed79a08d-65c8-4487-9607-ae8fada4741c/800x450.webp",
      author: "Admin",
      date: "2025-02-10",
      content: "Full article text example...",
      url: "https://google.com",
    },
    {
      id: 11,
      title: "Breaking News",
      image:
        "https://cdn.iz.ru/sites/default/files/styles/420x275/public/article-2025-11/ERS00458%20copy%20%281%29%20copy.jpg?itok=gtzA5Pdb",
      author: "Admin",
      date: "2025-02-10",
      content: "Full article text example...",
      url: "https://google.com",
    },
  ],

  Происшествия: [
    {
      id: 12,
      title: "Breaking News",
      image:
        "https://rus.baq.kz/storage/storage/news/2025/11/25/mainphoto/196919/350x234_PLJw4IyeFFJOW5zP2O2d7nyMLmnplRoWK2ptRrHs.png",
      author: "Admin",
      date: "2025-02-10",
      content: "Full article text example...",
      url: "https://google.com",
    },
    {
      id: 13,
      title: "Breaking News",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT72Vb_CM8nvH83KE3vcQ14koukoCmTuMIcTA&s",
      author: "Admin",
      date: "2025-02-10",
      content: "Full article text example...",
      url: "https://google.com",
    },
    {
      id: 14,
      title: "Breaking News",
      image:
        "https://www.kt.kz/neofiles/serve-image/692801a216b84891c5ddf2c2/738x473/c1",
      author: "Admin",
      date: "2025-02-10",
      content: "Full article text example...",
      url: "https://google.com",
    },
    {
      id: 15,
      title: "Breaking News",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT72Vb_CM8nvH83KE3vcQ14koukoCmTuMIcTA&s",
      author: "Admin",
      date: "2025-02-10",
      content: "Full article text example...",
      url: "https://google.com",
    },
  ],
};

export default function HomeScreen() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<
    keyof typeof products
  >(categories[0]);

  // Все товары одной переменной для поиска
  const allProducts: Product[] = Object.values(products).flat();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = searchQuery
    ? allProducts.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products[selectedCategory]; // если поиск пустой — показываем выбранную категорию

  return (
    <>
      {/* ----------------------------- */}
      {/* Верхний блок со строкой поиска */}
      {/* ----------------------------- */}
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

      {/* ----------------------------- */}
      {/* Основной контент */}
      {/* ----------------------------- */}
      <View style={styles.main}>
        <View style={styles.CategoryTabs}>
          {/* Горизонтальная прокрутка категорий */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.activeButton, // активная категория
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

          {/* ----------------------------- */}
          {/* Товары выбранной категории */}
          {/* ----------------------------- */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.productsGrid}>
              {filteredProducts?.map((item) => (
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
                    {item.author && item.date && (
                      <Text style={styles.meta}>
                        {item.author} • {item.date}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
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

      <View style={styles.bottomTab}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(tabs)/favorites/FavoritesScreen",
            })
          }
          style={styles.bottomButton}
        >
          <Text>🎁</Text>
          {/* <Image source={require('/Users/Talshin/Desktop/Test_project/testMobile/mobile/assets/images/homeIcon.svg')} style={styles.image}/> */}
        </TouchableOpacity>
        <Text>🔍</Text>
        <Text>🛒</Text>
        <Text>👤</Text>
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
