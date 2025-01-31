import { createContext, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes

// Create the context
export const AdminContext = createContext();

// Define the context provider
const AdminContextProvider = ({ children }) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
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
  children: PropTypes.node.isRequired, // Ensures that children prop is passed and is a valid React node
};

export default AdminContextProvider;
