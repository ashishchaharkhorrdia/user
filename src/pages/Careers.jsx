import React, { useState, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const Careers = () => {
    const { backendUrl } = useContext(AppContext)
    const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'doctor', speciality: '', qualifications: '', resumeLink: '', message: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setIsSubmitting(true)
            const { data } = await axios.post(backendUrl + '/api/job/apply', form)
            if (data.success) {
                toast.success('Application submitted')
                setForm({ name: '', email: '', phone: '', role: 'doctor', speciality: '', qualifications: '', resumeLink: '', message: '' })
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className='max-w-3xl mx-auto py-12'>
            <h2 className='text-2xl font-semibold mb-4'>Careers / Apply</h2>
            <p className='mb-6 text-gray-600'>If you're a doctor or lab interested in joining, please submit your details below and the admin will review.</p>

            <form onSubmit={handleSubmit} className='space-y-4 bg-white p-6 rounded shadow'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <input required name='name' value={form.name} onChange={handleChange} placeholder='Full name' className='p-3 border rounded' />
                    <input required name='email' value={form.email} onChange={handleChange} placeholder='Email' className='p-3 border rounded' />
                    <input name='phone' value={form.phone} onChange={handleChange} placeholder='Phone' className='p-3 border rounded' />
                    <select name='role' value={form.role} onChange={handleChange} className='p-3 border rounded'>
                        <option value='doctor'>Doctor</option>
                        <option value='lab'>Lab</option>
                        <option value='other'>Other</option>
                    </select>
                </div>

                <input name='speciality' value={form.speciality} onChange={handleChange} placeholder='Speciality (if applicable)' className='p-3 border rounded w-full' />
                <input name='qualifications' value={form.qualifications} onChange={handleChange} placeholder='Qualifications' className='p-3 border rounded w-full' />
                <input name='resumeLink' value={form.resumeLink} onChange={handleChange} placeholder='Resume link (optional)' className='p-3 border rounded w-full' />
                <textarea name='message' value={form.message} onChange={handleChange} placeholder='Additional information' className='p-3 border rounded w-full' rows={4} />

                <div className='flex justify-end'>
                    <button type='submit' disabled={isSubmitting} className='bg-primary text-white px-6 py-2 rounded'>{isSubmitting ? 'Submitting...' : 'Submit Application'}</button>
                </div>
            </form>
        </div>
    )
}

export default Careers
