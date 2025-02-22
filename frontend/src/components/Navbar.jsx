import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();

  const { token, setToken, backendUrl, userData } = useContext(AppContext);

  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
  };
  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="Logo"
      />

      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/" className="hover:text-primary">
          <li className="py-1">HOME</li>
        </NavLink>
        <NavLink to="/doctors" className="hover:text-primary">
          <li className="py-1">ALL DOCTORS</li>
        </NavLink>
        <NavLink to="/about" className="hover:text-primary">
          <li className="py-1">ABOUT</li>
        </NavLink>
        <NavLink to="/contact" className="hover:text-primary">
          <li className="py-1">CONTACT</li>
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={`${backendUrl}${userData?.imageUrl}?:${assets.profile_pic}`}
              alt="Profile"
            />
            <img
              className="w-2.5"
              src={assets.dropdown_icon}
              alt="Dropdown Icon"
            />
            <div className="absolute top-14 right-0 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded shadow-lg flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointments
                </p>
                <p onClick={logout} className="hover:text-black cursor-pointer">
                  Log out
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Create Account
          </button>
        )}

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden cursor-pointer"
          src={assets.menu_icon}
          alt="Menu Icon"
        />

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 z-30 bg-white transition-transform duration-300 ease-in-out ${
            showMenu ? "translate-x-0" : "translate-x-full"
          } w-full h-full md:hidden`}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-300">
            <img className="w-36" src={assets.logo} alt="Logo" />
            <img
              onClick={() => setShowMenu(false)}
              className="w-6 cursor-pointer"
              src={assets.cross_icon}
              alt="Close Menu"
            />
          </div>
          <ul className="flex flex-col items-center gap-4 mt-5 px-5 text-lg font-medium">
            <NavLink to="/" onClick={() => setShowMenu(false)}>
              <p className="px-2 py-2">HOME</p>
            </NavLink>
            <NavLink to="/doctors" onClick={() => setShowMenu(false)}>
              <p className="px-2 py-2">ALL DOCTORS</p>
            </NavLink>
            <NavLink to="/about" onClick={() => setShowMenu(false)}>
              <p className="px-2 py-2">ABOUT</p>
            </NavLink>
            <NavLink to="/contact" onClick={() => setShowMenu(false)}>
              <p className="px-2 py-2">CONTACT</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
