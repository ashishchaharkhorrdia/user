import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {

  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  return (
    <div className="relative py-12 sm:py-16 px-4 sm:px-6 md:px-10 lg:px-16 bg-white overflow-hidden -mx-4 md:-mx-6 lg:-mx-8 xl:-mx-12" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}> {/* Full viewport width */}

      {/* Background Glow Effects */}
      <div className="absolute w-[600px] h-[600px] bg-cyan-200/20 blur-[160px] rounded-full top-[-200px] left-[-200px]"></div>
      <div className="absolute w-[500px] h-[500px] bg-blue-200/20 blur-[140px] rounded-full bottom-[-200px] right-[-200px]"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-7xl mx-auto">

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-wide">
          Meet Our Elite Specialists
        </h1>

        <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl">
          Experience world-class healthcare delivered with precision,
          compassion and cutting-edge medical excellence.
        </p>

        {/* Doctor Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 w-full mt-8 sm:mt-10">

          {doctors.slice(0, 8).map((item, index) => (
            <div
              key={index}
              onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
              className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-lg"
            >

              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-32 sm:h-44 md:h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Info */}
              <div className="p-2.5 sm:p-4">

                <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">
                  {item.name}
                </h3>

                <p className="text-blue-600 text-xs sm:text-sm mt-1 line-clamp-1">
                  {item.speciality}
                </p>

                <div className="mt-1.5 text-[11px] sm:text-xs text-gray-500 line-clamp-2">
                  {item.experience} • {item.degree}
                </div>

                <div className="mt-2 text-xs sm:text-sm text-gray-900 font-medium">
                  Consultation: ₹{item.fees}
                </div>

              </div>

              {/* Light Sweep Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

            </div>
          ))}

        </div>

        {/* Button */}
        <button
          onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
          className="mt-10 sm:mt-12 px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-cyan-400 to-blue-400 text-white font-medium rounded-full shadow-lg hover:scale-105 transition-all duration-300"
        >
          Explore All Doctors
        </button>

      </div>
    </div>
  )
}

export default TopDoctors