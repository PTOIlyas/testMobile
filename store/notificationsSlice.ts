import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppNotification } from "@/types/notification";

// ----- Начальное состояние -----
// Список уведомлений пустой при запуске приложения
const initialState: AppNotification[] = [];

const notificationsSlice = createSlice({
  name: "notifications",  // Имя слайса
  initialState,
  reducers: {
    // ----- Добавление уведомлений -----
    // Добавляет массив уведомлений в начало списка
    // Проверяет, нет ли дубликатов по id
    addNotifications(state, action: PayloadAction<AppNotification[]>) {
      action.payload.forEach((n) => {
        if (!state.find((x) => x.id === n.id)) {
          state.unshift(n); // добавляем в начало
        }
      });
    },

    // ----- Отметка уведомления как прочитанного -----
    // Ищет уведомление по id и меняет поле unread на false
    markAsRead(state, action: PayloadAction<string>) {
      const n = state.find((x) => x.id === action.payload);
      if (n) n.unread = false;
    },
  },
});

// Экспортируем actions для использования в компонентах
export const { addNotifications, markAsRead } = notificationsSlice.actions;

// Экспортируем редьюсер для добавления в store
export default notificationsSlice.reducer;
