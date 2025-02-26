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
