import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { AdminContext } from "../context/AdminContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAToken, backendUrl } = useContext(AdminContext);
  console.log("Backend URL:", backendUrl);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log("Login button clicked!");
    try {
      console.log("Submitting login request...");
      console.log(backendUrl + "/api/admin/login");
      console.log(state);
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });
        console.log("API Response:", data);
        console.log("Token received:", data.token);

        if (data?.token) {
          const token = data.token;
          console.log("Token received:", token);

          localStorage.setItem("aToken", token);
          setAToken(token);
          toast.success("Login successful!");
        } else {
          toast.error(data?.message || "Login failed!");
        }
      } else {
        console.log("Doctor login not implemented yet.");
      }
    } catch (error) {
      console.error("Login Error:", error.response || error.message);
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={onSubmitHandler}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span>Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base"
        >
          Login
        </button>
        {state === "Admin" ? (
          <p>
            Doctor Login{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => setState("Doctor")}
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => setState("Admin")}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
