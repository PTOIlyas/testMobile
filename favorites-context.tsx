import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FavoriteArticle, NewsArticle } from "@/types/news";

type FavoritesContextType = {
  favorites: FavoriteArticle[];
  addToFavorites: (item: NewsArticle, query: string) => Promise<void>;
  removeFromFavorites: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

const STORAGE_KEY = "favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка избранного из AsyncStorage при монтировании
  useEffect(() => {
    async function loadFavorites() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: FavoriteArticle[] = JSON.parse(raw);
          setFavorites(parsed);
        }
      } catch (e) {
        console.warn("Failed to load favorites:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadFavorites();
  }, []);

  // Сохраняем в AsyncStorage при изменении favorites
  const persistFavorites = useCallback(async (list: FavoriteArticle[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Failed to save favorites:", e);
    }
  }, []);

  const addToFavorites = useCallback(
    async (item: NewsArticle, query: string) => {
      setFavorites((prev) => {
        if (prev.some((fav) => fav.id === item.id)) return prev;

        const next: FavoriteArticle[] = [
          ...prev,
          {
            ...item,
            query, // ⭐ ВАЖНО
          },
        ];

        persistFavorites(next);
        return next;
      });
    },
    [persistFavorites]
  );

  const removeFromFavorites = useCallback(
    async (id: string) => {
      setFavorites((prev) => {
        const next = prev.filter((fav) => fav.id !== id);
        persistFavorites(next);
        return next;
      });
    },
    [persistFavorites]
  );

  const isFavorite = useCallback(
    (id: string) => {
      return favorites.some((fav) => fav.id === id);
    },
    [favorites]
  );

  // Опционально: очистить все избранное
  const clearFavorites = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setFavorites([]);
    } catch (e) {
      console.warn("Failed to clear favorites:", e);
    }
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        clearFavorites,
      }}
    >
      {isLoading
        ? // Пока загружаем данные — можно показать спиннер или null
          null
        : children}
    </FavoritesContext.Provider>
  );
}

// Хук для использования контекста с проверкой
export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
