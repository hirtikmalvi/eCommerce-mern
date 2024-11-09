import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Loader from "./components/Loader";
import Message from "./components/Message";
import { useGetProductsQuery } from "./redux/api/productApiSlice";
import { Link } from "react-router-dom";
import SmallProduct from "./pages/Products/SmallProduct";
import Pagination from "./components/Pagination";
import { Slide, toast } from "react-toastify";

const Home = () => {
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState([]); // Store displayed products

  // Fetch products based on keyword and page
  const { data, isError, isLoading, error } = useGetProductsQuery({
    keyword,
    page,
  });

  useEffect(() => {
    if (data && !isLoading) {
      // If data is successfully fetched
      setPages(data.pages);
      if (data.products && data.products.length > 0) {
        setProducts(data.products);
      } else {
        // If no products found with a valid response
        setProducts([]); // Clear products but don't show toast
      }
    }

    if (isError && error?.status === 404) {
      // Show toast only for 404 errors and reset keyword
      toast.error(`No products found with the keyword "${keyword}"`, {
        autoClose: 1000,
        transition: Slide,
      });
      setKeyword(""); // Reset the keyword
    }
  }, [data, isLoading, isError, error, keyword]);

  const previousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const nextPage = () => {
    if (page < pages) setPage(page + 1);
  };

  return (
    <>
      <Header />
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="container mx-auto mt-10 flex justify-between items-center lg:px-20 xl:px-24 2xl:px-36">
            <h1 className="p-4 text-2xl lg:text-[3rem]">Products</h1>
            <Link
              to="/shop"
              className="p-4 bg-pink-600 hover:bg-pink-700 font-bold rounded-full py-2 px-10 text-white"
            >
              Shop
            </Link>
          </div>

          <div className="container mx-auto p-4 lg:px-20 xl:px-24 2xl:px-36 transition-all duration-300">
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-fit p-2 mb-4"
              placeholder="Search Product"
              onChange={(e) => setKeyword(e.target.value)}
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
              {products.map((product) => (
                <SmallProduct key={product._id} product={product} />
              ))}
            </div>
            <Pagination
              previousPage={previousPage}
              nextPage={nextPage}
              currentPage={page}
              pages={pages}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Home;
