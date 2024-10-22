import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [stateOfCity, setStateOfCity] = useState(
    shippingAddress?.stateOfCity || ""
  );
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const shippingHandler = (e) => {
    e.preventDefault();

    dispatch(
      saveShippingAddress({ address, city, stateOfCity, postalCode, country })
    );
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  return (
    <div className="container mx-auto p-4 lg:px-20 xl:px-24 2xl:px-36">
      <div className="container flex flex-col items-center mx-auto p-4 lg:px-20 xl:px-24 2xl:px-36">
        <ProgressSteps step1 step2 /> {/* Updated to include step3 */}
        <h1 className="text-2xl font-semibold my-6 relative xl:left-[-11rem] 2xl:left-[-11rem] lg:left-[-11rem] sm:left-[-11rem] xs:left-[-11rem] ">
          Shipping
        </h1>
        <form action="" className="w-full max-w-md">
          {" "}
          {/* Width responsive and centered */}
          <div className="mb-4">
            <label
              htmlFor="address"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Address
            </label>
            <input
              type="text"
              placeholder="Enter address"
              id="address"
              value={address}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 w-full"
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="city"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 w-full" // Made input full width
              required
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="state"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              State
            </label>
            <input
              type="text"
              id="state"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 w-full" // Made input full width
              required
              placeholder="Enter state"
              value={stateOfCity}
              onChange={(e) => setStateOfCity(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="postal-code"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Postal Code
            </label>
            <input
              type="text"
              id="postal-code"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 w-full" // Made input full width
              required
              placeholder="Enter postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="country"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Country
            </label>
            <input
              type="text"
              id="country"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 w-full" // Made input full width
              required
              placeholder="Enter country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="payment-method"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Select Payment Method:
            </label>
            <div className="flex items-center gap-4">
              <input
                type="radio"
                id="payment-method"
                defaultChecked
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"
              />
              <img
                className="h-8 w-auto"
                src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/paypal.svg"
                alt="PayPal"
              />
            </div>
          </div>
          <button
            className="p-3 my-5 rounded-lg bg-pink-500 text-white hover:bg-pink-700 w-full" // Made button full width
            type="submit"
            onClick={shippingHandler}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
