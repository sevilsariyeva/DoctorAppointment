import { jwtDecode } from "jwt-decode";
import { useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const useAutoLogout = () => {
  const { token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const expiryTime = decoded.exp * 1000;
      const currentTime = Date.now();
      const timeLeft = expiryTime - currentTime;
      console.log("Decoded token:", decoded);
      console.log("Token expiration (exp):", decoded.exp);
      console.log("Expiry Time (ms):", expiryTime);
      console.log("Current Time (ms):", currentTime);
      console.log("Time Left (ms):", timeLeft);
      console.log(
        `Token bitmə vaxtı: ${new Date(expiryTime).toLocaleString()}`
      );
      console.log(`Hazırkı vaxt: ${new Date(currentTime).toLocaleString()}`);
      console.log(`Qalan vaxt (ms): ${timeLeft}`);
      if (timeLeft <= 0) {
        logout();
      } else {
        const timer = setTimeout(() => logout(), timeLeft);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error("Token decoding error:", error);
      logout();
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };
};

export default useAutoLogout;
