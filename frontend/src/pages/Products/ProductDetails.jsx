import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa"; // Import Font Awesome star icons
import { IoTime } from "react-icons/io5";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import moment from "moment";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const {
    data: product,
    isLoading,
    isError,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  console.log(product);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const [quantity, setQuantity] = useState(0); // Start quantity at 1
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Helper function to get star elements based on rating
  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => {
        const fullStarThreshold = i + 1;
        if (rating >= fullStarThreshold) {
          return <FaStar key={i} className="w-5 h-5 text-yellow-500" />;
        } else if (rating >= fullStarThreshold - 0.5) {
          return <FaStarHalfAlt key={i} className="w-5 h-5 text-yellow-500" />;
        } else {
          return <FaRegStar key={i} className="w-5 h-5 text-gray-300" />;
        }
      });
  };

  // Increment quantity
  const incrementQuantity = () => {
    if (quantity < product.countInStock) {
      setQuantity((prevQty) => prevQty + 1);
    } else {
      toast.error("Cannot exceed stock limit");
    }
  };

  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 0) {
      setQuantity((prevQty) => prevQty - 1);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Some error has occured while adding a review"
      );
    }
  };

  const addToCartHandler = (e) => {
    e.preventDefault();
    dispatch(addToCart({ ...product, quantity }));
    navigate("/cart");
  };

  return (
    <>
      <div className="container mx-auto p-4 lg:px-20 xl:px-24 2xl:px-36 transition-all duration-300">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-lg shadow w-full h-auto">
              <>
                <div className="flex-shrink-0">
                  <img
                    className="object-cover w-full h-64 md:w-[25rem] md:h-full rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                    src={product.image}
                    alt={product.name}
                  />
                </div>
                <div className="flex flex-col justify-between py-8 pl-12 leading-normal flex-grow">
                  <h5 className="mb-0 text-2xl font-bold tracking-tight text-gray-900">
                    {product.name}
                  </h5>
                  <h6 className="mb-2 text-xl tracking-tight text-gray-900">
                    by {product.brand}
                  </h6>
                  <p className="mb-3 font-normal text-gray-700">
                    {product.description}
                  </p>
                  <div className="mb-3">
                    <p className="flex items-center">
                      {renderStars(product.rating)} ({product.numReviews}{" "}
                      Reviews)
                    </p>
                    <p className="mb-1 font-normal text-gray-700">
                      Ratings: {product.rating}
                    </p>
                    {product.countInStock > 0 ? (
                      <p className="text-sm text-green-600 mb-1">
                        In Stock: <span>{product.countInStock}</span>
                      </p>
                    ) : (
                      <p className="text-sm text-red-600 mb-1">
                        In Stock: <span>{product.countInStock}</span>
                      </p>
                    )}
                    <p className="text-sm mb-2">
                      Added: {moment(product.createdAt).fromNow()}
                    </p>
                    <p className="text-xl font-semibold text-pink-600 mb-1">
                      Price: ₹{product.price}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {" "}
                    {/* Adding space between elements */}
                    <div className="relative flex items-center max-w-[8rem] mr-2">
                      {" "}
                      {/* Flex container for quantity buttons */}
                      <button
                        type="button"
                        onClick={decrementQuantity}
                        className="rounded-l-lg p-3 h-9 border border-gray-300 focus:ring-2 focus:outline-none flex items-center"
                      >
                        <AiOutlineMinus />
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        readOnly
                        className="border border-gray-300 h-9 text-center text-sm block w-full py-2.5"
                      />
                      <button
                        type="button"
                        onClick={incrementQuantity}
                        className="rounded-r-lg p-3 h-9 border border-gray-300 focus:ring-2 focus:outline-none flex items-center"
                      >
                        <AiOutlinePlus />
                      </button>
                    </div>
                    <button
                      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white rounded-lg bg-pink-500  focus:ring-4 focus:outline-none focus:ring-pink-300 ${
                        quantity === 0 ? `bg-pink-500` : `hover:bg-pink-600`
                      }`}
                      disabled={quantity === 0}
                      onClick={addToCartHandler}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </>
            </div>
            <ProductTabs
              loadingProductReview={loadingProductReview}
              userInfo={userInfo}
              rating={rating}
              setRating={setRating}
              comment={setComment}
              setComment={setComment}
              product={product}
              submitHandler={submitHandler}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
