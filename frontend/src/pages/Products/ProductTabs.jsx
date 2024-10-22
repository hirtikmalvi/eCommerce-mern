import moment from "moment";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  rating,
  setRating,
  comment,
  setComment,
  product,
  submitHandler,
}) => {
  const [activeTab, setActiveTab] = useState("allReviews"); // State to track the active tab

  const handleTabClick = (tabName) => {
    setActiveTab(tabName); // Set the active tab
  };

  const { data, isLoading, isError, error } = useGetTopProductsQuery();

  const listOfTabs = {
    allReviews: "Reviews",
    writeYourReview: "Write a Review",
    relatedProducts: "Related Products",
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg mt-5">
      <ul
        className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 rounded-t-lg bg-gray-50"
        role="tablist"
      >
        {Object.keys(listOfTabs).map((item) => (
          <li key={item} className="me-2">
            <button
              onClick={() => handleTabClick(item)}
              type="button"
              role="tab"
              aria-controls={item}
              aria-selected={activeTab === item}
              className={`inline-block p-4 rounded-l-lg hover:bg-gray-100 ${
                activeTab === item ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {listOfTabs[item]}
            </button>
          </li>
        ))}
      </ul>

      {loadingProductReview ? (
        <Loader />
      ) : (
        <div id="defaultTabContent">
          {/* Write A Review */}
          <div
            className={`p-4 bg-white rounded-lg ${
              activeTab === "writeYourReview" ? "block" : "hidden"
            }`}
            id="about"
            role="tabpanel"
            aria-labelledby="about-tab"
          >
            {!userInfo ? (
              <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-900">
                Please Login/SignUp to write a review!
                <span>
                  {" "}
                  <Link to="/login">Login</Link>
                </span>
              </h2>
            ) : (
              <>
                <form onSubmit={submitHandler} className="w-80">
                  <div>
                    <label
                      htmlFor="message"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Write A Review
                    </label>
                    <textarea
                      onChange={(e) => setComment(e.target.value)}
                      id="message"
                      rows="2"
                      className="block p-2.5 mb-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                      placeholder="Write your review here..."
                    ></textarea>
                  </div>
                  <div>
                    <label
                      htmlFor="rating"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Rating
                    </label>
                    <div className="flex justify-between">
                      <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        required
                        className="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-52 p-2.5"
                      >
                        <option defaultValue>Select</option>
                        <option value="1">Poor</option>
                        <option value="2">Fair</option>
                        <option value="3">Good</option>
                        <option value="4">Very Good</option>
                        <option value="5">Excellent</option>
                      </select>

                      <button
                        className={`inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white rounded-lg bg-pink-500  focus:ring-4 focus:outline-none ${
                          userInfo
                            ? `bg-pink-500 hover:bg-pink-700`
                            : `bg-pink-500`
                        }`}
                        disabled={!userInfo}
                      >
                        Add Review
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Reviews */}
          <div
            className={`p-4 bg-white rounded-lg ${
              activeTab === "allReviews" ? "block" : "hidden"
            }`}
            id="services"
            role="tabpanel"
            aria-labelledby="services-tab"
          >
            {product.reviews.length === 0 ? (
              <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-900">
                No Reviews Available
              </h2>
            ) : (
              product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="flex flex-col gap-1 w-full max-w-[320px]"
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-gray-900">
                      @{review.name}
                      {" ⋅"}
                    </span>
                    <span className="text-sm font-normal">
                      {moment(review.createdAt).fromNow()}
                    </span>
                  </div>
                  <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl">
                    <p className="text-sm font-normal"> {review.comment}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Related Product */}
          <div
            className={`p-4 bg-white rounded-lg ${
              activeTab === "relatedProducts" ? "block" : "hidden"
            }`}
            id="statistics"
            role="tabpanel"
            aria-labelledby="statistics-tab"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
              {isLoading ? (
                <Loader />
              ) : (
                data.map((product) => (
                  <SmallProduct key={product._id} product={product} />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTabs;
