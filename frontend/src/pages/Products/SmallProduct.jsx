import { Link } from "react-router-dom";
import { FaCartArrowDown } from "react-icons/fa";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  const stars = [
    <svg
      key="filled"
      className="w-4 h-4 text-yellow-300"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 22 20"
    >
      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
    </svg>,
    <svg
      key="empty"
      className="w-4 h-4 text-gray-200"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 22 20"
    >
      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
    </svg>,
  ];

  const count = [1, 2, 3, 4, 5];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <Link to={`/product/${product._id}`}>
        <img
          className="rounded-lg w-full h-[10rem] object-cover"
          src={product.image}
          alt={product.name}
        />
      </Link>
      <div className="px-2">
        <Link to={`/product/${product._id}`}>
          <h5 className="text-lg font-semibold tracking-tight text-gray-900 mt-2">
            {product.name}
          </h5>
        </Link>
        <div className="flex items-center mt-2.5 mb-5">
          {count.map((val, index) => (
            <span key={index}>
              {val <= product.rating ? stars[0] : stars[1]}
            </span>
          ))}
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded ms-3">
            {product.rating}
          </span>
        </div>
        <div className="flex items-center justify-between mb-0">
          <span className="text-2xl font-bold text-gray-900">
            ₹{product.price}
          </span>
          <div className=" focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 text-center">
            {/* <FaCartArrowDown size={20} /> */}
            <HeartIcon product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmallProduct;
