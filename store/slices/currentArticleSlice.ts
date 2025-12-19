import { FavoriteArticle, NewsArticle } from "@/types/news";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type State = {
  currentArticle: FavoriteArticle | null;
};

const initialState: State = {
  currentArticle: null,
};

const currentArticleSlice = createSlice({
  name: "currentArticle",
  initialState,
  reducers: {
    setCurrentArticle(state, action: PayloadAction<FavoriteArticle>) {
      state.currentArticle = action.payload;
    },
    clearCurrentArticle(state) {
      state.currentArticle = null;
    },
  },
});

export const { setCurrentArticle, clearCurrentArticle } =
  currentArticleSlice.actions;

export default currentArticleSlice.reducer;