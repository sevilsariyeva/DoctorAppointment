import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";

// Create the context
export const AdminContext = createContext();

// Define the context provider
const AdminContextProvider = ({ children }) => {
  const initialToken = localStorage.getItem("aToken") || "";
  const [aToken, setAToken] = useState(initialToken);
  const [doctors, setDoctors] = useState([]);

  // Persist token in localStorage whenever aToken changes
  useEffect(() => {
    if (aToken) {
      localStorage.setItem("aToken", aToken);
    }
  }, [aToken]);

  // Ensure backendUrl is configured correctly
  const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

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

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    updateDoctorAvailability,
    handleAvailabilityChange,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

// Prop validation for children
AdminContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminContextProvider;
