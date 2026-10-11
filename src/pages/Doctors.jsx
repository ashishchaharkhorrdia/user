import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

const Doctors = () => {
  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate()
  const { doctors, currencySymbol } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <section className="w-full bg-white py-8 px-3 sm:px-6 md:px-10 lg:px-16">

      {/* Page Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          Our <span className="text-indigo-600">Doctors</span>
        </h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Browse through top specialists and book appointments with ease.
        </p>
      </div>

      {/* Filters & Doctors */}
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6">

        {/* Filters */}
        <div className="flex flex-col md:w-64">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`py-2 px-4 border rounded text-sm transition-all md:hidden ${showFilter ? 'bg-indigo-600 text-white' : ''}`}
          >
            Filters
          </button>

          <div className={`flex-col gap-3 mt-4 text-sm text-gray-700 ${showFilter ? 'flex' : 'hidden md:flex'}`}>
            {['General physician', 'Gynecologist', 'Dermatologist', 'Pediatricians', 'Neurologist', 'Gastroenterologist', 'Lab'].map((spec, idx) => (
              <p
                key={idx}
                onClick={() =>
                  speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)
                }
                className={`pl-4 py-2 pr-6 border rounded cursor-pointer transition-all hover:bg-indigo-100 ${speciality === spec ? 'bg-indigo-100 text-black font-semibold' : ''
                  }`}
              >
                {spec}
              </p>
            ))}
          </div>
        </div>

        {/* Doctor Grid */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
          {filterDoc.map((doc, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg cursor-pointer overflow-hidden transition-all duration-500"
              onClick={() => { navigate(`/appointment/${doc._id}`); scrollTo(0, 0) }}
            >
              <div className="relative">
                <img className="w-full h-28 sm:h-40 md:h-48 object-cover" src={doc.image} alt={doc.name} />
                <motion.div
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${doc.available ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                    }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {doc.available ? 'Available' : 'Not Available'}
                </motion.div>
              </div>

              <div className="p-2.5 sm:p-4">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">{doc.name}</h3>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">{doc.type === 'lab' ? 'Lab Provider' : doc.speciality}</p>
                <div className="flex items-center gap-1 sm:gap-2 mt-1.5 sm:mt-2">
                  <span className="text-yellow-400 text-xs">{'⭐'.repeat(Math.round(doc.rating || 5))}</span>
                  <span className="text-gray-500 text-[10px] sm:text-xs">({(Array.isArray(doc.reviews) ? doc.reviews.length : (doc.reviews || 0))} reviews)</span>
                </div>
                <p className="text-gray-500 text-[10px] sm:text-xs mt-1 line-clamp-2">{doc.experience} years experience • {doc.degree}</p>
                <p className="text-gray-900 font-medium mt-2 text-xs sm:text-sm">Consultation: {currencySymbol}{doc.fees}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Doctors