import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrder } from "../../../slices/orderSlice";
import axios from "axios";

export default function CardOrders() {
  // Get Incoming Orders
  const { token } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.order);
  const [newOrders, setNewOrders] = useState([]);

  useEffect(() => {
    setNewOrders(orders.slice(0, 10));
  }, [orders]);

  const dispatch = useDispatch();

  // Accept Order
  const [loading, setLoading] = useState(false);

  const handleAcceptOrder = async (orderId) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    setLoading(true);

    await axios
      .get(`${backendURL}/acceptOrder/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(fetchOrder(token)).then(() => {
          setLoading(false);
          alert(res.data.message);
        });
      })
      .catch((err) => console.log(err));
  };

  // Reject Order
  const handleRejectOrder = async (orderId) => {
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    setLoading(true);

    await axios
      .get(`${backendURL}/rejectOrder/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        dispatch(fetchOrder(token)).then(() => {
          setLoading(false);
          alert(res.data.message);
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {loading && (
        <div className="fixed top-1/2 left-1/2 z-[999]">
          <span className="loading loading-spinner loading-lg text-first"></span>
        </div>
      )}
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-blueGray-700">Incoming Orders</h3>
            </div>
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              <a className="bg-first text-third text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" href="admin/order">
                See all
              </a>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Orders table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Order ID</th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Contact</th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Item(s)</th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Amount</th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Status</th>
                <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 && newOrders.length > 0 ? (
                newOrders.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{item.order_id}</td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <div className="flex flex-col gap-2">
                          <div className="text-sm">{item.user.name}</div>
                          <div className="text-xs opacity-75">{item.user.email}</div>
                        </div>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {item.items.map((i) => {
                          return (
                            <div className="flex items-center gap-x-3 mb-2" key={i.id}>
                              {i.quantity}x
                              <div className="avatar">
                                <div className="mask mask-squircle w-12 h-12">
                                  <img src={i.image} alt={i.title} />
                                </div>
                              </div>
                              <div>
                                <div className="font-bold text-xs">{i.title}</div>
                                <div className="text-xs opacity-75">
                                  {i.category} | Size : {i.size}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                        }).format(item.amount)}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {item.status === "Unpaid" && <div className="badge badge-warning">{item.status}</div>}
                        {item.status === "Paid" && <div className="badge badge-primary">{item.status}</div>}
                        {item.status === "Accepted" && <div className="badge badge-success text-white">{item.status}</div>}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {item.status === "Paid" ? (
                          <div className="flex items-center gap-2 justify-center">
                            <button
                              className="btn btn-success btn-xs text-white"
                              onClick={() => {
                                if (confirm("Accept order?")) {
                                  handleAcceptOrder(item.id);
                                }
                              }}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-error btn-xs text-white"
                              onClick={() => {
                                if (confirm("Reject order?")) {
                                  handleRejectOrder(item.id);
                                }
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          item.status === "Unpaid" && (
                            <button
                              className="btn btn-error btn-xs text-white"
                              onClick={() => {
                                if (confirm("Reject order?")) {
                                  handleRejectOrder(item.id);
                                }
                              }}
                            >
                              Reject
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="text-center py-10" colSpan={6}>
                    Empty
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
