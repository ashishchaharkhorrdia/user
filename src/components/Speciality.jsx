import React, { useEffect, useRef } from 'react';

const Speciality = () => {
  const sliderRef = useRef(null);

  const data = [
    { name: 'Cardiology', emoji: '❤️' },
    { name: 'ENT', emoji: '👂' },
    { name: 'Gastro', emoji: '🍽️' },
    { name: 'Surgery', emoji: '🩺' },
    { name: 'Infertility', emoji: '🤰' },
    { name: 'Medicine', emoji: '💊' },
    { name: 'Mental Health', emoji: '🧠' },
    { name: 'Nephrology', emoji: '🩸' },
    { name: 'Neurology', emoji: '🧬' },
    { name: 'Orthopedic', emoji: '🦴' },
    { name: 'Pediatrics', emoji: '👶' },
    { name: 'Dermatology', emoji: '🌞' },
  ];

  const loopData = [...data, ...data];

  // Smooth Auto Scroll
  useEffect(() => {
    const slider = sliderRef.current;

    const interval = setInterval(() => {
      if (!slider) return;

      slider.scrollLeft += 1;

      if (slider.scrollLeft >= slider.scrollWidth / 2) {
        slider.scrollLeft = 0;
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const scrollLeft = () => {
    sliderRef.current.scrollLeft -= 250;
  };

  const scrollRight = () => {
    sliderRef.current.scrollLeft += 250;
  };

  return (
    <div className="relative py-24 bg-white overflow-hidden -mx-4 md:-mx-6 lg:-mx-8 xl:-mx-12" style={{width: '100vw', marginLeft: 'calc(-50vw + 50%)'}}> {/* Full viewport width */}

      {/* Glow Background */}
      <div className="absolute w-[600px] h-[600px] bg-cyan-200/20 blur-[150px] rounded-full top-[-200px] left-[-200px]"></div>
      <div className="absolute w-[500px] h-[500px] bg-blue-200/20 blur-[150px] rounded-full bottom-[-200px] right-[-200px]"></div>

      <div className="relative z-10 px-6 md:px-16 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10 text-gray-900">
          <div>
            <h2 className="text-4xl font-semibold tracking-wide">
              Medical Specialities
            </h2>
            <p className="text-gray-600 mt-2">
              Explore healthcare expertise across departments
            </p>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex gap-8 overflow-x-scroll scroll-smooth no-scrollbar"
        >
          {loopData.map((item, index) => (
            <div
              key={index}
              className="min-w-[220px] h-[190px] bg-white rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-lg"
            >
              <div className="text-5xl mb-4 transition-transform duration-500">
                {item.emoji}
              </div>
              <p className="text-gray-900 font-medium tracking-wide">
                {item.name}
              </p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-6 mt-12">
          <button
            onClick={scrollLeft}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 text-white text-xl shadow-lg hover:scale-110 transition-all duration-300"
          >
            ❮
          </button>
          <button
            onClick={scrollRight}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 text-white text-xl shadow-lg hover:scale-110 transition-all duration-300"
          >
            ❯
          </button>
        </div>

      </div>
    </div>
  );
};

export default Speciality;