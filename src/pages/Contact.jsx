import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Contact = () => {
  return (
    <section className="w-full bg-white py-16 px-6 md:px-16"> {/* White background */}

      {/* Header */}
      <div className='text-center mb-12'>
        <h2 className='text-3xl md:text-4xl font-bold text-gray-900 tracking-wide'>
          CONTACT <span className='text-indigo-600'>US</span>
        </h2>
      </div>

      {/* Content */}
      <div className='flex flex-col md:flex-row items-center justify-center gap-10 max-w-7xl mx-auto'>

        {/* Image */}
        <img
          className='w-full md:max-w-[360px] rounded-2xl shadow-lg'
          src={assets.contact_image}
          alt="Contact Us"
        />

        {/* Contact Details */}
        <div className='flex flex-col justify-center items-start gap-6'>

          {/* Office Info */}
          <p className='font-semibold text-lg text-gray-800'>OUR OFFICE</p>
          <p className='text-gray-600'>
            54709 Willms Station <br /> Suite 350, Washington, USA
          </p>
          <p className='text-gray-600'>
            Tel: (415) 555-0132 <br /> Email: admin@Zo-Doc.com
          </p>

          {/* Careers Info */}
          <p className='font-semibold text-lg text-gray-800'>CAREERS AT Zo-Doc</p>
          <p className='text-gray-600'>
            Learn more about our teams and job openings.
          </p>

          {/* Button */}
          <Link to={'/careers'}>
            <button className='border border-gray-800 px-8 py-4 text-sm rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-500'>
              Explore Jobs
            </button>
          </Link>
        </div>

      </div>

    </section>
  )
}

export default Contact