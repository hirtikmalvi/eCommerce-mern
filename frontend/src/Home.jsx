import React from "react";
import Header from "./components/Header";
import Loader from "./components/Loader";
import Message from "./components/Message";
import { useGetProductsQuery } from "./redux/api/productApiSlice";
import { Link, useParams } from "react-router-dom";
import SmallProduct from "./pages/Products/SmallProduct";

const Home = () => {
  const { keyword } = useParams();
  const { data, isError, isLoading } = useGetProductsQuery({ keyword });

  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message ||
            isError?.error ||
            "An unknown error occurred"}
        </Message>
      ) : (
        <>
          <div className="container mx-auto py-10 flex justify-between items-center lg:px-20 xl:px-24 2xl:px-36">
            <h1 className="p-4 text-2xl lg:text-[3rem]">Special Products</h1>

            <Link
              to="/shop"
              className="p-4  bg-pink-600 hover:bg-pink-700 font-bold rounded-full py-2 px-10 text-white"
            >
              Shop
            </Link>
          </div>

          <div className="container mx-auto p-4 lg:px-20 xl:px-24 2xl:px-36 transition-all duration-300">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
              {data.products.map((product) => (
                <SmallProduct key={product._id} product={product} />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
