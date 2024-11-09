import { act, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import moment from "moment";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  // Set the timeout duration to match the backend (e.g., 10 seconds = 10000 ms)
  const PAYMENT_TIMEOUT = 60000;

  // Set initial countdown based on the payment timeout
  const [timeLeft, setTimeLeft] = useState(PAYMENT_TIMEOUT / 1000);

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  useEffect(() => {
    // Start the timeout when the component mounts
    const timeoutId = setTimeout(() => {
      // Check if the order is unpaid after the timeout
      if (!order?.isPaid) {
        toast.error("Payment window has expired. Please place a new order.");
        navigate("/shop"); // Redirect to orders page or another appropriate route
      }
    }, PAYMENT_TIMEOUT);

    const timeLeftInterval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Clear the timeout if the order is paid or on component unmount
    return () => {
      clearTimeout(timeoutId);
      clearInterval(timeLeftInterval);
    };
  }, [order, navigate, PAYMENT_TIMEOUT]);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadingPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            clientId: paypal?.clientId,
            currency: "INR",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadingPayPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error?.message);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  function onError(err) {
    toast.error(err?.message);
  }

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Delivered Successfully");
    } catch (error) {
      toast.success(error?.data?.message || error?.message);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error?.message}</Message>
  ) : (
    <div className="container mx-auto p-4 lg:px-20 xl:px-24 2xl:px-36">
      {/* Main Content Container */}
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Table for Products */}
        <div className="relative overflow-x-auto shadow-md rounded mb-5 lg:mb-0 lg:flex-1">
          <div className="max-h-96 overflow-y">
            {" "}
            {/* Set max height for scrollable content */}
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
                {order.orderItems.map((item) => (
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
                    <td className="px-6 py-4 font-semibold text-black">
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
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
        </div>

        {/* Shipping and Order Summary as a Stack */}
        <div className="flex flex-col lg:w-1/3 lg:space-y-4 sticky top-0">
          {/* Shipping Information */}
          <div className="space-y-4 mb-3 border p-8 rounded-l shadow-md border-gray-200">
            <h4 className="text-xl font-semibold text-gray-900">Shipping:</h4>
            <div className="text-base text-gray-700 flex flex-col">
              {!order.isPaid ? (
                <span>
                  <span className="font-bold">Time Left:</span> {timeLeft}{" "}
                  seconds
                </span>
              ) : (
                <></>
              )}
              <span>
                <span className="font-bold">Order Id:</span> {order._id}
              </span>
              <span>
                <span className="font-bold">Username:</span>{" "}
                {order.user.userName}
              </span>
              <span>
                <span className="font-bold">Email:</span> {order.user.email}
              </span>
              <span>
                <span className="font-bold">Address: </span>
                {`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.stateOfCity}, ${order.shippingAddress.country} - ${order.shippingAddress.postalCode}`}
              </span>
              <span>
                <span className="font-bold">Payment method: </span>
                {order.paymentMethod}
              </span>
              <span
                className={`font-bold ${
                  order.isPaid ? `text-green-500` : `text-red-500`
                }`}
              >
                <span className="font-bold">isPaid: </span>
                {order.isPaid
                  ? `Paid At ${moment(order.paidAt).format(
                      "h:mm A dddd DD-MMM-YYYY"
                    )}`
                  : "Payment Pending"}
              </span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4 border p-8 rounded-l shadow-md border-gray-200">
            <h4 className="text-xl font-semibold text-gray-900">
              Order Summary:
            </h4>
            <div className="space-y-1 text-base">
              <div className="flex flex-col">
                <span>
                  <span className="font-bold">Items: </span> ₹{order.itemsPrice}
                </span>
                <span>
                  <span className="font-bold">Shipping: </span> ₹
                  {order.shippingPrice}
                </span>
                <span>
                  <span className="font-bold">Tax: </span> ₹{order.taxPrice}
                </span>
                <span className="font-bold mb-5">
                  <span className="font-bold">Total: </span> ₹{order.totalPrice}
                </span>
              </div>
              {!order.isPaid && !userInfo.isAdmin && (
                <div>
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    />
                  )}
                </div>
              )}
            </div>
            {loadingDeliver && <Loader />}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <div>
                  <button
                    type="button"
                    className="bg-pink-500 hover:bg-pink-600 text-white w-full py-2"
                    onClick={deliverHandler}
                  >
                    Mark As Deliver
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
