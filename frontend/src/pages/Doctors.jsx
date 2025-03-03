import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const { doctors, backendUrl } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (doctors?.length > 0) {
      setFilterDoc(
        speciality
          ? doctors.filter((doc) => doc.speciality === speciality)
          : doctors
      );
    }
  }, [doctors, speciality]);

  return (
    <div>
      <p className="text-gray-600">Browse through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-primary text-white" : ""
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>
        <div
          className={`flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          {[
            "General physician",
            "Gynecologist",
            "Dermatologist",
            "Pediatrician",
            "Neurologist",
            "Gastroenterologist",
          ].map((specialty) => (
            <p
              key={specialty}
              onClick={() =>
                speciality === specialty
                  ? navigate("/doctors")
                  : navigate(`/doctors/${specialty}`)
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                speciality === specialty ? "bg-indigo-100 text-black" : ""
              }`}
            >
              {specialty}
            </p>
          ))}
        </div>
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filterDoc?.length ? (
            filterDoc.map((item) => (
              <div
                onClick={() => navigate(`/appointment/${item.id}`)}
                className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:translate-y-[-5px] active:translate-y-[5px]"
                key={item.id || Math.random()}
              >
                <img
                  className="bg-blue-50"
                  src={`${backendUrl}/${item.image}`}
                  alt={item.name}
                />
                <div className="p-4">
                  <div
                    className={`flex items-center gap-2 text-sm text-center ${
                      item.available ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    <p
                      className={`w-2 h-2 rounded-full ${
                        item.available ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></p>
                    <p>{item.available ? "Available" : "Not Available"}</p>
                  </div>
                  <p className="text-gray-900 text-lg font-medium">
                    {item.name}
                  </p>
                  <p className="text-gray-600 text-sm">{item.speciality}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No doctors found.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Doctors;
