import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppNotification } from "@/types/notification";

const initialState: AppNotification[] = [];

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotifications(state, action: PayloadAction<AppNotification[]>) {
      action.payload.forEach((n) => {
        if (!state.find((x) => x.id === n.id)) {
          state.unshift(n);
        }
      });
    },

    markAsRead(state, action: PayloadAction<string>) {
      const n = state.find((x) => x.id === action.payload);
      if (n) n.unread = false;
    },
  },
});

export const { addNotifications, markAsRead } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
