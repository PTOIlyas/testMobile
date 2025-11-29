import { View, Text, Image, Button, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { WebView } from "react-native-webview";

export default function ArticleDetail() {
  const { article } = useLocalSearchParams();

  // ✔ фиксим ошибку string | string[]
  const raw = Array.isArray(article) ? article[0] : article;
  const data = JSON.parse(raw);

  const [showWeb, setShowWeb] = useState(false);
  const [fav, setFav] = useState(false);

  if (showWeb) {
    return <WebView source={{ uri: data.url }} style={{ flex: 1 }} />;
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      <Image source={{ uri: data.image }} style={{ height: 250, borderRadius: 12 }} />

      <Text style={{ fontSize: 22, fontWeight: "bold", marginTop: 15 }}>{data.title}</Text>
      <Text style={{ marginVertical: 5 }}>{data.author} • {data.date}</Text>

      <Text style={{ fontSize: 16, marginTop: 10 }}>{data.content}</Text>

      <Button
        title={fav ? "Удалить из избранного" : "В избранное"}
        onPress={() => setFav(!fav)}
      />

      <Button title="Открыть оригинал" onPress={() => setShowWeb(true)} />
    </ScrollView>
  );
}
