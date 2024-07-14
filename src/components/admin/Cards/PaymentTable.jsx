import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

export default function PaymentTable() {
  // Get Payments State
  const { payments } = useSelector((state) => state.payment);
  const paymentLoading = useSelector((state) => state.payment.loading);

  // // Search Orders
  // const [searchKey, setSearchKey] = useState("");
  // const [searchPayments, setSearchPayments] = useState([]);

  // useEffect(() => {
  //   if (searchKey && payments) {
  //     const items = payments.filter(
  //       (item) =>
  //         item.order_id.toLowerCase().includes(searchKey.toLowerCase()) ||
  //         item.settlement_time.toLowerCase().includes(searchKey.toLowerCase()) ||
  //         item.user.name.toLowerCase().includes(searchKey.toLowerCase()) ||
  //         item.bank.toLowerCase().includes(searchKey.toLowerCase())
  //     );
  //     setSearchPayments(items);
  //   }
  // }, [payments, searchKey]);

  return (
    <>
      {paymentLoading && (
        <div className="fixed top-1/3 left-1/2 z-[9999]">
          <span className="loading loading-spinner loading-lg text-first"></span>
        </div>
      )}
      <div className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"}>
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap gap-5 items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className={"font-semibold text-lg"}>Payments</h3>
            </div>
            {/* <div className="form-control">
              <input
                type="text"
                placeholder="Search"
                className="input input-sm input-bordered w-full md:w-auto"
                onChange={(e) => {
                  e.preventDefault();
                  setSearchKey(e.target.value);
                }}
              />
            </div> */}
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Order ID</th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Contact</th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Order Status</th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Amount</th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Payment Method</th>
                <th className={"px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"}>Paid at</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{item.order_id}</td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <div className="flex flex-col gap-2">
                          <div className="text-sm">{item.user.name}</div>
                          <div className="text-xs opacity-75">{item.user.email}</div>
                        </div>
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 capitalize">{item.status}</td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {Intl.NumberFormat("id", {
                          style: "currency",
                          currency: "IDR",
                        }).format(item.amount)}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 capitalize">{item.bank}</td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{item.settlement_time}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10">
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
