import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice"; // Import the removeFromCart action
import { AiOutlineMinus, AiOutlinePlus, AiOutlineDelete } from "react-icons/ai"; // Import delete icon
import { toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const incrementQuantity = (item) => {
    if (item.quantity < item.countInStock) {
      dispatch(addToCart({ ...item, quantity: item.quantity + 1 }));
    } else {
      toast.error("Cannot exceed stock limit");
    }
  };

  const decrementQuantity = (item) => {
    if (item.quantity > 1) {
      dispatch(addToCart({ ...item, quantity: item.quantity - 1 }));
    }
  };

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.success("Item removed from cart");
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="container mx-auto p-4 lg:px-20 xl:px-24 2xl:px-36">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <h1 className="text-xl font-semibold mb-6 text-center">
          No Items in the cart!{" "}
          <Link to="/" className="bg-pink-500 px-5 py-1 border rounded">
            Buy
          </Link>
        </h1>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li
                  key={item._id}
                  className="py-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
                >
                  <div className="flex items-center space-x-4 overflow-x-hidden">
                    <img
                      className="w-28 h-28 object-cover border rounded"
                      src={item.image}
                      alt={item.name}
                    />
                    <div className="flex-1">
                      <Link
                        to={`/product/${item._id}`}
                        className="font-medium text-gray-900 truncate"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500">{item.brand}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 md:mt-0 overflow-auto">
                    <div className="flex items-center mr-4">
                      <button
                        onClick={() => decrementQuantity(item)}
                        className="rounded-l-lg p-1 h-7 border border-gray-300 focus:ring-2 focus:outline-none flex items-center"
                      >
                        <AiOutlineMinus />
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        readOnly
                        className="border text-center w-12 h-7"
                      />
                      <button
                        onClick={() => incrementQuantity(item)}
                        className="rounded-r-lg p-1 h-7 border border-gray-300 focus:ring-2 focus:outline-none flex items-center"
                      >
                        <AiOutlinePlus />
                      </button>
                    </div>
                    <span className="font-semibold text-lg">₹{item.price}</span>
                    <button
                      onClick={() => handleRemoveFromCart(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <AiOutlineDelete size={20} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white shadow border-gray-100 rounded-lg p-4 h-[20rem]">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Total Items</span>
              <span className="font-bold">{totalItems}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span className="font-bold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span className="font-bold">₹{shipping}</span>
            </div>

            <div className="flex justify-between border-t pt-2">
              <span className="font-bold">Total</span>
              <span className="font-bold">₹{total}</span>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-200 hover:bg-gray-400 text-gray-900 py-2 px-4 rounded"
              >
                Continue Shopping
              </button>
              <button
                className="bg-pink-500 hover:bg-pink-700 text-white py-2 px-4 rounded"
                onClick={() => navigate("/shipping")}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
