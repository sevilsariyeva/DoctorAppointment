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
  const [dashData, setDashData] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [profileData, setProfileData] = useState(false);

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

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/dashboard", {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (data.success) {
        console.log(data.statistics);
        setDashData(data.statistics);
      }
    } catch (error) {
      toast.error(error.message);
    }
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
  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/profile", {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (data.success) {
        setProfileData(data.profileData);
        console.log(data.profileData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const cancelAppointment = async (appointmentId, isDashboard = false) => {
    try {
      console.log(appointmentId);
      const response = await axios.delete(
        `${backendUrl}/api/doctor/cancel-appointment/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
            "Content-Type": "application/json",
          },
          data: { userId: "UserId", appointmentId },
        }
      );

      if (response.data.success) {
        toast.success("Appointment cancelled successfully");

        isDashboard ? getDashData() : getAppointments();
      } else {
        toast.error(response.data.message || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast.error("Network error or server issue");
    }
  };
  const completeAppointment = async (appointmentId) => {
    try {
      const requestBody = true;

      const { data } = await axios.put(
        `${backendUrl}/api/doctor/complete-appointment/${appointmentId}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${dToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((app) =>
            app.id === appointmentId ? { ...app, isCompleted: true } : app
          )
        );
        setIsCompleted((prevState) => ({
          ...prevState,
          [appointmentId]: true,
        }));
      } else {
        console.error("Error completing appointment:", data.message);
      }
    } catch (error) {
      console.error("Error completing appointment:", error);
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
    dashData,
    setDashData,
    getDashData,
    cancelAppointment,
    profileData,
    setProfileData,
    getProfileData,
    completeAppointment,
  };
  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
