import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { FaHome, FaCalendarCheck, FaInfoCircle, FaPhone } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

const Navbar = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)
  const { t } = useTranslation()

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  return (
    <div className='relative md:sticky md:top-0 md:z-50'>
      {/* Desktop Navbar */}
      <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD] px-4 md:px-10 bg-white'>
        <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="" />
        <ul className='md:flex items-center gap-5 font-medium hidden'>
          <NavLink to='/'><li className='py-1'>{t('nav.home')}</li></NavLink>
          <NavLink to='/doctors'><li className='py-1'>{t('nav.doctors')}</li></NavLink>
          <NavLink to='/about'><li className='py-1'>{t('nav.about')}</li></NavLink>
          <NavLink to='/contact'><li className='py-1'>{t('nav.contact')}</li></NavLink>
        </ul>

        <div className='flex items-center gap-4'>
          {token && userData ? (
            <div className='hidden md:flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-8 rounded-full' src={userData.image} alt="" />
              <img className='w-2.5' src={assets.dropdown_icon} alt="" />
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-gray-50 rounded flex flex-col gap-4 p-4'>
                  <p onClick={() => navigate('/my-profile')} className='hover:text-black cursor-pointer'>{t('nav.myProfile')}</p>
                  <p onClick={() => navigate('/my-appointments')} className='hover:text-black cursor-pointer'>{t('nav.myAppointments')}</p>
                  <p onClick={logout} className='hover:text-black cursor-pointer'>{t('nav.logout')}</p>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>
              {t('nav.login')}
            </button>
          )}

          <div className='flex items-center gap-2 md:hidden'>
            {token && userData ? (
              <div className='relative group'>
                <button
                  onClick={() => navigate('/my-profile')}
                  className='flex items-center rounded-full border border-gray-200 p-1.5'
                >
                  <img className='w-8 h-8 rounded-full' src={userData.image} alt='profile' />
                </button>

                <div className='absolute right-0 top-full mt-2 w-44 rounded-xl border border-gray-200 bg-white p-2 shadow-lg z-50 hidden group-focus-within:block group-hover:block'>
                  <button
                    onClick={() => navigate('/my-appointments')}
                    className='block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
                  >
                    {t('nav.myAppointments')}
                  </button>
                  <button
                    onClick={logout}
                    className='block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => navigate('/login')} className='bg-primary text-white px-3 py-2 rounded-full text-sm font-medium'>
                {t('nav.login')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ---- Mobile Slide Menu ---- */}
      {/* <div className={`md:hidden ${showMenu ? 'fixed w-full h-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-30 overflow-hidden bg-white transition-all`}>
        <div className='flex items-center justify-between px-5 py-6 shadow-md'> */}
      {/* <img src={assets.logo} className='w-36' alt="" /> */}
      {/* <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7 cursor-pointer' alt="" /> */}
      {/* </div> */}
      {/* <ul className='flex flex-col items-center gap-4 mt-10 px-5 text-lg font-medium'>
          <NavLink onClick={() => setShowMenu(false)} to='/'><li className='px-4 py-2 rounded w-full text-center'>{t('nav.home')}</li></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/doctors'><li className='px-4 py-2 rounded w-full text-center'>{t('nav.doctors')}</li></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/about'><li className='px-4 py-2 rounded w-full text-center'>{t('nav.about')}</li></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to='/contact'><li className='px-4 py-2 rounded w-full text-center'>{t('nav.contact')}</li></NavLink>
        </ul> */}
      {/* </div > */}

      {/* ---- Mobile Bottom Navbar ---- */}
      <div className="fixed bottom-0 left-0 w-full bg-white sm:hidden border-t shadow-md z-40" >
        <div className="flex justify-around py-2">
          <NavLink to="/" className={({ isActive }) => `flex flex-col items-center text-xs transition-colors ${isActive ? 'text-primary' : 'text-gray-600'}`}>
            <FaHome size={20} />
            <span>{t('nav.home')}</span>
          </NavLink>
          <NavLink to="/doctors" className={({ isActive }) => `flex flex-col items-center text-xs transition-colors ${isActive ? 'text-primary' : 'text-gray-600'}`}>
            <FaCalendarCheck size={20} />
            <span>{t('nav.doctors')}</span>
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `flex flex-col items-center text-xs transition-colors ${isActive ? 'text-primary' : 'text-gray-600'}`}>
            <FaInfoCircle size={20} />
            <span>{t('nav.about')}</span>
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `flex flex-col items-center text-xs transition-colors ${isActive ? 'text-primary' : 'text-gray-600'}`}>
            <FaPhone size={20} />
            <span>{t('nav.contact')}</span>
          </NavLink>
        </div>
      </div >
    </div >
  )
}

export default Navbar
