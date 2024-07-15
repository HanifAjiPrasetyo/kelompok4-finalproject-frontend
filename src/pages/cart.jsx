import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, updateCart, removeFromCart } from "../slices/cartSlices";
import useLogin from "../hooks/useLogin";
import { useNavigate } from "react-router";

const Cart = () => {
  useEffect(() => {
    document.title = "JO'E Cape | Cart";
  }, []);

  useLogin();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);

  // Fetch Cart
  useEffect(() => {
    dispatch(fetchCart(token));
  }, [dispatch]);

  const { user } = useSelector((state) => state.user);
  console.log(user);

  const { carts, loading, totalPrice } = useSelector((state) => state.cart);

  const handleUpdateCart = (cartId, productId, quantity) => {
    try {
      dispatch(updateCart({ cartId, productId, quantity }, token)).then(() => dispatch(fetchCart(token)));
    } catch (error) {
      return error;
    }
  };

  const handleRemoveItem = (cartId, productId) => {
    try {
      dispatch(removeFromCart({ cartId, productId }, token)).then(() => dispatch(fetchCart(token)));
    } catch (error) {
      return error;
    }
  };

  const indoCurrency = (price) => {
    return price?.toLocaleString("id-ID", { styles: "currency", currency: "IDR" });
  };

  return (
    <div className="flex flex-col gap-16 min-h-screen">
      <Header title="Your Shopping Cart" />
      <div className="cart-container px-4 md:px-32 grow">
        {loading && (
          <div className="mx-auto text-center">
            <span className="loading loading-spinner loading-lg text-second"></span>
          </div>
        )}
        {/* Item List */}
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {carts?.length > 0 ? (
                carts.map((item, id) => {
                  return (
                    <tr key={id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img src={item.cart_items[0].product.image} alt={item.cart_items[0].product.title} />
                            </div>
                          </div>
                          <div>
                            <a href={`/product/${item.cart_items[0].product.slug}`} className="duration-500 hover:text-second">
                              <div className="font-bold">{item.cart_items[0].product.title}</div>
                            </a>
                            <div className="text-xs">
                              Size: <span className="opacity-75">{item.cart_items[0].product.size}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>Rp{indoCurrency(item.cart_items[0].product.price)},00</td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <button
                            className="px-3 py-1 rounded duration-500 text-third bg-first hover:text-first hover:bg-third"
                            onClick={() => {
                              handleUpdateCart(item.id, item.cart_items[0].product.id, item.cart_items[0].quantity - 1);
                            }}
                          >
                            -
                          </button>
                          <span className="px-3 py-1 rounded duration-500 text-first bg-third">{item.cart_items[0].quantity}</span>
                          <button
                            className="px-3 py-1 rounded duration-500 text-third bg-first hover:text-first hover:bg-third"
                            onClick={() => {
                              handleUpdateCart(item.id, item.cart_items[0].product.id, item.cart_items[0].quantity + 1);
                            }}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>Rp{indoCurrency(item.cart_items[0].product.price * item.cart_items[0].quantity)},00</td>
                      <td>
                        <button
                          className="btn btn-xs btn-error text-white"
                          onClick={() => {
                            if (confirm("Remove item?")) {
                              handleRemoveItem(item.id, item.cart_items[0].product.id);
                            }
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
                    Empty
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="total-checkoutbutton mt-10 flex items-center justify-end">
          {!loading && carts?.length > 0 && (
            <>
              <h2 className="text-first mr-5 font-semibold">Total: Rp{indoCurrency(totalPrice) || 0},00</h2>
              <button
                className="px-3 py-1 rounded duration-500 text-third bg-first hover:text-first hover:bg-third"
                onClick={() => {
                  if (!user?.address || !user?.address.city || !user?.address.province) {
                    alert("Please update your address first!");
                    navigate("/profile");
                  } else {
                    navigate("/checkout");
                  }
                }}
              >
                Checkout
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
