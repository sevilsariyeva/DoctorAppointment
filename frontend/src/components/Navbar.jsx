import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, backendUrl, userData, fetchUserProfile } =
    useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);

  useEffect(() => {
    if (token && !profileFetched) {
      fetchUserProfile();
      setProfileFetched(true);
      console.log(token);
    }
  }, [token, fetchUserProfile, profileFetched]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-dropdown")) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [showDropdown]);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
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
        {token ? (
          <div
            className="relative flex items-center gap-2 cursor-pointer profile-dropdown"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={
                userData?.imageUrl?.startsWith("http")
                  ? userData.imageUrl
                  : `${backendUrl}${
                      userData?.imageUrl || assets.defaultProfileImage
                    }`
              }
              alt="Profile"
            />
            <img
              className="w-2.5"
              src={assets.dropdown_icon}
              alt="Dropdown Icon"
            />
            {showDropdown && (
              <div className="absolute top-14 right-0 text-base font-medium text-gray-600 z-20 bg-stone-100 rounded shadow-lg flex flex-col gap-4 p-4 min-w-48">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointments
                </p>
                <p onClick={logout} className="hover:text-black cursor-pointer">
                  Log out
                </p>
              </div>
            )}
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
          onClick={() => setShowMenu(!showMenu)}
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
          {/* Mobile menu content */}
          <button
            onClick={() => setShowMenu(false)}
            className="absolute top-4 right-4 text-xl"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
