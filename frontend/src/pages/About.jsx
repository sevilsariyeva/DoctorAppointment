import React from "react";
import Footer from "../components/Footer";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div>
        <p>
          ABOUT <span>US</span>
        </p>
      </div>

      <div>
        <img src={assets.about_image} alt="" />
      </div>
      <Footer />
    </div>
  );
};

export default About;
