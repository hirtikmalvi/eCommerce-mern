import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { BASE_URL } from "../../redux/constants";

const AllProducts = () => {
  const { data: products, isLoading, isError, error } = useAllProductsQuery();

  if (isError) {
    return <h2>Error Loading Products</h2>;
  }

  return (
    <div className="container mx-auto px-36">
      <div className="flex flex-col justify-center md:flex-row">
        {/* Main content */}
        <div className="w-full md:w-3/4 ml-0 md:ml-8">
          <div className="h-10 text-2xl font-semibold">
            All Products ({products?.length || 0})
          </div>
          <AdminMenu />

          {isLoading ? (
            <Loader />
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                className="m-3 mx-0 max-w-screen-lg overflow-hidden rounded-xl border shadow-lg md:pl-8"
              >
                <div className="flex flex-col overflow-hidden bg-white sm:flex-row md:h-60">
                  <div className="flex w-full flex-col p-6 sm:w-1/2 sm:p-6 lg:w-3/5">
                    <h2 className="text-xl font-bold text-gray-900 md:text-2xl lg:text-2xl">
                      {product.name}
                    </h2>
                    <p className="mt-1 text-lg font-semibold">
                      by {product.brand}
                    </p>
                    <p className="mt-1.5 mb-0 max-w-md text-gray-500">
                      {product.description.length > 30
                        ? `${product.description.substring(0, 40)}...`
                        : product.description}
                    </p>
                    <div className="flex justify-between items-center flex-wrap mb-1.5 mt-1">
                      <p className="mt-0 mb-0 max-w-md text-gray-500">
                        Product Added:{" "}
                        <span className="font-semibold text-black">
                          {moment(product.createdAt).format("DD-MMMM-YYYY")}
                        </span>
                      </p>
                      <p>
                        <span className=" text-center text-2xl font-semibold">
                          ₹ {product.price}
                        </span>
                      </p>
                    </div>
                    <Link
                      to={`/admin/product/update/${product._id}`}
                      className="group mt-auto flex w-44 cursor-pointer select-none items-center justify-center rounded-md bg-pink-500 hover:bg-pink-700 px-6 py-2 text-white transition"
                    >
                      <span className="group flex w-full items-center justify-center rounded py-0 text-center font-bold">
                        Update
                      </span>
                      <svg
                        className="flex-0 group-hover:w-6 ml-4 h-6 w-0 transition-all"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  </div>

                  <div className="order-first ml-auto h-48 w-full bg-slate-200 sm:order-none sm:h-auto sm:w-1/2 lg:w-2/5">
                    <img
                      className="h-full w-full object-cover"
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
