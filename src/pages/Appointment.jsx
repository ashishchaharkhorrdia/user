import React, { useContext, useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import DoctorMap from '../components/DoctorMap'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

const Appointment = () => {

    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext)
    const { t } = useTranslation()
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(false)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const [selectedTests, setSelectedTests] = useState([])
    const [amount, setAmount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isBooking, setIsBooking] = useState(false)
    const [fadeIn, setFadeIn] = useState(false)
    const [reminders, setReminders] = useState([])
    const [newReminderTime, setNewReminderTime] = useState('')
    const [newReminderLabel, setNewReminderLabel] = useState('')
    const timersRef = useRef({})

    const navigate = useNavigate()

    const fetchDocInfo = async () => {
        const docInfo = doctors.find((doc) => doc._id === docId)
        setDocInfo(docInfo)
        if (docInfo) {
            setAmount(docInfo.type === 'lab' ? Number(docInfo.fees || 0) : docInfo.fees)
            setSelectedTests([])
        }
        setFadeIn(true)
    }

    const toggleTest = (test) => {
        const exists = selectedTests.some(t => t.name === test.name)
        const updatedTests = exists
            ? selectedTests.filter(t => t.name !== test.name)
            : [...selectedTests, test]
        setSelectedTests(updatedTests)
        setAmount((docInfo?.fees ? Number(docInfo.fees) : 0) + updatedTests.reduce((sum, item) => sum + Number(item.price || 0), 0))
    }

    const isTestSelected = (test) => selectedTests.some(t => t.name === test.name)

    const getAvailableSolts = async () => {

        setDocSlots([])

        // getting current date
        let today = new Date()

        for (let i = 0; i < 7; i++) {

            // getting date with index 
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            // determine availability range and slot duration (defaults)
            const defaultFrom = '10:00'
            const defaultTo = '21:00'
            const from = docInfo?.availableFrom || defaultFrom
            const to = docInfo?.availableTo || defaultTo
            const slotDuration = Number(docInfo?.slotDuration || 60) // minutes

            const [fromH, fromM] = from.split(':').map(Number)
            const [toH, toM] = to.split(':').map(Number)

            // setting end time of the date with index
            let endTime = new Date()
            endTime.setDate(today.getDate() + i)
            endTime.setHours(toH, toM, 0, 0)

            // setting start time for the date
            if (today.getDate() === currentDate.getDate()) {
                // start from max(now, availableFrom)
                const now = new Date()
                const candidate = new Date(currentDate)
                candidate.setHours(fromH, fromM, 0, 0)
                // if now is later than candidate, use now rounded up to next slotDuration
                if (now > candidate) {
                    // round now up to nearest slotDuration
                    const mins = Math.ceil((now.getHours() * 60 + now.getMinutes()) / slotDuration) * slotDuration
                    currentDate.setHours(0, 0, 0, 0)
                    currentDate.setHours(Math.floor(mins / 60), mins % 60, 0, 0)
                } else {
                    currentDate.setHours(fromH, fromM, 0, 0)
                }
            } else {
                currentDate.setHours(fromH, fromM, 0, 0)
            }

            let timeSlots = [];


            while (currentDate < endTime) {
                let startTime = new Date(currentDate)
                let endTime = new Date(currentDate)
                endTime.setMinutes(endTime.getMinutes() + slotDuration)
                let formattedStart = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                let formattedEnd = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                const formattedRange = `${formattedStart} - ${formattedEnd}`

                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()

                const slotDate = day + "_" + month + "_" + year
                // use range as slot identifier (also accept single-time formats if present in booked slots)
                const slotTime = formattedRange

                const bookedForDate = (docInfo && docInfo.slots_booked && docInfo.slots_booked[slotDate]) || []
                // count bookings matching either the full range or the start-time
                const bookedCount = bookedForDate.filter(s => s === formattedRange || s === formattedStart).length
                const SLOT_CAPACITY = 6
                const isFull = bookedCount >= SLOT_CAPACITY

                // Add slot to array with booking count and availability
                timeSlots.push({
                    datetime: new Date(currentDate),
                    time: `${formattedStart} - ${formattedEnd}`,
                    bookedCount,
                    isFull
                })

                // Increment current time by configured slot duration
                currentDate.setMinutes(currentDate.getMinutes() + slotDuration);
            }

            setDocSlots(prev => ([...prev, timeSlots]))

        }

        setIsLoading(false)
    }

    const bookAppointment = async () => {

        if (!token) {
            toast.warning('Login to book appointment')
            return navigate('/login')
        }

        // find the selected slot datetime in the chosen day
        const daySlots = docSlots[slotIndex] || []
        const chosenSlot = daySlots.find(s => s.time === slotTime) || daySlots[0]
        const date = chosenSlot ? chosenSlot.datetime : (daySlots[0] ? daySlots[0].datetime : new Date())

        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        const slotDate = day + "_" + month + "_" + year

        if (docInfo?.type === 'lab' && selectedTests.length === 0) {
            toast.warning('Select at least one lab test')
            return
        }

        try {
            setIsBooking(true)
            const bookingPayload = {
                docId,
                slotDate,
                slotTime,
                amount,
                selectedTests: docInfo?.type === 'lab' ? selectedTests : []
            }
            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', bookingPayload, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                getDoctosData()
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setIsBooking(false)
        }

    }

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo()
        }
    }, [doctors, docId])

    // If doctors list is empty on mount, try refetching once (helps if initial fetch failed)
    useEffect(() => {
        if (doctors.length === 0) {
            try { getDoctosData() } catch (e) { console.error(e) }
        }
    }, [])

    useEffect(() => {
        if (docInfo) {
            getAvailableSolts()
        }
    }, [docInfo])

    // --- Medicine reminders logic ---
    useEffect(() => {
        // load reminders from localStorage and schedule them
        try {
            const raw = localStorage.getItem('medicineReminders')
            const list = raw ? JSON.parse(raw) : []
            setReminders(list)
            scheduleAllReminders(list)
        } catch (e) {
            console.error('Failed to load reminders', e)
        }

        // cleanup on unmount
        return () => {
            Object.values(timersRef.current).forEach(id => clearTimeout(id))
            timersRef.current = {}
        }
    }, [])

    const saveReminders = (list) => {
        try {
            localStorage.setItem('medicineReminders', JSON.stringify(list))
        } catch (e) {
            console.error('Failed to save reminders', e)
        }
    }

    const scheduleAllReminders = (list) => {
        // clear existing timers
        Object.values(timersRef.current).forEach(id => clearTimeout(id))
        timersRef.current = {}

        list.forEach(r => scheduleReminder(r))
    }

    const scheduleReminder = (reminder) => {
        const when = new Date(reminder.time).getTime()
        const now = Date.now()
        const msUntil = when - now
        if (msUntil <= 0) return // too late
        const id = setTimeout(() => triggerReminder(reminder), msUntil)
        timersRef.current[reminder.id] = id
    }

    const triggerReminder = (reminder) => {
        // show notification / toast and beep
        try {
            if (window.Notification && Notification.permission === 'granted') {
                new Notification(reminder.label || 'Medicine Reminder', { body: 'Time to take your medicine' })
            }
        } catch (e) {
            console.error('Notification error', e)
        }

        toast.info(reminder.label || 'Time to take your medicine')
        playBeep()

        // remove the triggered reminder (one-shot)
        const updated = reminders.filter(r => r.id !== reminder.id)
        setReminders(updated)
        saveReminders(updated)
    }

    const playBeep = () => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext
            if (!AudioCtx) return
            const ctx = new AudioCtx()
            const o = ctx.createOscillator()
            const g = ctx.createGain()
            o.type = 'sine'
            o.frequency.value = 1000
            o.connect(g)
            g.connect(ctx.destination)
            g.gain.setValueAtTime(0.0001, ctx.currentTime)
            o.start()
            g.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 0.02)
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1)
            setTimeout(() => {
                try { o.stop(); ctx.close() } catch (e) { }
            }, 1000)
        } catch (e) {
            console.error('Beep error', e)
        }
    }

    const requestNotificationPermission = async () => {
        if (!('Notification' in window)) return
        if (Notification.permission === 'default') {
            try { await Notification.requestPermission() } catch (e) { }
        }
    }

    const addReminder = async () => {
        if (!newReminderTime) return toast.warning('Please select date and time')
        await requestNotificationPermission()
        const id = Math.random().toString(36).slice(2, 9)
        const reminder = { id, time: newReminderTime, label: newReminderLabel || 'Medicine' }
        const updated = [...reminders, reminder].sort((a, b) => new Date(a.time) - new Date(b.time))
        setReminders(updated)
        saveReminders(updated)
        scheduleReminder(reminder)
        setNewReminderTime('')
        setNewReminderLabel('')
        toast.success('Reminder added')
    }

    const setReminderPreset = (preset) => {
        // determine base date: selected appointment day if present, else today
        let baseDate = new Date()
        if (docSlots && docSlots[slotIndex] && docSlots[slotIndex][0]) {
            baseDate = new Date(docSlots[slotIndex][0].datetime)
        }

        const year = baseDate.getFullYear()
        const month = String(baseDate.getMonth() + 1).padStart(2, '0')
        const day = String(baseDate.getDate()).padStart(2, '0')

        let hour = 8
        let minute = '00'
        if (preset === 'morning') { hour = 8 }
        else if (preset === 'afternoon') { hour = 13 }
        else if (preset === 'evening') { hour = 19 }

        const hh = String(hour).padStart(2, '0')

        // datetime-local expects YYYY-MM-DDTHH:MM
        const value = `${year}-${month}-${day}T${hh}:${minute}`
        setNewReminderTime(value)
    }

    const removeReminder = (id) => {
        const updated = reminders.filter(r => r.id !== id)
        setReminders(updated)
        saveReminders(updated)
        if (timersRef.current[id]) {
            clearTimeout(timersRef.current[id])
            delete timersRef.current[id]
        }
    }

    const averageRating = docInfo && docInfo.reviews && docInfo.reviews.length
        ? (docInfo.reviews.reduce((s, r) => s + (r.rating || 0), 0) / docInfo.reviews.length).toFixed(1)
        : null

    if (!docInfo) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <div className='flex gap-2'>
                    <div className='w-3 h-3 bg-primary rounded-full pulse-animate'></div>
                    <div className='w-3 h-3 bg-primary rounded-full pulse-animate' style={{ animationDelay: '0.2s' }}></div>
                    <div className='w-3 h-3 bg-primary rounded-full pulse-animate' style={{ animationDelay: '0.4s' }}></div>
                </div>
            </div>
        )
    }

    return (
        <div className='animate-fadeIn px-3 py-4 sm:px-4 sm:py-6 lg:px-12 lg:py-12'>
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
                
                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
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
                
                .animate-slideInLeft {
                    animation: slideInLeft 0.6s ease-out;
                }
                
                .pulse-animate {
                    animation: pulse 2s infinite;
                }
                
                .slot-transition {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}</style>
            {/* ---------- Doctor Details ----------- */}
            <div className='bg-white rounded-xl shadow-md overflow-hidden'>
                <div className='flex flex-col md:flex-row'>
                    <div className='md:w-[320px] lg:w-[300px]'>
                        <img
                            className='w-full h-56 md:h-full object-cover transition-transform duration-500 transform hover:scale-105'
                            src={docInfo.image}
                            alt={docInfo.name}
                        />
                    </div>

                    <div className='flex-1 p-4 sm:p-6'>
                        <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3'>
                            <div>
                                <div className='flex items-center gap-2'>
                                    <p className='text-lg sm:text-xl font-semibold text-gray-800'>{docInfo.name}</p>
                                    <img className='w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0' src={assets.verified_icon} alt='verified' />
                                </div>
                                <p className='text-sm text-gray-500 mt-1'>{docInfo.degree} • {docInfo.speciality}</p>
                                <p className='text-sm text-gray-500 mt-1'>{docInfo.clinicName || ''}</p>
                            </div>
                            <div className='text-left sm:text-right'>
                                <p className='text-sm text-gray-600'>{t('common.fee')}</p>
                                <p className='text-lg font-semibold'>{currencySymbol}{docInfo.fees}</p>
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-4'>
                            {averageRating && (
                                <div className='flex items-center gap-2'>
                                    <div className='bg-green-600 text-white px-2 py-1 rounded-md text-sm font-semibold'>{averageRating}</div>
                                    <div className='text-sm text-gray-600'>{docInfo.reviews.length} reviews</div>
                                </div>
                            )}
                            <div className='text-sm text-gray-600'>{t('appointment.experience')}: <span className='font-medium text-gray-800'>{docInfo.experience}</span></div>
                        </div>

                        <p className='text-sm text-gray-600 mt-4 line-clamp-4'>{docInfo.about}</p>

                        <div className='mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3'>
                            {docInfo.phone && (
                                <a href={`tel:${docInfo.phone}`} className='flex-1 text-center bg-primary text-white py-2 rounded-full text-sm'>Call</a>
                            )}
                            {docInfo.email && (
                                <a href={`mailto:${docInfo.email}`} className='flex-1 text-center border border-primary text-primary py-2 rounded-full text-sm'>Message</a>
                            )}
                        </div>

                        <div className='mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
                            <div>
                                <p className='text-sm font-medium text-gray-700'>{t('appointment.about')}</p>
                                <p className='text-sm text-gray-600 mt-2'>{docInfo.about}</p>

                                {docInfo.type === 'lab' && docInfo.tests?.length > 0 && (
                                    <div className='mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50'>
                                        <h3 className='text-sm font-semibold text-gray-800 mb-3'>Available Lab Tests</h3>
                                        <div className='grid gap-3'>
                                            {docInfo.tests.map((test, index) => (
                                                <button
                                                    type='button'
                                                    key={index}
                                                    onClick={() => toggleTest(test)}
                                                    className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition ${isTestSelected(test)
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-gray-200 bg-white text-gray-700 hover:border-primary'
                                                        }`}
                                                >
                                                    <div>
                                                        <p className='font-semibold'>{test.name}</p>
                                                        <p className='text-xs text-gray-500'>{test.description || 'Standard lab test'}</p>
                                                    </div>
                                                    <span className='text-sm font-semibold'>{currencySymbol}{test.price}</span>
                                                </button>
                                            ))}
                                        </div>
                                        <p className='mt-3 text-sm text-gray-700'>Selected total: <span className='font-semibold'>{currencySymbol}{amount}</span></p>
                                    </div>
                                )}

                                <div className='mt-4'>
                                    <p className='text-sm font-medium text-gray-700'>{t('appointment.specialities')}</p>
                                    <div className='flex flex-wrap gap-2 mt-2'>
                                        {(docInfo.tags || [docInfo.speciality]).slice(0, 6).map((t, i) => (
                                            <span key={i} className='text-xs px-3 py-1 rounded-full border text-gray-600'>{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className='text-sm font-medium text-gray-700'>{t('appointment.contact')}</p>
                                <div className='text-sm text-gray-600 mt-2 space-y-2'>
                                    {docInfo.phone && <div>{t('appointment.phone')}: <span className='font-medium text-gray-800'>{docInfo.phone}</span></div>}
                                    {docInfo.email && <div>{t('appointment.email')}: <span className='font-medium text-gray-800'>{docInfo.email}</span></div>}
                                    {docInfo.address && <div>{t('appointment.address')}: <span className='font-medium text-gray-800'>{docInfo.address?.line1}{docInfo.address?.line2 ? ', ' + docInfo.address?.line2 : ''}</span></div>}
                                </div>

                                <div className='mt-4 rounded-lg overflow-hidden border border-gray-200 h-32'>
                                    <DoctorMap docInfo={docInfo} />
                                </div>
                            </div>
                        </div>



                        <div className='mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4'>
                            <div className='p-4 rounded-md bg-gray-50 border'>
                                <p className='text-sm font-medium text-gray-700'>{t('appointment.patientInstructions')}</p>
                                <ul className='text-sm text-gray-600 mt-2 space-y-1 list-disc list-inside'>
                                    <li>{t('appointment.patientDocs')}</li>
                                    <li>{t('appointment.patientEarly')}</li>
                                    <li>{t('appointment.patientFasting')}</li>
                                </ul>
                            </div>

                            <div className='p-4 rounded-md bg-gray-50 border'>
                                <p className='text-sm font-medium text-gray-700'>{t('appointment.cancellationPolicy')}</p>
                                <p className='text-sm text-gray-600 mt-2'>{t('appointment.cancellationBox')}</p>
                            </div>

                            <div className='p-4 rounded-md bg-gray-50 border'>
                                <p className='text-sm font-medium text-gray-700'>{t('appointment.payment')}</p>
                                <p className='text-sm text-gray-600 mt-2'>{t('appointment.paymentBox')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking slots */}
            <div className='mt-8 lg:ml-72 lg:pl-4 font-medium text-[#565656] animate-slideInUp' style={{ animationDelay: '0.2s' }}>
                <p className='mb-2 text-lg font-semibold'>{t('appointment.bookingSlots')}</p>

                {isLoading ? (
                    <div className='flex gap-2 sm:gap-3 items-center w-full mt-4 overflow-x-auto pb-2'>
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className='text-center py-4 sm:py-6 min-w-14 sm:min-w-16 rounded-full border border-[#DDDDDD] pulse-animate bg-gray-200'></div>
                        ))}
                    </div>
                ) : (
                    <div className='flex gap-2 sm:gap-3 items-center w-full overflow-x-auto mt-4 pb-2'>
                        {docSlots && docSlots.length > 0 ? docSlots.map((item, index) => {
                            const isActive = slotIndex === index
                            const boxClass = isActive ? 'bg-primary text-white shadow-lg scale-105' : 'border border-[#DDDDDD] hover:border-primary hover:shadow-md'
                            return (
                                <div
                                    onClick={() => setSlotIndex(index)}
                                    key={index}
                                    className={`text-center py-4 sm:py-6 min-w-14 sm:min-w-16 rounded-full cursor-pointer slot-transition transform hover:scale-110 ${boxClass}`}
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <p className='font-semibold'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                                    <p className='text-sm'>{item[0] && item[0].datetime.getDate()}</p>
                                </div>
                            )
                        }) : (
                            <p className='text-sm text-gray-500'>No available days.</p>
                        )}
                    </div>
                )}

                {isLoading ? (
                    <div className='flex items-center gap-2 sm:gap-3 w-full mt-4 overflow-x-auto pb-2'>
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className='text-sm font-light flex-shrink-0 px-4 sm:px-5 py-2 rounded-full pulse-animate bg-gray-200'></div>
                        ))}
                    </div>
                ) : (
                    <div className='flex items-center gap-2 sm:gap-3 w-full overflow-x-auto mt-4 pb-2'>
                        {docSlots.length > 0 && docSlots[slotIndex] && docSlots[slotIndex].length > 0 ? docSlots[slotIndex].map((item, index) => (
                            <div
                                key={index}
                                className={`text-sm font-light flex-shrink-0 px-3 sm:px-5 py-2 rounded-full cursor-pointer slot-transition transform ${item.time === slotTime
                                    ? 'bg-primary text-white shadow-lg scale-105'
                                    : 'text-[#949494] border border-[#B4B4B4] hover:border-primary hover:shadow-md hover:scale-105'
                                    }`}
                            >
                                <div className='flex items-center gap-2'>
                                    <div onClick={() => !item.isFull && setSlotTime(item.time)} className='flex-1'>
                                        <div className={item.isFull ? 'line-through text-gray-400' : ''}>{item.time.toLowerCase()}</div>
                                    </div>
                                    <div className='text-xs text-gray-500'>{item.bookedCount}/{6}</div>
                                </div>
                            </div>
                        )) : (
                            <p className='text-sm text-gray-500'>No slots available for this doctor.</p>
                        )}
                    </div>
                )}

                <button
                    onClick={bookAppointment}
                    disabled={isBooking}
                    className={`bg-primary text-white text-sm font-light w-full sm:w-auto px-6 sm:px-20 py-3 rounded-full my-6 transition duration-300 transform hover:scale-105 active:scale-95 ${isBooking ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:bg-primary'
                        }`}
                >
                    {isBooking ? (
                        <span className='flex items-center justify-center gap-2'>
                            <span className='inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
                            {t('appointment.booking')}
                        </span>
                    ) : (
                        t('appointment.bookAppointment')
                    )}
                </button>
            </div>

            {/* Medicine Reminders */}
            <div className='mt-6 lg:ml-72 lg:pl-4'>
                <div className='p-4 rounded-md bg-white border'>
                    <p className='text-sm font-medium text-gray-700 mb-2'>Medicine Reminders</p>
                    <div className='flex flex-col gap-3'>
                        <div className='flex gap-2'>
                            <button onClick={() => setReminderPreset('morning')} className='px-3 py-1 rounded-md border text-sm'>Morning</button>
                            <button onClick={() => setReminderPreset('afternoon')} className='px-3 py-1 rounded-md border text-sm'>Afternoon</button>
                            <button onClick={() => setReminderPreset('evening')} className='px-3 py-1 rounded-md border text-sm'>Evening</button>
                        </div>
                        <div className='flex gap-2 flex-wrap'>
                            <input
                                type='datetime-local'
                                value={newReminderTime}
                                onChange={(e) => setNewReminderTime(e.target.value)}
                                className='px-3 py-2 border rounded-md text-sm'
                            />
                            <input
                                type='text'
                                placeholder='Label (optional)'
                                value={newReminderLabel}
                                onChange={(e) => setNewReminderLabel(e.target.value)}
                                className='px-3 py-2 border rounded-md text-sm'
                            />
                            <button onClick={addReminder} className='bg-primary text-white px-4 py-2 rounded-full text-sm'>Add Reminder</button>
                        </div>


                        {reminders.length > 0 ? (
                            <ul className='mt-3 space-y-2 text-sm text-gray-700'>
                                {reminders.map(r => (
                                    <li key={r.id} className='flex items-center justify-between gap-3'>
                                        <div>
                                            <div className='font-medium'>{r.label}</div>
                                            <div className='text-xs text-gray-500'>{new Date(r.time).toLocaleString()}</div>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <button onClick={() => removeReminder(r.id)} className='text-red-600 text-sm'>Remove</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className='mt-3 text-sm text-gray-500'>No reminders set.</p>
                        )}
                    </div>
                </div>

                {/* Listing Releated Doctors */}
                <div className='animate-slideInUp' style={{ animationDelay: '0.4s' }}>
                    <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
                </div>
            </div>
        </div>
    )
}

export default Appointment