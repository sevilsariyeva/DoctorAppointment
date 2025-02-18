import React, { createContext, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    image: "",
    phone: "",
    address: {
      line1: "",
      line2: "",
    },
    gender: "",
    dob: "",
  });

  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );

  const getDoctorsData = async () => {
    try {
      console.log(backendUrl + "/api/doctor/all-doctors");
      const { data } = await axios.get(backendUrl + "/api/doctor/all-doctors");
      if (Array.isArray(data)) {
        setDoctors(data);
      } else if (data.success && Array.isArray(data.doctors)) {
        setDoctors(data.doctors);
      } else {
        toast.error("Invalid doctor data format.");
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error(error.message || "Network error");
    }
  };
  const loadUserProfileData = async () => {
    const { data } = await axios
      .get(backendUrl + "/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Profile data:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  };

  const value = {
    doctors,
    currencySymbol,
    setDoctors,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
  };
  useEffect(() => {
    getDoctorsData();
  }, []);
  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
