import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { toast } from "react-toastify";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const cart = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress, navigate]);

  const placeOrderHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        tax: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      {cart.cartItems.length === 0 ? (
        <Message>Your Cart is empty</Message>
      ) : (
        <>
          <ProgressSteps step1 step2 step3 />
          <div>
            <div className="container mx-auto p-4 lg:px-20 xl:px-24 2xl:px-36">
              <h1 className="text-2xl font-semibold mb-4">Order Summary</h1>
              <div className="relative overflow-x-auto shadow-md rounded">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100 h-12">
                    <tr>
                      <th scope="col" className="px-16 py-3">
                        <span className="sr-only">Image</span>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.cartItems.map((item) => (
                      <tr
                        key={item._id}
                        className="bg-white border-b hover:bg-gray-100"
                      >
                        <td className="p-4">
                          <img
                            src={item.image}
                            className="w-32 h-20 rounded object-cover"
                            alt={item.name}
                          />
                        </td>
                        <td className="px-6 py-4 font-semibold text-black ">
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-black">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 font-semibold text-black">
                          ₹ {item.price}
                        </td>
                        <td className="px-6 py-4 font-semibold text-black">
                          ₹ {(item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-4 my-5 border p-8 rounded-l shadow-md border-gray-200">
                <h4 className="text-xl font-semibold text-gray-900">Order:</h4>
                <div className="flex flex-col justify-between md:flex-row md:space-x-8 text-base text-gray-700">
                  {" "}
                  {/* Flexbox for inline on large screens */}
                  <div className="space-y-1">
                    {" "}
                    {/* Stacked items for small screens */}
                    <div className="flex flex-col">
                      <span>Items: ₹{cart.itemsPrice}</span>
                      <span>Shipping: ₹{cart.shippingPrice}</span>
                      <span>Tax: ₹{cart.taxPrice}</span>
                      <span className="font-bold">
                        Total: ₹{cart.totalPrice}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    {" "}
                    {/* Margin on top for small screens only */}
                    <h4 className="text-xl font-semibold text-gray-900">
                      Address:
                    </h4>
                    <dd className="mt-1 text-base font-normal text-gray-600">
                      {`${cart.shippingAddress.address}, ${cart.shippingAddress.city}, ${cart.shippingAddress.stateOfCity}, ${cart.shippingAddress.country} - ${cart.shippingAddress.postalCode}`}
                    </dd>
                  </div>
                  <div className="mt-4 md:mt-0">
                    {" "}
                    {/* Margin on top for small screens only */}
                    <h4 className="text-xl font-semibold text-gray-900">
                      Payment Method:
                    </h4>
                    <span className="inline-block">
                      <img
                        className="w-20 h-auto" // Set a fixed width for better scaling
                        src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/paypal.svg"
                        alt="PayPal"
                      />
                    </span>
                  </div>
                </div>
              </div>
              <button
                className="p-3 my-5 rounded-lg bg-pink-500 text-white hover:bg-pink-700 w-full" // Made button full width
                type="submit"
                disabled={cart.cartItems.length === 0}
                onClick={placeOrderHandler}
              >
                Continue
              </button>
              {isLoading && <Loader />}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PlaceOrder;

//1:35:00
