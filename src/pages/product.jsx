import ProductCard from "../components/ProductCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { fetchCart } from "../slices/cartSlices";
import { useDispatch, useSelector } from "react-redux";
import useLogin from "../hooks/useLogin";
import { fetchProduct, setSearchKey } from "../slices/productSlice";

const ProductPage = () => {
  useEffect(() => {
    document.title = "JO'E Cape | Product";
  }, []);

  useLogin();

  const { products, loading } = useSelector((state) => state.product);

  // Fetch Products
  useEffect(() => {
    if (!products) {
      dispatch(fetchProduct());
    }
    dispatch(setSearchKey(""));
  }, [products]);

  const { searchKey } = useSelector((state) => state.product);
  const cartLoading = useSelector((state) => state.cart.loading);

  const [searchProducts, setSearchProducts] = useState([]);

  useEffect(() => {
    if (searchKey) {
      const items = products.filter((item) => item.title.toLowerCase().includes(searchKey.toLowerCase()) || item.category.toLowerCase().includes(searchKey.toLowerCase()));
      setSearchProducts(items);
    }
  }, [products, searchKey]);

  // Fetch Cart if token exist
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && !user?.data?.is_admin) {
      dispatch(fetchCart(token));
    }
  }, [token]);

  return (
    <div className="flex flex-col gap-24 min-h-screen font-rubik">
      <Header title="Products" />
      {cartLoading && (
        <div className="fixed top-1/3 left-1/2 text-lg z-[99999]">
          <span className="loading loading-bars loading-lg text-first"></span>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-20 md:px-16 grow">
        {loading ? (
          <div className="fixed top-1/3 text-lg z-[99999]">
            <span className="loading loading-bars loading-lg text-first"></span>
          </div>
        ) : searchKey ? (
          searchProducts
            ?.filter((item) => item.isActive)
            .map((item) => {
              return (
                <div key={item.id}>
                  <ProductCard id={item.id} title={item.title} price={item.price} imageUrl={item.image} />
                </div>
              );
            })
        ) : (
          products
            ?.filter((item) => item.isActive)
            .map((product) => {
              return (
                <div key={product.id}>
                  <ProductCard id={product.id} title={product.title} price={product.price} imageUrl={product.image} />
                </div>
              );
            })
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
