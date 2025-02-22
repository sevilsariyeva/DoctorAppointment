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

  const fetchUserProfile = async () => {
    if (!token) {
      setUserData(null);
      return;
    }
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to load user profile");
      setUserData(null);
    }
  };
  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/all-doctors`);
      setDoctors(Array.isArray(data) ? data : data.doctors || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error(error.message || "Network error");
    }
  };
  useEffect(() => {
    fetchDoctors();
  }, [backendUrl]);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setUserData(null);
    }
  }, [token]);

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
        fetchUserProfile,
        fetchDoctors,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
