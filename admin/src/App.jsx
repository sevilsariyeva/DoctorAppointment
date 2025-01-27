import React from "react";
import Login from "./pages/Login";
import AdminContextProvider from "./context/AdminContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div>
      <Login />
      <ToastContainer />
    </div>
  );
};

export default App;
