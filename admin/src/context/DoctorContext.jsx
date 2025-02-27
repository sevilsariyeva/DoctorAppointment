import { createContext } from "react";
import { useState } from "react";
export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  const [dToken, setDToken] = useState("");
  const value = { dToken, setDToken, backendUrl };
  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
