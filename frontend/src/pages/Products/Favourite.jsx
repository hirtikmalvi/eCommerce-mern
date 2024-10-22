import { Link } from "react-router-dom";
import { selectFavouriteProduct } from "../../redux/features/favourites/favouriteSlice";
import { useSelector } from "react-redux";
import SmallProduct from "./SmallProduct";

const Favourite = () => {
  const favouriteProducts = useSelector(selectFavouriteProduct);

  return (
    <>
      <div className="container mx-auto py-10 flex justify-between items-center lg:px-20 xl:px-24 2xl:px-36">
        <h1 className="p-4 text-2xl lg:text-[3rem]">Favourite Products</h1>
      </div>

      {favouriteProducts.length > 0 ? (
        <>
          <div className="container mx-auto p-4 lg:px-20 xl:px-24 2xl:px-36 transition-all duration-300">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
              {favouriteProducts.map((product) => (
                <SmallProduct key={product._id} product={product} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="container mx-auto py-10 flex justify-center items-center lg:px-20 xl:px-24 2xl:px-36">
          <span className="p-4 text-xl lg:text-[2rem] text-center">
            You don't Favourite Products
          </span>
          <Link
            to="/shop"
            className=" mr-3 bg-pink-600 hover:bg-pink-700 font-bold rounded-full py-2 px-10 text-white"
          >
            Shop
          </Link>
        </div>
      )}
    </>
  );
};

export default Favourite;
