import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../slices/cartSlices";
import { useEffect } from "react";

function useCart() {
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (token && !user?.data?.is_admin) {
      dispatch(fetchCart(token));
    }
  }, [token, user]);
}

export default useCart;
