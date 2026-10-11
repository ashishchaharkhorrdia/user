import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div className="relative flex items-center justify-center overflow-hidden bg-white pt-0 -mx-4 md:-mx-6 lg:-mx-8 xl:-mx-12" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}> {/* Full viewport width */}

      {/* Background Glow Effects */}
      <div className="absolute w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl -top-20 -left-20"></div>
      <div className="absolute w-96 h-96 bg-pink-200/20 rounded-full blur-3xl bottom-0 right-0"></div>

      {/* Main Container */}
      <div className="flex flex-col md:flex-row items-center w-full max-w-7xl px-6 md:px-12 lg:px-16 mx-auto">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 space-y-6"
        >
          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
            Book Appointment <br />
            <span className="text-indigo-600">With Trusted Doctors</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg text-gray-700 max-w-lg">
            Experience seamless healthcare booking with top specialists.
            Fast, secure, and trusted by thousands of patients.
          </p>

          {/* Book Appointment Button */}
          <motion.a
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            href="#speciality"
            className="inline-flex items-center gap-3 bg-indigo-600 text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Book Appointment
            <span className="text-xl">→</span>
          </motion.a>

          {/* Trust Section */}
          {/* <div className="flex items-center gap-4 pt-6 ">
            <img
              className="w-32 rounded-full shadow-lg border-2 border-gray-200 "
              src={assets.group_profiles}
              alt="Group Profiles"
            />
            <p className="text-sm text-gray-700">
              Trusted by <span className="font-bold text-indigo-600">10,000+</span> Patients
            </p>
          </div> */}
        </motion.div>

        {/* RIGHT IMAGE SECTION */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 relative mt-0 md:mt-0 w-full flex justify-center"
        >
          {/* Main Image */}
          <motion.img
            src={assets.header_img}
            alt="Doctor Header"
            className="relative z-10 rounded-3xl shadow-2xl w-full max-w-[420px] absolute inset-0 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] "
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />

          {/* Floating Small Images */}
          <motion.img
            src={assets.header_img}
            alt="Floating Left"
            className="absolute top-10 -left-6 w-28 rounded-2xl shadow-xl border-4 border-white"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />

          <motion.img
            src={assets.header_img}
            alt="Floating Right"
            className="absolute bottom-10 -right-6 w-24 rounded-2xl shadow-xl border-4 border-white"
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 3.5 }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Header;