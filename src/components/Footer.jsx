import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="w-full bg-white py-1 px-6 md:px-16"> {/* White background */}
      <div className='max-w-7xl mx-auto flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 text-sm'>

        {/* Logo & About */}
        <div>
          <img className='mb-5 w-40' src={assets.logo} alt="Zo-Doc Logo" />
          <p className='w-full md:w-2/3 text-gray-700 leading-6'>
            Zo-Doc is an online platform dedicated to providing top-notch healthcare services through experienced medical professionals. 
            Our mission is to offer accessible and personalized medical care to patients worldwide. 
            We connect patients with experienced doctors for consultations, diagnoses, and treatment plans, ensuring quality healthcare from the comfort of their homes.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className='text-xl font-medium mb-5 text-gray-900'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li className='hover:text-indigo-600 cursor-pointer transition'>Home</li>
            <li className='hover:text-indigo-600 cursor-pointer transition'>About Us</li>
            <li className='hover:text-indigo-600 cursor-pointer transition'>Delivery</li>
            <li className='hover:text-indigo-600 cursor-pointer transition'>Privacy Policy</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className='text-xl font-medium mb-5 text-gray-900'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+1-212-456-7890</li>
            <li>contact@zo-doc.com</li>
          </ul>
        </div>

      </div>

      {/* Divider & Copyright */}
      <div className='mt-16'>
        <hr className='border-gray-200' />
        <p className='py-5 text-sm text-center text-gray-600'>
          Copyright 2026 @ Zo-Doc.com - All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer