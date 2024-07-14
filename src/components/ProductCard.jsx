import { FaEye } from "react-icons/fa";
import { useState } from "react";
import "../App.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { fetchCart, addToCart, updateCart } from "../slices/cartSlices";

const ProductCard = (props) => {
  const { id, title, price, imageUrl } = props;

  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  function slugify(text) {
    return text.toLowerCase().replace(/\s+/g, "-");
  }

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const { carts } = useSelector((state) => state.cart);

  const handleAddToCart = async (productId, quantity) => {
    const existItem = carts?.find((item) => item.cart_items?.length > 0 && item.cart_items[0].product.id === productId);
    try {
      if (existItem && existItem.cart_items?.length > 0 && existItem.cart_items[0].product.id === productId) {
        await dispatch(updateCart({ cartId: existItem.id, productId, quantity: existItem.cart_items[0].quantity + quantity }, token)).then(() => dispatch(fetchCart(token)));
        alert("Added to cart");
      } else {
        await dispatch(addToCart({ productId, quantity }, token)).then(() => dispatch(fetchCart(token)));
        alert("Added to cart");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const indoCurrency = (price) => {
    return price?.toLocaleString("id-ID", { styles: "currency", currency: "IDR" });
  };

  return (
    <>
      <div className="flex flex-col justify-center max-w-xs h-[450px] w-[350px]" onMouseEnter={handleHover} onMouseLeave={handleMouseLeave}>
        <div className={`relative w-full h-full border rounded-md`}>
          <img className={`w-full h-full ${isHovered ? "scale-[103%] duration-700" : ""}`} src={imageUrl} alt={title} />
          <div className={`absolute flex flex-col gap-1 top-5 right-5 ${isHovered ? "" : "hidden"}`}>
            <a className="rounded-full p-3 border bg-white hover:bg-black hover:text-white duration-700" href={`/product/${slugify(title)}`}>
              <FaEye />
            </a>
          </div>
          <button
            className={`absolute bottom-5 left-10 w-3/4 p-2 bg-black text-white font-semibold rounded-md ${isHovered ? "slide-up" : "hidden"}`}
            onClick={() => {
              if (token && !user?.data.is_admin) {
                handleAddToCart(id, 1);
              } else if (token && user?.data.is_admin) {
                alert("You're an admin");
              } else if (!token) {
                alert("Please log in first");
                navigate("/login");
              }
            }}
          >
            Add to Cart
          </button>
        </div>
        <div className="p-3 mt-3">
          <a href={`/product/${slugify(title)}`} className="text-lg font-semibold duration-700 hover:text-yellow-600">
            {title.slice(0, 30)}
          </a>
          <div className="">Rp{indoCurrency(price)},00</div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
