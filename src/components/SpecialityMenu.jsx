import React, { useEffect, useRef, useState } from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {

  const sliderRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const slider = sliderRef.current
    let scrollAmount = 0

    const autoSlide = () => {
      if (!slider || isHovered) return

      scrollAmount += 1
      slider.scrollLeft += 1

      if (scrollAmount >= slider.scrollWidth / 2) {
        slider.scrollLeft = 0
        scrollAmount = 0
      }
    }

    const interval = setInterval(autoSlide, 20)

    return () => clearInterval(interval)
  }, [isHovered])

  return (
    <div
      id="speciality"
      className="py-24 px-6 md:px-16 bg-white relative overflow-hidden -mx-4 md:-mx-6 lg:-mx-8 xl:-mx-12"
      style={{width: '100vw', marginLeft: 'calc(-50vw + 50%)'}}
    >
      {/* Section Title */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Explore by Speciality
        </h1>
        <p className="mt-4 text-gray-700 max-w-xl mx-auto">
          Discover top-rated medical experts across various specialties and book appointments instantly.
        </p>
      </div>

      {/* Horizontal Slider */}
      <div
        ref={sliderRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex gap-8 overflow-x-scroll no-scrollbar scroll-smooth px-2 md:px-10"
      >
        {[...specialityData, ...specialityData].map((item, index) => (
          <Link
            to={`/doctors/${item.speciality}`}
            key={index}
            onClick={() => scrollTo(0, 0)}
            className="min-w-[180px] bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 flex flex-col items-center group hover:-translate-y-3"
          >
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100 group-hover:scale-110 transition duration-500">
              <img src={item.image} alt="" className="w-16" />
            </div>
            <p className="mt-4 font-semibold text-gray-800 group-hover:text-blue-600 transition">
              {item.speciality}
            </p>
          </Link>
        ))}
      </div>
        </div>
    </div>
  )
}

export default SpecialityMenu