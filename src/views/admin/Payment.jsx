import { useEffect } from "react";
import PaymentTable from "../../components/admin/Cards/PaymentTable";
import { useDispatch } from "react-redux";
import { fetchPayment } from "../../slices/paymentSlice";

export default function Payment() {
  useEffect(() => {
    document.title = "JO'E Cape | Payment";
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPayment());
  }, []);

  return (
    <>
      <div className="flex flex-wrap mt-10">
        <div className="w-full mb-12 px-4">
          <PaymentTable />
        </div>
      </div>
    </>
  );
}
