import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const navigate = useNavigate()

    return (
        <div className='relative overflow-hidden -mx-4 md:-mx-6 lg:-mx-8 xl:-mx-12' style={{width: '100vw', marginLeft: 'calc(-50vw + 50%)'}}> {/* Full viewport width */}

            {/* Background Gradient Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/50 to-white/20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,255,255,0.2),_transparent_60%)]"></div>

            {/* Glass Container */}
            <div className='relative flex flex-col md:flex-row items-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl px-8 md:px-14 py-16 shadow-2xl mx-6 md:mx-12 lg:mx-16'>

                {/* ------- Left Side ------- */}
                <div className='flex-1 text-dark space-y-6'>

                    <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-wide'>
                        Book Your Appointment
                    </h2>

                    <p className='mt-6 text-lg text-gray-300 max-w-xl'>
                        Experience world-class healthcare with
                        <span className="text-cyan-400 font-semibold"> 100+ elite specialists </span>
                        delivering precision care and premium treatment.
                    </p>

                    <button
                        onClick={() => { navigate('/login'); scrollTo(0, 0) }}
                        className='mt-8 px-10 py-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold tracking-wide shadow-lg hover:scale-105 hover:shadow-cyan-500/40 transition-all duration-500'
                    >
                        Create Premium Account
                    </button>

                </div>

                {/* ------- Right Side ------- */}
                <div className='md:w-1/2 lg:w-[420px] relative'> {/* Removed mt-12 md:mt-0 */}
                    <img
                        className='w-full drop-shadow-[0_20px_40px_rgba(0,255,255,0.25)] animate-fadeIn'
                        src={assets.appointment_img}
                        alt=""
                    />
                </div>

            </div>
        </div>
    )
}

export default Banner