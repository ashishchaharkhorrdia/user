import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const SpecialitiesSection = () => {

  const specialities = [
    "Cancer Care / Oncology",
    "Orthopaedics & Joint Replacement",
    "Cardiac Sciences",
    "Pulmonology",
    "Nephrology",
    "Neurosciences",
    "Gastroenterology",
    "Obstetrics & Gynaecology"
  ];

  return (
    <section className="py-24 px-6 md:px-16 bg-white relative overflow-hidden -mx-4 md:-mx-6 lg:-mx-8 xl:-mx-12" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}> {/* Full viewport width */}

      {/* Background Blur Shape */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px]"></div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">

        {/* LEFT CONTENT */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            World-Class <span className="text-primary">Specialities</span>
          </h2>

          <p className="text-gray-600 mb-10 text-lg">
            Experience excellence in healthcare with our internationally trusted
            departments and expert consultants.
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6">
            {specialities.map((item, index) => (
              <NavLink
                key={index}
                to={`/doctors/${encodeURIComponent(item)}`}
                className="group p-3 sm:p-5 rounded-2xl bg-white/60 backdrop-blur-lg border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm sm:text-lg group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {index + 1}
                  </div>
                  <p className="font-medium text-sm sm:text-base text-gray-900 group-hover:text-primary transition">
                    {item}
                  </p>
                </div>
              </NavLink>
            ))}
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="relative rounded-[40px] overflow-hidden shadow-2xl group">

          {/* Background Image */}
          <img
            src={assets.doctor_he}
            alt="Doctor"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/20 to-transparent"></div>

          {/* Content */}
          <div className="absolute bottom-0 p-10 text-gray-900">
            <h3 className="text-3xl font-semibold mb-4 text-gray-900">
              Looking for an Expert?
            </h3>

            <p className="text-gray-700 mb-6">
              Connect with top-tier specialists delivering exceptional
              healthcare standards.
            </p>

            <NavLink to="/collection">
              <button className="px-8 py-3 rounded-full bg-primary text-white font-semibold hover:bg-white hover:text-primary transition-all duration-500 shadow-lg hover:shadow-2xl">
                Find a Doctor →
              </button>
            </NavLink>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SpecialitiesSection;