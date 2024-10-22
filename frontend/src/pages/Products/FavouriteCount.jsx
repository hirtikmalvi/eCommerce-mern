import { useSelector } from "react-redux";

const FavouriteCount = () => {
  // const favourites = useSelector((state) => state.favourites);
  const favourites = useSelector((state) => state.favourites);
  const favouriteCount = favourites.length;

  return (
    <div className="absolute left-5 top-9">
      {favouriteCount > 0 && (
        <span className="flex items-center justify-center h-4 w-4 text-sm text-white bg-pink-500 rounded-full">
          {favouriteCount}
        </span>
      )}
    </div>
  );
};

export default FavouriteCount;
