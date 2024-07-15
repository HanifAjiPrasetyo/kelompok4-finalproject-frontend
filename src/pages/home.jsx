import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useLogin from "../hooks/useLogin";
import { fetchProduct } from "../slices/productSlice";
import Carousel from "../components/Carousel";
import useProvince from "../hooks/useProvince";
import useCart from "../hooks/useCart";
import { FaArrowAltCircleRight } from "react-icons/fa";

const HomePage = () => {
  useEffect(() => {
    document.title = "JO'E Cape | Home";
  }, []);

  // Set Login Session
  useLogin();

  // Fetch Provinces
  useProvince();
  const provinceLoading = useSelector((state) => state.province.loading);

  // Fetch Customer Cart
  useCart();
  const cartLoading = useSelector((state) => state.cart.loading);

  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const [newArrivals, setNewArrivals] = useState([]);
  const [newArrivalsLoading, setNewArrivalsLoading] = useState(false);

  // Fetch New Products
  useEffect(() => {
    setNewArrivalsLoading(true);
    dispatch(fetchProduct()).then(() => {
      setNewArrivals(products.slice(0, 4));
    });
    setNewArrivalsLoading(false);
  }, []);

  // Set Carousel
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (newArrivals) {
      const images = newArrivals.filter((item) => item.isActive).map((item) => item.image);
      setImages(images);
    }
  }, [newArrivals]);

  return (
    <div className="flex flex-col min-h-screen font-rubik">
      <div className="bg-third">
        <Navbar />
      </div>
      {cartLoading && (
        <div className="fixed top-1/3 left-1/2 text-lg z-[9999]">
          <span className="loading loading-bars loading-lg text-first"></span>
        </div>
      )}
      {images.length > 0 && <Carousel images={images} />}
      <a href="/product" className={`btn bg-first text-third md:btn-lg mx-auto duration-700 border-0 hover:bg-third -top-24 md:-top-28 hover:text-first ${loading ? "hidden" : "relative"}`}>
        Shop Now
        <FaArrowAltCircleRight />
      </a>
      <div className="text-center font-semibold text-2xl mt-5">New Arrivals</div>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-16 md:px-16 my-20 grow">
        {loading ? (
          <div className="fixed top-1/3 left-1/2 text-lg">
            <span className="loading loading-bars loading-lg text-first"></span>
          </div>
        ) : (
          newArrivals
            .filter((item) => item.isActive)
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

export default HomePage;
