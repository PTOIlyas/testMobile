import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { WebView } from "react-native-webview";

export default function ArticleDetail() {
  // Получаем параметры из роутера (данные статьи)
  const { article } = useLocalSearchParams();

  // Обрабатываем параметр на случай, если он массив
  const raw = Array.isArray(article) ? article[0] : article;
  const data = JSON.parse(raw);

  // Стейт для отображения WebView и для избранного
  const [showWeb, setShowWeb] = useState(false);
  const [fav, setFav] = useState(false);

  // Если showWeb = true, открываем WebView для оригинальной статьи
  if (showWeb) {
    return <WebView source={{ uri: data.url }} style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.screen}>
      <ScrollView>
        {/* ----------------- Header ----------------- */}
        <View style={styles.header}>
          <Text style={styles.back}>⏪</Text> {/* Кнопка назад */}
          <Text style={styles.headertitle}>Detail</Text> {/* Заголовок */}
          <Text style={styles.headerIcon}>❤</Text> {/* Иконка избранного */}
        </View>

        {/* ----------------- Изображение статьи ----------------- */}
        <Image source={{ uri: data.image }} style={styles.image} />

        {/* ----------------- Заголовок и автор ----------------- */}
        <View style={styles.titleBox}>
          <Text style={styles.titile}>{data.title}</Text>
          <Text style={styles.subtitle}>
            {data.author} • {data.date}
          </Text>
        </View>

        {/* ----------------- Горизонтальная линия ----------------- */}
        <View style={styles.separator} />

        {/* ----------------- Контент статьи ----------------- */}
        <View style={{ justifyContent: "flex-start", paddingRight: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>Описание</Text>
          <Text style={{ fontSize: 16, marginTop: 10 }}>{data.content}</Text>
        </View>

        {/* ----------------- Кнопка "Открыть оригинал" ----------------- */}
        <View style={styles.webButton}>
          <TouchableOpacity
            style={styles.Buttonorg}
            onPress={() => setShowWeb(true)}
          >
            <Text style={styles.webButtonText}>Открыть оригинал</Text>
          </TouchableOpacity>
        </View>

        {/* ----------------- Блок с ценой и избранным ----------------- */}
        <View style={styles.bottomTop}>
          <View>
            <Text style={{ fontSize: 18 }}>Price</Text>
            <Text style={{ fontSize: 25, fontWeight: "bold", color: "#B14409" }}>
              4.5
            </Text>
          </View>
          <View>
            <TouchableOpacity style={styles.Buttonfav} onPress={() => setFav(!fav)}>
              <Text style={styles.favButtonText}>В избранное</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "white",
    paddingLeft: 22,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 345,
    height: 44,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginVertical: 15,
  },
  back: { fontSize: 18 },
  headertitle: { fontSize: 18, fontWeight: "500" },
  headerIcon: { fontSize: 18 },
  image: { width: 345, height: 202, borderRadius: 12 },
  titleBox: { paddingVertical: 5, justifyContent: "flex-start", gap: 5 },
  titile: { fontSize: 22, fontWeight: "bold", marginTop: 15 },
  subtitle: { fontSize: 15, color: "#8d8d8dff" },
  separator: { height: 1.5, backgroundColor: "#E3E3E3", marginVertical: 20, width: "90%", marginLeft: 15 },
  webButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B14409",
    width: 170,
    height: 30,
    borderRadius: 20,
    padding: 5,
    marginTop: 14,
  },
  Buttonorg: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    width: 170,
    height: 30,
  },
  webButtonText: { fontSize: 15, fontWeight: "bold", color: "white" },
  bottomTop: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: 25,
    paddingLeft: 20,
  },
  Buttonfav: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    width: 160,
    height: 65,
    backgroundColor: "#B14409",
  },
  favButtonText: { fontSize: 20, fontWeight: "bold", color: "white" },
});
