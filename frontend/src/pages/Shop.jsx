import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
  setBrands,
  setCheckedBrands,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import SmallProduct from "./Products/SmallProduct";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio, brands, checkedBrands } =
    useSelector((state) => state.shop);

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useFetchCategoriesQuery();
  const {
    data: filteredProducts,
    isLoading: filteredProductsLoading,
    isError: isFilteredProductsError,
    error: filteredProductsError,
  } = useGetFilteredProductsQuery({ checked, radio, checkedBrands });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!filteredProductsLoading && filteredProducts) {
      dispatch(setProducts(filteredProducts));

      const uniqueBrands = [...new Set(filteredProducts.map((p) => p.brand))];
      dispatch(setBrands(uniqueBrands));
    }
  }, [filteredProducts, filteredProductsLoading, dispatch]);

  useEffect(() => {
    if (!isCategoriesLoading) {
      dispatch(setCategories(categoriesData));
    }
  }, [categoriesData, isCategoriesLoading, dispatch]);

  const handleCheck = (val, id) => {
    const updateChecked = val
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updateChecked));
  };

  const handleBrand = (val, brand) => {
    const updatedCheckedBrands = val
      ? [...checkedBrands, brand]
      : checkedBrands.filter((b) => b !== brand);
    dispatch(setCheckedBrands(updatedCheckedBrands));
  };

  const handlePriceRadio = (price) => {
    dispatch(setRadio(price));
  };

  // const clearFilters = () => {
  //   ;
  // };

  const pricesArr = [
    [0, 100],
    [101, 200],
    [201, 500],
    [501, 1000],
    [1001, 2500],
    [2501, 5000],
    [5001, 10000],
    [10001, 20000],
    [20001, 50000],
    [50001, 500000],
  ];

  return (
    <div className="container mx-auto p-4 lg:px-20 xl:px-24 2xl:px-36 transition-all duration-300">
      <h1 className="text-4xl font-semibold mb-4">Shop</h1>

      <div className="flex flex-col lg:flex-row">
        {/* Filtering Menu */}
        <div className="lg:w-1/4 mb-4 lg:mb-0">
          <button
            className="mb-4 bg-pink-500 text-white rounded-md px-4 py-2 lg:hidden"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {isDropdownOpen ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Dropdown Filter Menu */}
          <div
            className={`lg:block ${
              isDropdownOpen ? "block" : "hidden"
            } lg:relative`}
          >
            <h2 className="py-2 px-2 mb-2 w-fit border rounded-xl bg-pink-500 text-white">
              Filter by Categories
            </h2>
            {isCategoriesLoading && filteredProductsLoading ? (
              <Loader />
            ) : (
              categories.map((category) => (
                <div className="flex items-center" key={category._id}>
                  <input
                    type="checkbox"
                    id={category._id}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                    onClick={(e) => handleCheck(e.target.checked, category._id)}
                  />
                  <label
                    htmlFor={category._id}
                    className="ms-2 text-sm font-medium text-black"
                  >
                    {category.name}
                  </label>
                </div>
              ))
            )}

            {/* Filter by Brands */}
            <div className="mt-5">
              <h2 className="py-2 px-2 mb-2 w-fit border rounded-xl bg-pink-500 text-white">
                Brands
              </h2>
              {filteredProductsLoading ? (
                <Loader />
              ) : (
                <>
                  {brands.length > 0 ? (
                    brands.map((brand) => (
                      <div className="flex items-center" key={brand}>
                        <input
                          type="checkbox"
                          id={brand}
                          onClick={(e) => handleBrand(e.target.checked, brand)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={brand}
                          className="ms-2 text-sm font-medium text-black"
                        >
                          {brand}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p>No brands available</p>
                  )}
                </>
              )}
            </div>

            {/* Filter by Price */}
            <div className="mt-5">
              <h2 className="py-2 px-2 mb-2 w-fit border rounded-xl bg-pink-500 text-white">
                Price
              </h2>
              {isCategoriesLoading && filteredProductsLoading ? (
                <Loader />
              ) : (
                pricesArr.map((price, index) => (
                  <div className="flex items-center my-2" key={index}>
                    <input
                      id={`price-filter-${index}`}
                      type="radio"
                      name="default-radio"
                      value={price}
                      onClick={() => handlePriceRadio(price)}
                      className="w-4 h-4 text-pink-500 bg-gray-100 border-gray-300"
                    />
                    <label
                      htmlFor={`price-filter-${index}`}
                      className="ms-2 text-sm font-medium text-gray-900"
                    >
                      {`₹ ${price[0]} - ${price[1]}`}
                    </label>
                  </div>
                ))
              )}
            </div>

            {/* Clear Filters Button */}
            <button
              className="mt-4 bg-pink-500 hover:bg-pink-700 text-white rounded-md px-4 py-2"
              onClick={() => window.location.reload()}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProductsLoading ? (
              <Loader />
            ) : isFilteredProductsError ? (
              <h1 className="p-4 text-2xl lg:text-[3rem] text-center">
                {filteredProductsError?.data?.message}
              </h1>
            ) : (
              products.map((product) => (
                <SmallProduct key={product._id} product={product} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
