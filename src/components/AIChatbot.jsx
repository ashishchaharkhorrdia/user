import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import aiLogo from '../assets/ai.png'

const defaultAssistantName = 'Chahar'
const defaultUserName = 'Friend'

const searchDoctors = (doctors, query) => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return []

    const exactMatches = doctors.filter((doc) => {
        const address = doc.address ? `${doc.address.line1 || ''} ${doc.address.line2 || ''}` : ''
        const phone = doc.phone || ''
        const clinicName = doc.clinicName || ''
        const testsText = (doc.tests || []).map((test) => `${test.name || ''} ${test.description || ''} ${test.price || ''}`).join(' ')
        const typeLabel = doc.type === 'lab' ? 'lab laboratory blood test urine test scan diagnostics pathology' : 'doctor specialist consultation physician'
        const text = `${doc.name} ${doc.speciality || ''} ${doc.degree || ''} ${doc.type || ''} ${typeLabel} ${address} ${phone} ${clinicName} ${doc.about || ''} ${testsText}`.toLowerCase()
        return text.includes(normalized)
    })

    const sorted = exactMatches.sort((a, b) => {
        if (normalized.includes('cheap') || normalized.includes('low cost') || normalized.includes('budget')) {
            return (a.fees || 0) - (b.fees || 0)
        }
        if (normalized.includes('best') || normalized.includes('top')) {
            return (b.rating || 0) - (a.rating || 0)
        }
        return 0
    })

    return sorted
}

const parseNavigationCommand = (query) => {
    const lower = query.toLowerCase()

    if (lower.includes('home')) return { path: '/', label: 'Home page' }
    if (lower.includes('doctors') || lower.includes('doctor list') || lower.includes('all doctors') || lower.includes('speciality') || lower.includes('specialties') || lower.includes('specializations')) return { path: '/doctors', label: 'Doctors page' }
    if (lower.includes('my appointments') || lower.includes('appointments')) return { path: '/my-appointments', label: 'My Appointments page' }
    if (lower.includes('my profile') || lower.includes('profile')) return { path: '/my-profile', label: 'My Profile page' }
    if (lower.includes('about')) return { path: '/about', label: 'About page' }
    if (lower.includes('contact')) return { path: '/contact', label: 'Contact page' }
    if (lower.includes('login')) return { path: '/login', label: 'Login page' }
    if (lower.includes('verify')) return { path: '/verify', label: 'Verify page' }

    return null
}

const isPrescriptionQuery = (query) => {
    const lower = query.toLowerCase()
    return /prescription|prescribe|medicine|medication|pill|tablet|insulin|dose|doses?/.test(lower)
}

const AIChatbot = () => {
    const navigate = useNavigate()
    const { doctors, currencySymbol, backendUrl } = useContext(AppContext)
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [assistantConfig, setAssistantConfig] = useState({ assistantName: defaultAssistantName, userName: defaultUserName })
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            text: `Hi ${defaultUserName}! I am ${defaultAssistantName}. Ask me about doctors, labs, test packages, fees, or locations and I’ll find the best match for your appointment.`
        }
    ])
    const [results, setResults] = useState([])
    const [status, setStatus] = useState('ready')
    const [searchPerformed, setSearchPerformed] = useState(false)
    const chatEndRef = useRef(null)

    useEffect(() => {
        if (open && chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, results, open])

    useEffect(() => {
        if (!backendUrl) return

        const fetchAssistantConfig = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/ai/config`)
                if (!response.ok) return
                const data = await response.json()
                setAssistantConfig({
                    assistantName: data.assistantName || defaultAssistantName,
                    userName: data.userName || defaultUserName
                })
            } catch (error) {
                console.error('Failed to load AI assistant config:', error)
            }
        }

        fetchAssistantConfig()
    }, [backendUrl])

    const handleSearch = async (event) => {
        event.preventDefault()
        const trimmed = query.trim()
        if (!trimmed) return

        setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
        setQuery('')
        setStatus('searching')

        const navCommand = parseNavigationCommand(trimmed)
        const bookingIntent = /book( an)? appointment with|appointment with|book with|see doctor|find doctor/.test(trimmed.toLowerCase())
        const prescriptionRequest = isPrescriptionQuery(trimmed)

        if (prescriptionRequest) {
            setSearchPerformed(false)
            setResults([])
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    text: `I can help you find doctors or book appointments, but I can't provide prescriptions. Please consult a doctor directly for prescriptions.`
                }
            ])
            setStatus('ready')
            return
        }

        if (navCommand && !bookingIntent) {
            setSearchPerformed(false)
            setResults([])
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    text: `Sure, taking you to the ${navCommand.label}.`
                }
            ])
            setStatus('ready')
            navigate(navCommand.path)
            setOpen(false)
            return
        }

        const matches = searchDoctors(doctors, trimmed)
        setSearchPerformed(true)

        if (bookingIntent && matches.length === 1) {
            setTimeout(() => {
                setResults([])
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'assistant',
                        text: `I found one doctor for you. Redirecting to the appointment page for ${matches[0].name}.`
                    }
                ])
                setStatus('ready')
                navigate(`/appointment/${matches[0]._id}`)
                setOpen(false)
            }, 250)
            return
        }

        setTimeout(() => {
            setResults(matches)
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    text: matches.length > 0
                        ? `I found ${matches.length} match${matches.length > 1 ? 'es' : ''} for your query. Tap a card below to view details or book.`
                        : `I couldn't find a match for "${trimmed}". Try another speciality, doctor name, lab name, test, address, phone, or fee preference.`
                }
            ])
            setStatus('ready')
        }, 250)
    }

    const handleDoctorClick = (docId) => {
        navigate(`/appointment/${docId}`)
        setOpen(false)
    }

    return (
        <div className='fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3'>
            {open && (
                <div className='w-[95vw] max-w-[420px] rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-400/10 overflow-hidden'>
                    <div className='relative overflow-hidden bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-4 text-white'>
                        <div className='absolute inset-0 opacity-20 bg-[url("/hdcircle.png")] bg-cover bg-center' />
                        <div className='relative flex items-center gap-4'>
                            <img src={aiLogo} alt='Chahar' className='h-24 w-24 rounded-full object-cover ring-2 ring-white/30 animate-pulse' />
                            <div>
                                <p className='text-sm opacity-90'>AI Assistant</p>
                                <h3 className='text-lg font-semibold'>{assistantConfig.assistantName}</h3>
                            </div>
                        </div>
                        <button
                            type='button'
                            onClick={() => setOpen(false)}
                            className='absolute right-4 top-4 rounded-full bg-white/10 px-2.5 py-1.5 text-sm font-bold text-white transition hover:bg-white/20'
                        >
                            ×
                        </button>
                        <p className='mt-3 text-xs text-slate-100/90'>Ask about doctors, specialisation, consultation fees, or availability and I’ll show the best matches.</p>
                    </div>

                    <div className='max-h-[420px] overflow-y-auto px-4 py-3 space-y-3 bg-slate-50'>
                        {messages.map((message, index) => (
                            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${message.role === 'user' ? 'bg-sky-600 text-white' : 'bg-white text-slate-900 shadow-sm'}`}>
                                    {message.text}
                                </div>
                            </div>
                        ))}

                        {status === 'searching' && (
                            <div className='rounded-2xl bg-white px-4 py-3 text-sm shadow-sm'>Searching our doctor list…</div>
                        )}

                        {results.length > 0 && (
                            <div className='space-y-3 pt-2'>
                                <div className='text-xs uppercase tracking-[0.2em] text-slate-500'>Search results</div>
                                {results.slice(0, 5).map((doc) => (
                                    <button
                                        key={doc._id}
                                        type='button'
                                        onClick={() => handleDoctorClick(doc._id)}
                                        className='w-full rounded-3xl border border-slate-200 bg-white p-3 text-left transition duration-200 hover:border-sky-400 hover:bg-sky-50'
                                    >
                                        <div className='flex items-center gap-3'>
                                            <img src={doc.image} alt={doc.name} className='h-14 w-14 rounded-2xl object-cover' />
                                            <div className='min-w-0'>
                                                <p className='text-sm font-semibold text-slate-900'>{doc.name}</p>
                                                <p className='text-[11px] text-slate-500'>{doc.type === 'lab' ? 'Lab Provider' : doc.speciality}</p>
                                                {doc.address?.line1 && (
                                                    <p className='mt-1 text-[11px] text-slate-600 line-clamp-1'>{doc.address.line1}{doc.address.line2 ? `, ${doc.address.line2}` : ''}</p>
                                                )}
                                                {doc.phone && (
                                                    <p className='text-[11px] text-slate-600'>Phone: {doc.phone}</p>
                                                )}
                                                <p className='mt-1 text-[11px] text-slate-600'>
                                                    {doc.type === 'lab'
                                                        ? `${doc.tests?.length || 0} tests available · ${currencySymbol}${doc.fees}`
                                                        : `${currencySymbol}${doc.fees} consultation`}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {results.length === 0 && status === 'ready' && messages.length > 1 && searchPerformed && (
                            <div className='rounded-3xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500'>No matching doctors or labs yet. Try searching by speciality, lab name, test name, address, phone, or fee.</div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <form onSubmit={handleSearch} className='border-t border-slate-200 bg-white px-4 py-3'>
                        <div className='flex gap-2'>
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder='Search doctors or labs by name, test, speciality, address, phone, or fee'
                                className='w-full rounded-3xl border border-slate-300 bg-slate-50 py-3 px-4 text-sm outline-none transition focus:border-sky-400 focus:bg-white'
                            />
                            <button type='submit' className='rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700'>Ask</button>
                        </div>
                    </form>
                </div>
            )}

            <button
                onClick={() => setOpen((prev) => !prev)}
                className='inline-flex h-24 w-24 items-center justify-center rounded-full bg-transparent p-0 text-white shadow-2xl shadow-slate-950/20 transition hover:bg-white/10'
                aria-label={open ? 'Close AI chat' : 'Open AI chat'}
            >
                <img src={aiLogo} alt='AI chat' className='h-20 w-20 rounded-full object-cover animate-bounce' />
            </button>
        </div>
    )
}

export default AIChatbot
