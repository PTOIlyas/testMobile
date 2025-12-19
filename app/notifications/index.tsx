import React, { useRef } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { ExitIcon, SettingIcon } from "@/assets/icons";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { router } from "expo-router";

/**
 * Тип уведомления
 * Содержит id, заголовок, описание и флаг "непрочитано"
 */
type Notification = {
  id: string;
  title: string;
  description: string;
  unread: boolean;
};

export default function NotificationsScreen() {
  /**
   * Получаем уведомления из Redux
   * Это глобальный state, который может обновляться с других экранов
   */
  const notifications = useSelector(
    (state: RootState) => state.notifications
  );

  /**
   * Хранение анимаций для "точек" непрочитанных уведомлений
   * useRef позволяет сохранять объект между рендерами
   */
  const dotAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

  // Инициализация анимации для каждой "точки"
  notifications.forEach((item) => {
    if (!dotAnimations[item.id]) {
      dotAnimations[item.id] = new Animated.Value(item.unread ? 1 : 0);
    }
  });

  /**
   * Обработка нажатия на уведомление
   * Запускаем анимацию исчезновения "точки"
   */
  const handlePress = (id: string) => {
    Animated.timing(dotAnimations[id], {
      toValue: 0, // прозрачность 0
      duration: 300, // длительность анимации
      useNativeDriver: true, // производительность через native driver
    }).start();
  };

  /**
   * Отображение пустого состояния, если уведомлений нет
   */
  const renderEmpty = () => (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyText}>Нет уведомлений</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <ExitIcon width={25} height={25} fill="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Notifications</Text>
        <SettingIcon width={22} height={22} fill="black" />
      </View>

      {/* SECTION TITLE */}
      <Text style={styles.section}>Previously</Text>

      {/* LIST OF NOTIFICATIONS */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.card}
            onPress={() => handlePress(item.id)}
          >
            {/* Аватар или иконка уведомления */}
            <View style={styles.avatar} />

            {/* Текст уведомления */}
            <View style={styles.textBlock}>
              {/* Заголовок + точка непрочитанного */}
              <View style={styles.titleRow}>
                <Text style={styles.notificationTitle}>{item.title}</Text>

                {item.unread && (
                  <Animated.View
                    style={[styles.dot, { opacity: dotAnimations[item.id] }]}
                  />
                )}
              </View>

              {/* Описание уведомления */}
              <Text style={styles.notificationDescription}>
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

/**
 * Стили для экрана уведомлений
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    marginTop: 28,
    height: 100,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },

  section: {
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 16,
    fontSize: 16,
    color: "#4a4a4a",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    minHeight: 110,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#C77A3A",
    marginRight: 12,
  },

  textBlock: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },

  notificationDescription: {
    fontSize: 14,
    color: "#555",
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#C77A3A",
    marginLeft: 8,
  },

  emptyBox: {
    alignItems: "center",
    marginTop: 80,
  },

  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});
