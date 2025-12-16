import React, { useState, useRef, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { ExitIcon, SettingIcon } from "@/assets/icons";
import { router } from "expo-router";

type Notification = {
  id: string;
  title: string;
  description: string;
  unread: boolean;
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New article available",
      description: "Check out the latest sports news",
      unread: true,
    },
    {
      id: "2",
      title: "Match result updated",
      description: "Your favorite team won today",
      unread: true,
    },
    {
      id: "3",
      title: "Daily digest",
      description: "Top stories for you",
      unread: false,
    },
  ]);

  // Создаём Animated.Value для каждой карточки
  const dotAnimations = useRef(
    notifications.reduce((acc, item) => {
      acc[item.id] = new Animated.Value(item.unread ? 1 : 0);
      return acc;
    }, {} as { [key: string]: Animated.Value })
  ).current;

  const handlePress = (id: string) => {
    // Плавное исчезновение dot
    Animated.timing(dotAnimations[id], {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Обновляем состояние notifications
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, unread: false } : item
      )
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/",
            })
          }
        >
          <ExitIcon width={25} height={25} fill="white" />
        </TouchableOpacity>

        <Text style={styles.title}>Notifications</Text>

        <SettingIcon width={22} height={22} fill="#000" />
      </View>

      {/* Section title */}
      <Text style={styles.section}>Previously</Text>

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.card}
            onPress={() => handlePress(item.id)}
          >
            {/* Avatar */}
            <View style={styles.avatar} />

            {/* Text */}
            <View style={styles.textBlock}>
              <View style={styles.titleRow}>
                {/* Title */}
                <View style={styles.notificationTitleContainer}>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                </View>

                {/* Animated Dot */}
                {item.unread && (
                  <Animated.View
                    style={[
                      styles.dot,
                      { opacity: dotAnimations[item.id] },
                    ]}
                  />
                )}
              </View>

              {/* Description */}
              <View style={styles.notificationDescriptionContainer}>
                <Text style={styles.notificationDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* Header */
  header: {
    height: 70,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#ffffffff",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000ff",
  },

  /* Section */
  section: {
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 16,
    fontSize: 16,
    color: "#4a4a4aff",
  },

  /* Card */
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
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },

  notificationTitleContainer: {
    flex: 1,
  },

  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  notificationDescriptionContainer: {
    marginTop: 4,
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
  },
});
