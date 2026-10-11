import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyAppointments = () => {

    const { backendUrl, token, currencySymbol } = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')
    const [expandedAppointment, setExpandedAppointment] = useState(null)
    const [reviewState, setReviewState] = useState({ appointmentId: null, rating: 0, comment: '' })

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    // Get Appointments
    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + '/api/user/appointments',
                { headers: { token } }
            )
            setAppointments(data.appointments.reverse())
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Cancel
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/cancel-appointment',
                { appointmentId },
                { headers: { token } }
            )

            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const openReview = (appointment) => {
        setReviewState({ appointmentId: appointment._id, rating: 0, comment: '' })
    }

    const submitReview = async () => {
        try {
            const { appointmentId, rating, comment } = reviewState
            if (!rating || !appointmentId) return toast.error('Please select rating')

            const appointment = appointments.find(a => a._id === appointmentId)
            if (!appointment) return toast.error('Appointment not found')

            const payload = {
                appointmentId,
                docId: appointment.docId,
                rating,
                comment
            }

            const { data } = await axios.post(
                backendUrl + '/api/user/add-review',
                payload,
                { headers: { token } }
            )

            if (data.success) {
                toast.success(data.message)
                setReviewState({ appointmentId: null, rating: 0, comment: '' })
                getUserAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    // Razorpay
    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Appointment Payment',
            order_id: order.id,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(
                        backendUrl + "/api/user/verifyRazorpay",
                        response,
                        { headers: { token } }
                    )
                    if (data.success) {
                        getUserAppointments()
                    }
                } catch (error) {
                    toast.error(error.message)
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const appointmentRazorpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/payment-razorpay',
                { appointmentId },
                { headers: { token } }
            )
            if (data.success) initPay(data.order)
            else toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (token) getUserAppointments()
    }, [token])

    return (
        <div className="w-full min-h-screen px-4 md:px-10 py-10 bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe]" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>

            <h1 className="text-2xl md:text-3xl font-bold mb-8">
                My Appointments
            </h1>

            <div className="flex flex-col gap-6">

                {appointments.map((item, index) => (

                    <div key={index}
                        className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-2xl transition duration-300">

                        {/* Doctor Image */}
                        <img
                            className="w-32 h-32 object-cover rounded-xl bg-blue-50"
                            src={item.docData.image}
                            alt=""
                        />

                        {/* Doctor Info */}
                        <div className="flex-1 text-gray-700">

                            <h2 className="text-xl font-semibold text-gray-900">
                                {item.docData.name}
                            </h2>

                            <p className="text-blue-600 font-medium">
                                {item.docData.type === 'lab' ? 'Lab' : item.docData.speciality}
                            </p>

                            <p className="mt-2 text-sm">
                                <span className="font-medium">Experience:</span> {item.docData.experience}
                            </p>

                            <p className="text-sm">
                                <span className="font-medium">Total:</span> {currencySymbol}{item.amount}
                            </p>
                            {item.selectedTests?.length > 0 && (
                                <p className="mt-2 text-sm">
                                    <span className="font-medium">Tests:</span> {item.selectedTests.map(t => t.name).join(', ')}
                                </p>
                            )}

                            <p className="mt-3 text-sm">
                                <span className="font-medium">Address:</span>
                                <br />
                                {item.docData.address?.line1 || 'N/A'}
                                <br />
                                {item.docData.address?.line2 || ''}
                            </p>

                            <p className="mt-3 text-sm">
                                <span className="font-medium">Date & Time:</span>
                                <br />
                                {slotDateFormat(item.slotDate)} | {item.slotTime}
                            </p>

                        </div>

                        {/* Status + Actions */}
                        <div className="flex flex-col gap-3 justify-between">

                            {/* Status Badge */}
                            {item.cancelled && (
                                <span className="px-4 py-1 text-sm rounded-full bg-red-100 text-red-600 text-center">
                                    Cancelled
                                </span>
                            )}

                            {item.isCompleted && (
                                <span className="px-4 py-1 text-sm rounded-full bg-green-100 text-green-600 text-center">
                                    Completed
                                </span>
                            )}

                            {!item.cancelled && item.payment && !item.isCompleted && (
                                <span className="px-4 py-1 text-sm rounded-full bg-blue-100 text-blue-600 text-center">
                                    Paid
                                </span>
                            )}

                            {!item.cancelled && !item.payment && !item.isCompleted && (
                                <>
                                    <button
                                        onClick={() => appointmentRazorpay(item._id)}
                                        className="bg-primary text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
                                    >
                                        Pay Online
                                    </button>

                                    <button
                                        onClick={() => cancelAppointment(item._id)}
                                        className="border border-red-500 text-red-500 px-5 py-2 rounded-lg hover:bg-red-500 hover:text-white transition"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}

                            {(item.prescriptionItems?.length > 0 || item.nextAppointmentDate || item.selectedTests?.length > 0 || item.reports?.length > 0) && (
                                <button
                                    onClick={() => setExpandedAppointment(expandedAppointment === item._id ? null : item._id)}
                                    className="border border-slate-300 bg-slate-50 text-slate-700 px-5 py-2 rounded-lg hover:bg-slate-100 transition"
                                >
                                    {expandedAppointment === item._id ? 'Hide Details' : 'View Details'}
                                </button>
                            )}

                        </div>

                        {expandedAppointment === item._id && (
                            <div className="w-full">
                                <div className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                                    <h3 className="text-lg font-semibold mb-3">Appointment Details</h3>
                                    {item.selectedTests?.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="font-semibold mb-2">Selected Lab Tests</h4>
                                            <ul className="list-disc list-inside text-sm text-slate-700">
                                                {item.selectedTests.map((test, idx) => (
                                                    <li key={idx}>{test.name} - {currencySymbol}{test.price}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {item.reports?.length > 0 ? (
                                        <div className="mb-4">
                                            <h4 className="font-semibold mb-2">Uploaded Reports</h4>
                                            <ul className="space-y-2 text-sm text-slate-700">
                                                {item.reports.map((report, idx) => (
                                                    <li key={idx} className="border rounded-lg p-3 bg-white">
                                                        <a href={report.url} target="_blank" rel="noreferrer" className="font-medium text-indigo-600 hover:underline">
                                                            {report.filename || `Report ${idx + 1}`}
                                                        </a>
                                                        {report.notes && <p className="text-gray-500 text-xs mt-1">{report.notes}</p>}
                                                        <p className="text-xs text-gray-400 mt-1">Uploaded on {new Date(report.date).toLocaleDateString()}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        item.docData.type === 'lab' && (
                                            <p className="text-sm text-slate-600">Reports have not been uploaded yet.</p>
                                        )
                                    )}
                                    {(item.prescriptionItems?.length > 0 || item.nextAppointmentDate) && (
                                        <div className="mt-3">
                                            <h4 className="font-semibold mb-2">Prescription Details</h4>
                                            {item.prescriptionItems?.length > 0 ? (
                                                <div className="space-y-3">
                                                    <table className="w-full border-collapse text-left text-sm">
                                                        <thead>
                                                            <tr>
                                                                <th className="border px-3 py-2">Medicine</th>
                                                                <th className="border px-3 py-2">Days</th>
                                                                <th className="border px-3 py-2">Time</th>
                                                                <th className="border px-3 py-2">Food</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {item.prescriptionItems.map((prescription, idx) => (
                                                                <tr key={idx}>
                                                                    <td className="border px-3 py-2">{prescription.name}</td>
                                                                    <td className="border px-3 py-2">{prescription.days}</td>
                                                                    <td className="border px-3 py-2">{prescription.time}</td>
                                                                    <td className="border px-3 py-2">{prescription.food}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    {item.nextAppointmentDate && (
                                                        <p className="text-sm text-slate-600">
                                                            <span className="font-medium">Next appointment:</span> {item.nextAppointmentDate}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-600">Prescription has not been added yet.</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Review / Rate */}
                                <div className="flex flex-col gap-2 mt-2">
                                    {item.isCompleted && !item.reviewed && (
                                        reviewState.appointmentId !== item._id ? (
                                            <button
                                                onClick={() => openReview(item)}
                                                className="bg-yellow-400 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
                                            >
                                                Rate Doctor
                                            </button>
                                        ) : (
                                            <div className="p-3 rounded-lg border bg-yellow-50">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <button key={s} onClick={() => setReviewState(prev => ({ ...prev, rating: s }))} className={`text-2xl ${reviewState.rating >= s ? 'text-yellow-500' : 'text-gray-300'}`}>
                                                            ★
                                                        </button>
                                                    ))}
                                                </div>
                                                <textarea value={reviewState.comment} onChange={(e) => setReviewState(prev => ({ ...prev, comment: e.target.value }))} className="w-full p-2 rounded mb-2" placeholder="Write a short review (optional)" />
                                                <div className="flex gap-2">
                                                    <button onClick={submitReview} className="bg-primary text-white px-4 py-2 rounded">Submit</button>
                                                    <button onClick={() => setReviewState({ appointmentId: null, rating: 0, comment: '' })} className="border px-4 py-2 rounded">Cancel</button>
                                                </div>
                                            </div>
                                        )
                                    )}
                                    {item.isCompleted && item.reviewed && (
                                        <span className="text-sm text-gray-500">You reviewed this appointment</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

            </div>

        </div>
    )
}

export default MyAppointments