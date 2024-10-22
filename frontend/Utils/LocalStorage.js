//Add product to a localStorage
export const addFavouritesToLocalStorage = (product) => {
  const favourites = getFavouritesFromLocalStorage();
  if (!favourites.some((p) => p._id === product._id)) {
    favourites.push(product);
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }
};

//Remove product from a localStorage
export const removeFavouritesFromLocalStorage = (productId) => {
  const favourites = getFavouritesFromLocalStorage();
  const updateFavourites = favourites.filter(
    (product) => product._id !== productId
  );

  localStorage.setItem("favourites", JSON.stringify(updateFavourites));
};

//Retrive favourites from a local storage
export const getFavouritesFromLocalStorage = () => {
  const favouriteJSON = localStorage.getItem("favourites");
  return favouriteJSON ? JSON.parse(favouriteJSON) : [];
};
