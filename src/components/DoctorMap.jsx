import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png'
})

const DoctorMap = ({ docInfo }) => {
    const [position, setPosition] = useState([51.505, -0.09]) // Default position (London)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Try to geocode the address
        const geocodeAddress = async () => {
            try {
                if (docInfo.address) {
                    const fullAddress = `${docInfo.address.line1}${docInfo.address.line2 ? ', ' + docInfo.address.line2 : ''}`

                    // Using Nominatim API (OpenStreetMap) for free geocoding
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`
                    )
                    const data = await response.json()

                    if (data && data.length > 0) {
                        setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)])
                    }
                }
            } catch (error) {
                console.log('Geocoding error:', error)
                // Keep default position if geocoding fails
            } finally {
                setIsLoading(false)
            }
        }

        geocodeAddress()
    }, [docInfo])

    if (isLoading) {
        return (
            <div className='w-full h-full flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200'>
                <p className='text-gray-400'>Loading map...</p>
            </div>
        )
    }

    return (
        <div className='w-full h-full rounded-lg overflow-hidden border border-gray-200 shadow-sm'>
            <MapContainer
                center={position}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        <div className='text-center'>
                            <p className='font-semibold text-sm'>{docInfo.clinicName || docInfo.name}</p>
                            <p className='text-xs text-gray-600 mt-1'>
                                {docInfo.address?.line1}
                                {docInfo.address?.line2 && <><br />{docInfo.address?.line2}</>}
                            </p>
                            {docInfo.phone && <p className='text-xs text-primary font-medium mt-1'>{docInfo.phone}</p>}
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}

export default DoctorMap
