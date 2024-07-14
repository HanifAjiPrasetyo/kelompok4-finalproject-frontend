import { useNavigate, useParams } from "react-router";
import Header from "../components/Header";
import { FaCartPlus } from "react-icons/fa";
import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { addToCart, updateCart, fetchCart } from "../slices/cartSlices";
import { useDispatch, useSelector } from "react-redux";
import useLogin from "../hooks/useLogin";
import { fetchProduct } from "../slices/productSlice";

const DetailProductPage = () => {
  useEffect(() => {
    document.title = "JO'E Cape | Detail Product";
  }, []);

  useLogin();

  const { slug } = useParams();

  const dispatch = useDispatch();

  // Fetch Products
  useEffect(() => {
    dispatch(fetchProduct());
  }, []);

  const { products } = useSelector((state) => state.product);
  const [product, setProduct] = useState({});

  // Fetch Product
  useEffect(() => {
    const product = products?.find((product) => product.slug === slug);
    setProduct(product);
  });

  // Get Related Products - Take max 4 product
  const relatedProducts = products.filter((item) => item.category === product.category && item.id !== product.id).slice(-4);

  const [qty, setQty] = useState(1);

  const increment = () => {
    setQty(qty + 1);
  };

  const decrement = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const { carts, loading } = useSelector((state) => state.cart);

  const navigate = useNavigate();

  const handleAddToCart = async (productId, quantity) => {
    const existItem = carts.find((item) => item.cart_items[0].product.id === productId);
    try {
      if (existItem?.cart_items[0].product.id === productId) {
        dispatch(updateCart({ cartId: existItem.id, productId, quantity: existItem.cart_items[0].quantity + quantity }, token)).then(() => dispatch(fetchCart(token)));
        alert("Added to cart");
      } else if (existItem?.cart_items[0].product.id !== productId) {
        dispatch(addToCart({ productId, quantity }, token)).then(() => dispatch(fetchCart(token)));
        alert("Added to cart");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const indoCurrency = (price) => {
    return price?.toLocaleString("id-ID", { styles: "currency", currency: "IDR" });
  };

  return (
    <div className="flex flex-col gap-16 font-rubik">
      <Header title={product.title} />
      {loading && (
        <div className="fixed top-32 left-1/2 text-lg z-[9999]">
          <span className="loading loading-spinner loading-lg text-first"></span>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-center gap-5">
        <div className="flex justify-center px-10">
          <div className="flex flex-col flex-wrap justify-center border">
            <img src={product.image} alt={product.name} width={150} height={150} />
            <img src={product.image} alt={product.name} width={150} height={150} />
            <img src={product.image} alt={product.name} width={150} height={150} />
            <img src={product.image} alt={product.name} width={150} height={150} />
          </div>
          <img className="border" src={product.image} alt={product.title} width={500} />
        </div>
        <div className="flex flex-col gap-3 md:w-1/3 px-4">
          <div className="font-semibold text-xl">{product.title}</div>
          <div className="font-semibold text-md">{product.category}</div>
          <div className="font-semibold text-sm">
            Year : {product.year} | Weight : {product.weight} gr
          </div>
          <div className="text-slate-500 font-semibold">Rp{indoCurrency(product.price)},00</div>
          <div className="mt-8">
            <div className="font-semibold text-lg">Description:</div>
            <p className="text-slate-500">{product.description}</p>
          </div>
          <div className="flex flex-wrap justify-between gap-3">
            <div className="flex items-center">
              <div className="font-semibold text-lg me-2">Size :</div>
              <div className="p-2 rounded duration-500 text-second font-semibold">XL</div>
            </div>
            <div className="flex items-center gap-x-1">
              <div className="font-semibold text-lg me-2">Quantity :</div>
              <button className="px-3 py-1 rounded duration-500 text-third font-semibold bg-first hover:text-first hover:bg-third" onClick={decrement}>
                -
              </button>
              <button className="px-3 py-1 rounded duration-500 text-first font-semibold bg-third" disabled>
                {qty}
              </button>
              <button className="px-3 py-1 rounded duration-500 text-third font-semibold bg-first hover:text-first hover:bg-third" onClick={increment}>
                +
              </button>
            </div>
          </div>
          <div className="flex items-center flex-wrap">
            <button
              className="bg-first text-third rounded px-4 py-2 hover:text-first hover:bg-third duration-500"
              onClick={() => {
                if (token && !user?.data.is_admin) {
                  handleAddToCart(product.id, qty);
                } else if (token && user?.data.is_admin) {
                  alert("You're an admin");
                } else if (!token) {
                  alert("Please log in first");
                  navigate("/login");
                }
              }}
            >
              <div className="flex items-center gap-2">
                <FaCartPlus />
                Add to Cart
              </div>
            </button>
          </div>
        </div>
        {relatedProducts ? (
          <div className="flex flex-col items-center mt-10 gap-y-16">
            <div className="font-semibold text-3xl">Related Products</div>
            <div className="flex flex-wrap items-center justify-center md:px-8 gap-x-5 gap-y-12 md:gap-y-10">
              {relatedProducts.map((product) => {
                return (
                  <div key={product.id}>
                    <ProductCard id={product.id} title={product.title} price={product.price} imageUrl={product.image} />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DetailProductPage;
