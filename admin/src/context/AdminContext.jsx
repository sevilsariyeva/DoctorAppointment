import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

// Create the context
export const AdminContext = createContext();

// Define the context provider
const AdminContextProvider = ({ children }) => {
  const initialToken = localStorage.getItem("aToken") || "";
  const [aToken, setAToken] = useState(initialToken);

  useEffect(() => {
    localStorage.setItem("aToken", aToken);
  }, [aToken]); // `aToken` dəyişəndə localStorage yenilənir

  const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const value = {
    aToken,
    setAToken,
    backendUrl,
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
