import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InputComponent from "../components/input/InputComponent";
import LoginImg from "../img/LoginImg.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../slices/authSlice";
import { getUser } from "../slices/userSlice";
import axios from "axios";

function Login() {
  useEffect(() => {
    document.title = "JO'E Cape | Login";
  }, []);

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [validation, setValidation] = useState([]);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("email", email);
    formData.append("password", password);

    setIsLoginLoading(true);

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    await axios
      .post(`${backendURL}/auth/login`, formData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        setIsLoginLoading(false);
        dispatch(login({ token: response.data.access_token, expired: response.data.expires_in }));
        dispatch(getUser(response.data.access_token));
        navigate("/");
        alert(response.data.message);
      })
      .catch((err) => {
        setLoginError(err.response.data.error);
        setValidation(err.response.data);
        setIsLoginLoading(false);
      });
  };

  return (
    <>
      {loginError && (
        <div className="flex justify-center">
          <div role="alert" className="absolute top-10 w-1/2 alert alert-error text-white font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{loginError}</span>
          </div>
        </div>
      )}
      <div className="flex justify-center w-full bg-first md:py-12 md:px-20 px-5 py-10 min-h-screen font-rubik">
        <div className="md:w-2/3 bg-second md:block hidden">
          <div className="bg-beige-500 flex items-center p-10 h-full">
            <img src={LoginImg} alt="Fashion Image" />
          </div>
        </div>
        <div className="bg-white md:w-3/4 p-8">
          <img className="md:hidden mx-auto mb-4" src={LoginImg} alt="Fashion Image" width={150} />
          <a href="/">
            <h2 className="text-3xl font-bold text-[#AF8260] text-center border-b-2 border-[#A0A0A0] mb-3">JO'E CAPE</h2>
          </a>
          <form onSubmit={handleLogin} className="space-y-5">
            <InputComponent id={"email"} label={"Email Address"} type={"email"} value={email} onChange={(e) => setEmail(e.target.value)} />
            <p className="my-2 text-red-500 text-xs">{validation.email && validation.email}</p>
            <InputComponent id={"password"} label={"Password"} type={"password"} value={password} onChange={(e) => setPassword(e.target.value)} />
            <p className="my-2 text-red-500 text-xs">{validation.password && validation.password}</p>
            <div className="flex gap-x-10 items-center justify-between">
              <div className="flex items-center w-full">
                <input type="checkbox" id="remember" className="form-checkbox h-4 w-4 text-gray-600" />
                <label htmlFor="remember" className="ml-2 block text-xs md:text-sm text-gray-600">
                  Remember Me
                </label>
              </div>
              <div className="text-xs w-full md:text-sm">
                <a href="#" className="font-medium text-gray-600 hover:text-gray-500">
                  Forgot Password?
                </a>
              </div>
            </div>
            <div>
              <button className="w-full bg-[#322C2B] text-white p-2 rounded-md hover:bg-[#AF8260] focus:outline-none focus:bg-[#AF8260]">{isLoginLoading ? "Logging in..." : "Login"}</button>
            </div>
            <div className="text-center">
              <p className="text-md text-gray-600">
                Don’t have an account?
                <Link to="/register" className="text-second hover:text-third font-medium ms-1">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
