import { getIngredientsApi } from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export type TIngredientState = {
  list: TIngredient[];
  loading: boolean;
  error: string | null;
};

export const initialState: TIngredientState = {
  list: [],
  loading: false,
  error: null
};

export const getIngredients = createAsyncThunk(
  'ingredient/get',
  getIngredientsApi
);

export const ingredientSlice = createSlice({
  name: 'ingredient',
  initialState,
  reducers: {},
  selectors: {
    isIngredientsLoading: (state) => state.loading,
    ingredientList: (state) => state.list
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.list = action.payload;
      });
  }
});

export const { ingredientList, isIngredientsLoading } =
  ingredientSlice.selectors;
export default ingredientSlice.reducer;
