import { createContext } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const getValidToken = () => {
    const storedToken = localStorage.getItem("dToken");
    const expiryTime = localStorage.getItem("dTokenExpiry");

    if (storedToken && expiryTime && Date.now() < Number(expiryTime) * 1000) {
      return storedToken;
    }

    localStorage.removeItem("dToken");
    localStorage.removeItem("dTokenExpiry");
    return "";
  };

  const [dToken, setDToken] = useState(getValidToken());
  const [appointments, setAppointments] = useState([]);

  const setDAuthToken = (newToken, expiryTime) => {
    if (newToken) {
      localStorage.setItem("dToken", newToken);
      localStorage.setItem("dTokenExpiry", expiryTime);
    } else {
      localStorage.removeItem("dToken");
      localStorage.removeItem("dTokenExpiry");
    }
    setDToken(newToken);
  };

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/appointments",
        {
          headers: { Authorization: `Bearer ${dToken}` },
        }
      );
      if (data.success) {
        console.log(data.appointments.reverse());
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const value = {
    dToken,
    setDToken,
    setDAuthToken,
    backendUrl,
    getAppointments,
    appointments,
    setAppointments,
  };
  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
