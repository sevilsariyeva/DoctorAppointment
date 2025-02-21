import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/doctor/all-doctors`
        );
        setDoctors(Array.isArray(data) ? data : data.doctors || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error(error.message || "Network error");
      }
    };
    fetchDoctors();
  }, [backendUrl]);

  // Fetch user data when token changes (on login/logout)
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        console.log("Fetching user profile with token:", token); // Debugging log

        try {
          const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log("User data received:", data); // Debugging log
          if (data) {
            setUserData(data); // If response contains data, update userData
          } else {
            console.warn("No data received for user profile.");
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          toast.error("Failed to load user profile");
          setUserData(null); // Clear user data on error
        }
      } else {
        console.log("No token found, clearing user data.");
        setUserData(null); // Clear user data if no token exists
      }
    };
  }, [token, backendUrl]);

  return (
    <AppContext.Provider
      value={{
        doctors,
        currencySymbol,
        setDoctors,
        backendUrl,
        token,
        setToken,
        userData,
        setUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
