import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import InputComponent from "../components/input/InputComponent";
import RegisterImg from "../img/RegisterImg.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function Register() {
  useEffect(() => {
    document.title = "JO'E Cape | Register";
  }, []);

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  const navigate = useNavigate();
  // Form Data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  // Validation
  const [validation, setValidation] = useState([]);

  // Loading
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", passwordConfirmation);

    setIsRegisterLoading(true);

    const backendURL = import.meta.env.VITE_BACKEND_URL;

    await axios
      .post(`${backendURL}/auth/register`, formData)
      .then(() => {
        setIsRegisterLoading(false);
        alert("Successfully registered!");
        navigate("/login");
      })
      .catch((err) => {
        setValidation(err.response.data);
        setIsRegisterLoading(false);
      });
  };

  return (
    <>
      <div className="flex justify-center w-full bg-first md:py-12 md:px-20 px-5 py-10 min-h-screen font-rubik">
        <div className="md:w-2/3 bg-second md:block hidden">
          <div className="bg-beige-500 flex items-center p-10 h-full">
            <img src={RegisterImg} alt="Fashion Image" />
          </div>
        </div>
        <div className="bg-white md:w-3/4 p-8">
          <img className="md:hidden mx-auto mb-4" src={RegisterImg} alt="Fashion Image" width={150} />
          <a href="/">
            <h2 className="text-3xl font-bold text-[#AF8260] text-center border-b-2 border-[#A0A0A0] mb-3">JO'E CAPE</h2>
          </a>
          <form onSubmit={handleRegister} className="space-y-2">
            <div className="flex items-center gap-5">
              <div className="w-full">
                <InputComponent id={"name"} label={"Name"} type={"text"} value={name} onChange={(e) => setName(e.target.value)} />
                <p className="my-2 text-red-500 text-xs">{validation.name && validation.name}</p>
              </div>
              <div className="w-full">
                <InputComponent id={"username"} label={"Username"} type={"text"} value={username} onChange={(e) => setUsername(e.target.value)} />
                <p className="my-2 text-red-500 text-xs">{validation.username && validation.username}</p>
              </div>
            </div>

            <InputComponent id={"email"} label={"Email"} type={"text"} value={email} onChange={(e) => setEmail(e.target.value)} />
            <p className="my-2 text-red-500 text-xs">{validation.email && validation.email}</p>
            <InputComponent id={"password"} label={"Password"} type={"password"} value={password} onChange={(e) => setPassword(e.target.value)} />
            <p className="my-2 text-red-500 text-xs">{validation.password && validation.password}</p>
            <InputComponent id={"passwordConfirmation"} label={"Repeat password"} type={"password"} value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
            <div>
              <button className="w-full bg-first text-white p-2 rounded-md hover:bg-second focus:outline-none focus:bg-second mt-8">{isRegisterLoading ? "Signing up..." : "Sign up"}</button>
            </div>
            <div className="text-center">
              <p className="text-lg text-gray-600">
                Already have an account?
                <Link to="/login" className="text-second hover:text-third font-medium ms-1">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
