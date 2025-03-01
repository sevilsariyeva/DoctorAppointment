import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);

  const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const getValidToken = () => {
    const storedToken = localStorage.getItem("aToken");
    const expiryTime = localStorage.getItem("aTokenExpiry");

    if (storedToken && expiryTime && Date.now() < Number(expiryTime) * 1000) {
      return storedToken;
    }

    localStorage.removeItem("aToken");
    localStorage.removeItem("aTokenExpiry");
    return "";
  };
  const [aToken, setAToken] = useState(getValidToken());

  const setAuthToken = (newToken, expiryTime) => {
    if (newToken) {
      localStorage.setItem("aToken", newToken);
      localStorage.setItem("aTokenExpiry", expiryTime);
    } else {
      localStorage.removeItem("aToken");
      localStorage.removeItem("aTokenExpiry");
    }
    setAToken(newToken);
  };
  const getAllDoctors = async () => {
    if (!aToken) {
      toast.error("Token is missing.");
      return;
    }

    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/all-doctors`, {
        headers: { aToken },
      });

      console.log("Response from backend:", data);

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
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
        headers: {
          Authorization: `Bearer ${aToken}`,
        },
      });

      console.log("Response from backend:", data);

      if (Array.isArray(data)) {
        setAppointments(data);
        console.log("All appointments:", data);
      } else {
        toast.error("Invalid response format from server.");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error(error.message);
    }
  };
  const cancelAppointment = async (appointmentId, isDashboard = false) => {
    try {
      console.log(appointmentId);
      const response = await axios.delete(
        `${backendUrl}/api/admin/cancel-appointment/${appointmentId}`,
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
            "Content-Type": "application/json",
          },
          data: { userId: "UserId", appointmentId },
        }
      );

      if (response.data.success) {
        toast.success("Appointment cancelled successfully");

        isDashboard ? getDashData() : getAllAppointments();
      } else {
        toast.error(response.data.message || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast.error("Network error or server issue");
    }
  };

  const updateDoctorAvailability = async (doctorId, availability) => {
    if (!doctorId) {
      console.error("Doctor ID is missing");
      return;
    }
    console.log("Doctor ID:", doctorId);
    const apiUrl = `${backendUrl}/api/doctor/change-availability/${doctorId}`;
    console.log("API URL:", apiUrl);

    try {
      const response = await axios.put(apiUrl, { availability });
      console.log("Doctor availability updated", response.data);
      return true;
    } catch (error) {
      console.error(
        "Error updating availability:",
        error.response?.data || error.message
      );
      return false;
    }
  };

  const handleAvailabilityChange = async (doctorId, currentAvailability) => {
    const newAvailability = !currentAvailability;
    const success = await updateDoctorAvailability(doctorId, newAvailability);

    if (success) {
      getAllDoctors();
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${aToken}` },
      });
      if (data) {
        setDashData(data);
        console.log("admindata", data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    updateDoctorAvailability,
    handleAvailabilityChange,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData,
    getDashData,
    setAuthToken,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

AdminContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminContextProvider;
