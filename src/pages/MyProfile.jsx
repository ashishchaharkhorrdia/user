import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyProfile = () => {

    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    // Function to update user profile data using API
    const updateUserProfileData = async () => {

        try {
            setIsLoading(true)
            const formData = new FormData();

            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)

            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }

    }

    return userData ? (
        <div className='w-full animate-fadeIn'>
            <style>{`
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }
                
                .animate-slideInUp {
                    animation: slideInUp 0.6s ease-out;
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out;
                }
                
                .pulse-animate {
                    animation: pulse 2s infinite;
                }
                
                .input-field {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .input-field:focus {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                }
            `}</style>

            <div className='max-w-4xl mx-auto py-4 px-3 sm:px-6 sm:py-8'>

                {/* Header */}
                <div className='mb-4 sm:mb-8 animate-slideInUp'>
                    <h1 className='text-2xl sm:text-4xl font-bold text-gray-900 pb-2'>My Profile</h1>
                    <p className='text-sm sm:text-base text-gray-500'>Manage your personal information and health details</p>
                </div>

                {/* Profile Card */}
                <div className='bg-white rounded-2xl shadow-lg overflow-hidden animate-slideInUp' style={{ animationDelay: '0.1s' }}>

                    {/* Profile Image Section */}
                    <div className='bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 sm:p-8'>
                        {isEdit ? (
                            <label htmlFor='image'>
                                <div className='inline-block relative cursor-pointer group'>
                                    <div className='relative w-24 h-24 sm:w-40 sm:h-40 overflow-hidden rounded-2xl shadow-lg'>
                                        <img
                                            className='w-full h-full object-cover transition duration-300 group-hover:scale-110'
                                            src={image ? URL.createObjectURL(image) : userData.image}
                                            alt="Profile"
                                        />
                                        <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center rounded-2xl'>
                                            <span className='text-white text-sm font-semibold'>Change Photo</span>
                                        </div>
                                    </div>
                                    <img className='w-8 sm:w-12 absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg' src={assets.upload_icon} alt="Upload" />
                                </div>
                                <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                            </label>
                        ) : (
                            <div className='relative w-24 h-24 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-lg'>
                                <img className='w-full h-full object-cover' src={userData.image} alt="Profile" />
                            </div>
                        )}
                    </div>

                    {/* Form Content */}
                    <div className='p-4 sm:p-8'>

                        {/* Name Section */}
                        <div className='mb-5 sm:mb-8 animate-slideInUp' style={{ animationDelay: '0.15s' }}>
                            <label className='block text-sm font-semibold text-gray-700 mb-2 sm:mb-3'>Full Name</label>
                            {isEdit ? (
                                <input
                                    className='w-full bg-gray-100 text-xl sm:text-3xl font-bold px-4 py-3 rounded-xl border border-gray-300 input-field focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                    type="text"
                                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                                    value={userData.name}
                                />
                            ) : (
                                <p className='font-bold text-xl sm:text-3xl text-gray-900'>{userData.name}</p>
                            )}
                        </div>

                        <hr className='bg-gray-200 h-[1px] border-none mb-5 sm:mb-8' />

                        {/* Contact Information */}
                        <div className='mb-5 sm:mb-8 animate-slideInUp' style={{ animationDelay: '0.2s' }}>
                            <h3 className='text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2'>
                                📧 Contact Information
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6'>

                                {/* Email */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                                    <p className='text-blue-600 font-medium text-lg bg-blue-50 px-4 py-3 rounded-lg'>{userData.email}</p>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Phone Number</label>
                                    {isEdit ? (
                                        <input
                                            className='w-full bg-gray-100 px-4 py-3 rounded-lg border border-gray-300 input-field focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                            type="tel"
                                            onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                                            value={userData.phone}
                                        />
                                    ) : (
                                        <p className='text-blue-600 font-medium text-lg bg-blue-50 px-4 py-3 rounded-lg'>{userData.phone}</p>
                                    )}
                                </div>

                                {/* Address Line 1 */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Address Line 1</label>
                                    {isEdit ? (
                                        <input
                                            className='w-full bg-gray-100 px-4 py-3 rounded-lg border border-gray-300 input-field focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                            type="text"
                                            onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                                            value={userData.address.line1}
                                        />
                                    ) : (
                                        <p className='text-gray-700 bg-gray-50 px-4 py-3 rounded-lg'>{userData.address.line1}</p>
                                    )}
                                </div>

                                {/* Address Line 2 */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Address Line 2</label>
                                    {isEdit ? (
                                        <input
                                            className='w-full bg-gray-100 px-4 py-3 rounded-lg border border-gray-300 input-field focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                            type="text"
                                            onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                                            value={userData.address.line2}
                                        />
                                    ) : (
                                        <p className='text-gray-700 bg-gray-50 px-4 py-3 rounded-lg'>{userData.address.line2}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className='mb-5 sm:mb-8 animate-slideInUp' style={{ animationDelay: '0.25s' }}>
                            <h3 className='text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2'>
                                👤 Basic Information
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6'>

                                {/* Gender */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Gender</label>
                                    {isEdit ? (
                                        <select
                                            className='w-full bg-gray-100 px-4 py-3 rounded-lg border border-gray-300 input-field focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                            onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                                            value={userData.gender}
                                        >
                                            <option value="Not Selected">Not Selected</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    ) : (
                                        <p className='text-gray-700 bg-gray-50 px-4 py-3 rounded-lg font-medium'>{userData.gender}</p>
                                    )}
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>Date of Birth</label>
                                    {isEdit ? (
                                        <input
                                            className='w-full bg-gray-100 px-4 py-3 rounded-lg border border-gray-300 input-field focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                            type='date'
                                            onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                                            value={userData.dob}
                                        />
                                    ) : (
                                        <p className='text-gray-700 bg-gray-50 px-4 py-3 rounded-lg font-medium'>{userData.dob}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-10 animate-slideInUp' style={{ animationDelay: '0.3s' }}>
                            {isEdit ? (
                                <>
                                    <button
                                        onClick={updateUserProfileData}
                                        disabled={isLoading}
                                        className={`w-full sm:flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-4 sm:px-8 py-2.5 sm:py-3 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <span className='flex items-center justify-center gap-2'>
                                                <span className='inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
                                                Saving...
                                            </span>
                                        ) : (
                                            'Save Information'
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEdit(false)
                                            setImage(false)
                                        }}
                                        className='w-full sm:flex-1 bg-gray-200 text-gray-700 font-semibold px-4 sm:px-8 py-2.5 sm:py-3 rounded-full hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 active:scale-95'
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEdit(true)}
                                    className='w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-4 sm:px-8 py-2.5 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95'
                                >
                                    ✏️ Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    ) : null
}

export default MyProfile