import { Stack } from "expo-router";


export default function RootLayout() {
return (
<Stack>
<Stack.Screen name="index" options={{ title: "News" }} />
<Stack.Screen name="article/article-detail" options={{ title: "Article" }} />
<Stack.Screen name="favorites/index" options={{ title: "Favorites" }} />
</Stack>
);
}