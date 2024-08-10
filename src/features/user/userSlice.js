import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../utils/constants";
import axios from "axios";

export const createUser = createAsyncThunk(
  "users/createUser",
  async (payload, thunkAPI) => {
    try {
      const res = await axios.post(`${BASE_URL}/users`, payload);
      return res.data;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const loginUser = createAsyncThunk(
  "users/loginUser",
  async (payload, thunkAPI) => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, payload); // с фейкового сервера
      const login = await axios(`${BASE_URL}/auth/profile`, {
        headers: {     
          Authorization: `Bearer ${res.data.access_token}` // с фейкового сервера
        }
      })
      return login.data;
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const addCurrentUser = (state, { payload }) => {
  state.currentUser = payload;
}

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null, // текущий пользователь
    cart: [], // корзина
    favourites: [], // избранные товары
    isLoading: false, // состояние загрузки товаров
    formType: "signup",
    showForm: false, // форма авторизации открывается при нажатии на аватарку пользователя в шапке
  },
  reducers: {
    addItemToCart: (state, { payload }) => { // добавление товара в корзину
      let newCart = [...state.cart];
      const found = state.cart.find(({ id }) => id === payload.id);
      // const found = true
      console.log("newCart slice: ", newCart);
      console.log("payload slice: ", payload);

      if (found) {
        newCart = newCart.map((item) => {
          return item.id === payload.id
            ? { ...item, quantity: payload.quantity || item.quantity + 1 }
            : item;
        });
      } else newCart.push({ ...payload, quantity: 1 });
      state.cart = newCart;
      console.log("newCart2 slice: ", newCart);
    },
    addItemToFavourites: (state, { payload }) => { // добавление товара в избранные
      let newFavourites = [...state.favourites];
      const found = state.favourites.find(({ id }) => id === payload.id);
      // const found = true
      console.log("newCfavourites slice: ", newFavourites);
      console.log("payload slice: ", payload);

      if (!found) {
        newFavourites.push({ ...payload });
        state.favourites = newFavourites;
        console.log("newFavourites2 slice: ", newFavourites);
      }
    },
    toggleForm: (state, { payload }) => { // открытие формы авторизации
      state.showForm = payload
    },
    toggleFormType: (state, { payload }) => {
      state.formType = payload
    },
  },
  //   }
  extraReducers: (builder) => {
    builder.addCase(createUser.fulfilled, addCurrentUser);
    builder.addCase(loginUser.fulfilled, addCurrentUser);
  },
});

export const { addItemToCart, addItemToFavourites, toggleForm, toggleFormType } = userSlice.actions;

export default userSlice.reducer;



