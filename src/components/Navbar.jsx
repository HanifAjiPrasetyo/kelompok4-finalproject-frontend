import { FaRightFromBracket, FaUserPlus, FaUser, FaPowerOff, FaTableColumns, FaReceipt } from "react-icons/fa6";
import Logo from "./Logo";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { logout } from "../slices/authSlice";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";
import { useState } from "react";
import { deleteUser } from "../slices/userSlice";
import { setSearchKey } from "../slices/productSlice";

const Navbar = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const userLoading = useSelector((state) => state.user.loading);
  const { carts, loading, totalPrice } = useSelector((state) => state.cart);

  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .post(`${backendURL}/auth/logout`)
      .then((response) => {
        dispatch(logout());
        dispatch(deleteUser({}));
        alert(response.data.message);
        setLogoutLoading(false);
        navigate("/");
      })
      .catch(() => {
        dispatch(logout());
        dispatch(deleteUser({}));
        alert("Successfully logged out");
        setLogoutLoading(false);
        navigate("/");
      });
  };

  const indoCurrency = (price) => {
    return price?.toLocaleString("id-ID", { styles: "currency", currency: "IDR" });
  };

  return (
    <>
      {logoutLoading && (
        <div className="absolute top-28 left-5 md:left-1/2">
          <span className="loading loading-spinner loading-lg md:loading-lg text-first"></span>
        </div>
      )}
      <div className={`navbar flex justify-center ${token ? "px-5" : "px-10"} md:px-16 pt-4}`}>
        <a href="/" className="md:scale-100">
          <Logo />
        </a>
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden ms-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] shadow bg-base-100 rounded-box">
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/product">Products</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
          </ul>
        </div>
        <div className="navbar hidden lg:flex lg:justify-center">
          <ul className="menu menu-horizontal z-[1]">
            <li>
              <a href="/" className={`duration-500 ${location.pathname == "/" ? "bg-first text-third font-semibold" : ""}`}>
                Home
              </a>
            </li>
            <li>
              <a href="/product" className={`duration-500 ${location.pathname == "/product" ? "bg-first text-third font-semibold" : ""}`}>
                Product
              </a>
            </li>
            <li>
              <a href="/about" className={`duration-500 ${location.pathname == "/about" ? "bg-first text-third font-semibold" : ""}`}>
                About
              </a>
            </li>
          </ul>
        </div>
        <div className="flex-none gap-x-1">
          {location.pathname === "/product" && (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 md:w-64 bg-base-100 shadow">
                <div className="card-body">
                  <div className="form-control">
                    <input type="text" placeholder="Search product name/category.." className="text-xs input input-bordered md:w-auto" onChange={(e) => dispatch(setSearchKey(e.target.value))} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {token && (
            <>
              {!user?.data?.is_admin && (
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                    <div className="indicator">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="badge badge-sm indicator-item">{(!loading && carts?.length) || 0}</span>
                    </div>
                  </div>
                  <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
                    <div className="card-body">
                      <span className="font-bold text-lg">{(!loading && carts?.length) || 0} Item(s)</span>
                      <span className="text-second">Total: Rp{(!loading && indoCurrency(totalPrice)) || 0},00</span>
                      <div className="card-actions">
                        <a className="btn bg-first text-third btn-block" href="/cart" disabled={loading ? true : false}>
                          View cart
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src={`${(!userLoading && user?.data.avatar) || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"}`} />
                  </div>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                  {!user?.data?.is_admin && (
                    <>
                      <li>
                        <a href="/profile">
                          <FaUser />
                          Profile
                        </a>
                      </li>
                      <li>
                        <a href="/order">
                          <FaReceipt />
                          Orders
                        </a>
                      </li>
                    </>
                  )}
                  <li className={`${user?.data?.is_admin ? "block" : "hidden"}`}>
                    <a href="/admin">
                      <FaTableColumns />
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        if (confirm("Logout?")) handleLogout();
                      }}
                    >
                      <FaPowerOff />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
        {!token && (
          <div className="">
            <ul className="menu menu-xs md:menu-md menu-horizontal z-[1]">
              <li>
                <details>
                  <summary>Auth</summary>
                  <ul className="px-3 flex flex-col gap-y-1">
                    <li>
                      <a href="/login">
                        <FaRightFromBracket />
                        Login
                      </a>
                    </li>
                    <li>
                      <a href="/register">
                        <FaUserPlus />
                        Register
                      </a>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
