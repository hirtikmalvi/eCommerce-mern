import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import moment from "moment";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  console.table(orders);

  return (
    <div className="container mx-auto p-4 lg:px-20 xl:px-24 2xl:px-36">
      {isLoading ? (
        <Loader />
      ) : orders?.orderItems?.length === 0 ? (
        <Message>Order Something</Message>
      ) : (
        <>
          <h1 className="text-2xl font-semibold mb-4">All Orders</h1>
          <div className="relative overflow-x-auto shadow-md rounded">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 h-12">
                <tr>
                  <th scope="col" className="px-16 py-3">
                    <span className="sr-only">Image</span>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    ORDER ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    USER
                  </th>
                  <th scope="col" className="px-6 py-3  text-center">
                    DATE
                  </th>
                  <th scope="col" className="px-6 py-3  text-center">
                    TOTAL
                  </th>
                  <th scope="col" className="px-6 py-3  text-center">
                    PAID
                  </th>
                  <th scope="col" className="px-6 py-3  text-center">
                    DELIVERED
                  </th>
                </tr>
              </thead>
              <tbody>
                {!isLoading &&
                  orders?.map((order) => (
                    <tr
                      key={order._id}
                      className="bg-white border-b hover:bg-gray-100"
                    >
                      <td className="p-4">
                        <img
                          src={order.orderItems[0].image}
                          className="w-32 h-20 rounded object-cover"
                          alt={order.name}
                        />
                      </td>
                      <td className="px-6 py-4 font-semibold text-black ">
                        <u>
                          <Link to={`/order/${order._id}`}>{order._id}</Link>
                        </u>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-black">
                        {order.user.userName}
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-black">
                        {moment(order.paidAt).format("DD-MMMM-YYYY")}
                      </td>
                      <td className=" text-center px-6 py-4 font-semibold text-black">
                        ₹ {order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-black  text-center">
                        {order.isPaid ? (
                          <span className="bg-green-400 px-4 py-2 rounded-xl text-white">
                            Paid
                          </span>
                        ) : (
                          <span className="bg-red-400 px-4 py-2 rounded-xl text-white">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-black  text-center">
                        {order.isPaid && order.isDelivered ? (
                          <span className="bg-green-400 px-4 py-2 rounded-xl text-white">
                            Delivered
                          </span>
                        ) : (
                          <span className="bg-red-400 px-4 py-2 rounded-xl text-white">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderList;
