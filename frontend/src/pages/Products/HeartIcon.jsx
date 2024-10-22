import { useEffect } from "react";
import { FaHeart, FaRegHeart, FaVaadin } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  addToFavourites,
  removeFromFavourites,
  setFavourites,
} from "../../redux/features/favourites/favouriteSlice";
import {
  addFavouritesToLocalStorage,
  getFavouritesFromLocalStorage,
  removeFavouritesFromLocalStorage,
} from "../../../Utils/LocalStorage";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favourites) || [];
  const isFavourite = favourites.some((p) => p._id === product._id);
  useEffect(() => {
    const favouritesFromLocalStorage = getFavouritesFromLocalStorage();
    dispatch(setFavourites(favouritesFromLocalStorage));
  }, []);

  const toggleFavourites = () => {
    if (isFavourite) {
      dispatch(removeFromFavourites(product));
      // remove the product from the localStorage as well
      removeFavouritesFromLocalStorage(product._id);
    } else {
      dispatch(addToFavourites(product));
      // add the product to localStorage as well

      addFavouritesToLocalStorage(product);
    }
  };

  return (
    <div className="cursor-pointer" onClick={toggleFavourites}>
      {isFavourite ? (
        <FaHeart className="text-pink-500" size={25} />
      ) : (
        <FaRegHeart className="text-black" size={25} />
      )}
    </div>
  );
};

export default HeartIcon;
