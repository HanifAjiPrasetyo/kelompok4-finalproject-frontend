import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrder } from "../../../slices/orderSlice";

export default function OrderTable() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Get Orders State
  const { orders, loading } = useSelector((state) => state.order);

  // Search Orders
  const [searchKey, setSearchKey] = useState("");
  const [searchOrders, setSearchOrders] = useState([]);

  useEffect(() => {
    if (searchKey && orders) {
      const items = orders.filter(
        (item) =>
          item.order_id.toLowerCase().includes(searchKey.toLowerCase()) ||
          item.status.toLowerCase().includes(searchKey.toLowerCase()) ||
          item.user.name.toLowerCase().includes(searchKey.toLowerCase()) ||
          item.date.toLowerCase().includes(searchKey.toLowerCase())
      );
      setSearchOrders(items);
    }
  }, [orders, searchKey]);

  // Accept Order
  const [isLoading, setLoading] = useState(false);

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
        <div className="fixed top-1/3 left-1/2 z-[9999]">
          <span className="loading loading-spinner loading-lg text-first"></span>
        </div>
      )}
      {isLoading && (
        <div className="fixed top-1/3 left-1/2 z-[9999]">
          <span className="loading loading-spinner loading-lg text-first"></span>
        </div>
      )}
      <div className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"}>
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap gap-5 items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className={"font-semibold text-lg"}>Orders</h3>
            </div>
            <div className="form-control">
              <input
                type="text"
                placeholder="Search"
                className="input input-sm input-bordered w-full md:w-auto"
                onChange={(e) => {
                  e.preventDefault();
                  setSearchKey(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Order ID</th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Contact</th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Item(s)</th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Status</th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Action</th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Amount</th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Ordered at</th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Ship to</th>
              </tr>
            </thead>
            <tbody>
              {searchOrders && searchKey ? (
                searchOrders.map((item) => {
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
                              onClick={(e) => {
                                if (confirm("Reject order?")) {
                                  handleRejectOrder(e, item.id);
                                }
                              }}
                            >
                              Reject
                            </button>
                          )
                        )}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                        }).format(item.amount)}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{item.date}</td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{item.ship_address}</td>
                    </tr>
                  );
                })
              ) : orders.length > 0 ? (
                orders.map((item) => {
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
                              onClick={(e) => {
                                if (confirm("Reject order?")) {
                                  handleRejectOrder(e, item.id);
                                }
                              }}
                            >
                              Reject
                            </button>
                          )
                        )}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                        }).format(item.amount)}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{item.date}</td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{item.ship_address}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-10">
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
