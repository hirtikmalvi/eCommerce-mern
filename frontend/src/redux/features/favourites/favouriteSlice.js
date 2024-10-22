import { createSlice } from "@reduxjs/toolkit";

const favouriteSlice = createSlice({
  name: "favourites",
  initialState: [],
  reducers: {
    addToFavourites: (state, action) => {
      //Checking whether the product is already favourite or not
      if (!state.some((product) => product._id === action.payload._id)) {
        state.push(action.payload);
      }
    },
    removeFromFavourites: (state, action) => {
      //Remove the product with matching ID
      return state.filter((product) => product._id !== action.payload._id);
    },
    setFavourites: (state, action) => {
      //Set the favourites from localStorage
      return action.payload;
    },
  },
});

export const { addToFavourites, removeFromFavourites, setFavourites } =
  favouriteSlice.actions;

export const selectFavouriteProduct = (state) => state.favourites;
export default favouriteSlice.reducer;
