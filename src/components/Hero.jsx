import React from "react";
import { Link } from "react-router-dom"; 
import heroImg from "../assets/hero.png"; 
import logo from "../assets/logo1.png"; 

const Hero = () => {
  return (
    <section className="bg-dark text-light min-h-screen flex items-center">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Left Content */}
        <div className="flex-1 space-y-8 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            WELC
            <span className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-light mx-2">
              <img
                src={logo}
                alt="Logo"
                className="w-14 h-14 md:w-16 md:h-16 rounded-full"
              />
            </span>
            ME! <br /> to <span className="text-primary">Brain-dock</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-lg mx-auto md:mx-0">
            Now you can dock your ideas and resources....
          </p>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row justify-center md:justify-start gap-4">
            <Link to="/start">
              <button className="bg-primary text-light font-semibold px-8 py-4 text-lg rounded-lg hover:bg-secondary transition">
                Start Today
              </button>
            </Link>
            <Link to="/about">
              <button className="bg-dark2 text-light px-8 py-4 text-lg rounded-lg hover:bg-secondary transition">
                About us
              </button>
            </Link>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-semibold mt-6 mb-3">Choose your Category :</h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-8 text-gray-300 text-lg">
              <span className="hover:text-primary cursor-pointer">Resources</span>
              <span className="hover:text-secondary cursor-pointer">Projects</span>
              <span className="hover:text-primary cursor-pointer">Placements</span>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="flex-1 hidden md:flex justify-center">
          <img
            src={heroImg}
            alt="Brain Dock Illustration"
            className="w-full max-w-md shadow-lg rounded-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
