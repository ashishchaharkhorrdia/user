import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <section className="w-full bg-white py-16 px-6 md:px-16"> {/* White background */}

      {/* Section Header */}
      <div className='text-center mb-12'>
        <h2 className='text-3xl md:text-4xl font-bold text-gray-900 tracking-wide'>
          ABOUT <span className='text-indigo-600'>US</span>
        </h2>
      </div>

      {/* About Content */}
      <div className='flex flex-col md:flex-row items-center gap-12 max-w-7xl mx-auto mb-16'>
        <img 
          className='w-full md:max-w-[360px] rounded-2xl shadow-lg' 
          src={assets.about_image} 
          alt="About Zo-Doc" 
        />
        <div className='flex flex-col justify-center gap-6 md:w-2/3 text-gray-700 text-sm'>
          <p>
            Welcome to Zo-Doc, your trusted partner in managing your healthcare needs conveniently and efficiently. 
            At Zo-Doc, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.
          </p>
          <p>
            Zo-Doc is committed to excellence in healthcare technology. We continuously strive to enhance our platform, 
            integrating the latest advancements to improve user experience and deliver superior service. 
            Whether you're booking your first appointment or managing ongoing care, Zo-Doc is here to support you every step of the way.
          </p>
          <b className='text-gray-900 text-lg'>Our Vision</b>
          <p>
            Our vision at Zo-Doc is to create a seamless healthcare experience for every user. 
            We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.
          </p>
        </div>
      </div>

      {/* Why Choose Us Header */}
      <div className='text-center mb-10'>
        <h3 className='text-2xl md:text-3xl font-semibold text-gray-900'>
          WHY <span className='text-indigo-600'>CHOOSE US</span>
        </h3>
      </div>

      {/* Features */}
      <div className='flex flex-col md:flex-row gap-6 max-w-7xl mx-auto'>
        <div className='border border-gray-200 px-8 md:px-12 py-8 sm:py-16 flex flex-col gap-4 text-gray-700 rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 cursor-pointer'>
          <b className='text-gray-900 font-medium'>EFFICIENCY:</b>
          <p className='text-sm'>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className='border border-gray-200 px-8 md:px-12 py-8 sm:py-16 flex flex-col gap-4 text-gray-700 rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 cursor-pointer'>
          <b className='text-gray-900 font-medium'>CONVENIENCE:</b>
          <p className='text-sm'>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className='border border-gray-200 px-8 md:px-12 py-8 sm:py-16 flex flex-col gap-4 text-gray-700 rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 cursor-pointer'>
          <b className='text-gray-900 font-medium'>PERSONALIZATION:</b>
          <p className='text-sm'>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>

    </section>
  )
}

export default About