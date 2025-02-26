import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm">
        {/* ---------Left Section--------- */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi illo
            asperiores suscipit impedit accusamus nesciunt eos eveniet.
            Temporibus quos eius voluptatem, rerum ducimus cumque ipsam
            recusandae doloribus laudantium a aperiam?
          </p>
        </div>
        {/* ---------Center Section--------- */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <NavLink to="/" className="hover:text-primary">
              <li className="py-1">Home</li>
            </NavLink>
            <NavLink to="/about" className="hover:text-primary">
              <li className="py-1">About</li>
            </NavLink>
            <NavLink to="/contact" className="hover:text-primary">
              <li className="py-1">Contact Us</li>
            </NavLink>
            <NavLink to="/" className="hover:text-primary">
              <li className="py-1">Privacy Policy</li>
            </NavLink>
          </ul>
        </div>
        {/* ---------Right Section--------- */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+994 5151515</li>
            <li>docapp@gmail.com</li>
          </ul>
        </div>
      </div>
      {/* ---------Copyright Section--------- */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2024@ DocApp - All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
