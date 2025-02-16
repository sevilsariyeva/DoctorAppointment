import React, { createContext, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);

  const value = {
    doctors,
    currencySymbol,
    setDoctors,
    backendUrl,
  };

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

  useEffect(() => {
    getDoctorsData();
  }, []);
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
