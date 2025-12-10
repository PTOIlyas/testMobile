import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NewsArticle } from "@/types/news";

type FavoritesContextType = {
  favorites: NewsArticle[];
  addToFavorites: (item: NewsArticle) => Promise<void>;
  removeFromFavorites: (url: string) => Promise<void>;
  isFavorite: (url: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY = "favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<NewsArticle[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: NewsArticle[] = JSON.parse(raw);
          setFavorites(parsed);
        }
      } catch (e) {
        console.warn("Failed to load favorites:", e);
      }
    })();
  }, []);

  const persist = useCallback(async (list: NewsArticle[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Failed to save favorites:", e);
    }
  }, []);

  const addToFavorites = useCallback(async (item: NewsArticle) => {
    setFavorites((prev: NewsArticle[]) => {
      if (prev.some((f) => f.url === item.url)) return prev;
      const next = [...prev, item];
      persist(next);
      return next;
    });
  }, [persist]);

  const removeFromFavorites = useCallback(async (url: string) => {
    setFavorites((prev: NewsArticle[]) => {
      const next = prev.filter((f) => f.url !== url);
      persist(next);
      return next;
    });
  }, [persist]);

  const isFavorite = useCallback(
    (url: string) => favorites.some((f) => f.url === url),
    [favorites]
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}
