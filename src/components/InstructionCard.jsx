import React, { useRef, useState, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import { fetchNairobiFacilities } from '../api/kmhfl';

const GEOCODING_API_KEY = import.meta.env.VITE_GEOCODING_API_KEY || import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Haversine formula to calculate distance
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
};

const InstructionCard = ({ advice, urgencyLevel }) => {
    const cardRef = useRef(null);
    const [destinationAddress, setDestinationAddress] = useState("Locating nearest facility...");
    const [destinationName, setDestinationName] = useState("");

    useEffect(() => {
        let mounted = true;

        const locateAndGeocode = async () => {
            try {
                // 1. Get User Location
                const position = await new Promise((resolve, reject) => {
                    if (!navigator.geolocation) reject(new Error("Geolocation not supported"));
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;

                // 2. Fetch Facilities
                const facilities = await fetchNairobiFacilities(userLat, userLon);
                if (!facilities || facilities.length === 0) throw new Error("No facilities found");

                // 3. Filter by urgency and find closest
                const isHighUrgency = urgencyLevel?.toLowerCase() === 'high';
                const suitableFacilities = facilities.filter(f => 
                  isHighUrgency ? (f.type === 'Hospital' && f.isEmergencyReady) : true
                );

                if (suitableFacilities.length === 0) throw new Error("No suitable facilities found");

                let closest = suitableFacilities[0];
                let minDistance = Infinity;

                for (const facility of suitableFacilities) {
                    const dist = getDistance(userLat, userLon, facility.coordinates.latitude, facility.coordinates.longitude);
                    if (dist < minDistance) {
                        minDistance = dist;
                        closest = facility;
                    }
                }

                if (!mounted) return;
                setDestinationName(closest.name);

                // 4. Reverse Geocode the closest facility's coordinates to get physical street address
                const geoRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${closest.coordinates.latitude},${closest.coordinates.longitude}&key=${GEOCODING_API_KEY}`);
                const geoData = await geoRes.json();

                if (geoData.status === "OK" && geoData.results.length > 0) {
                    // Usually the first result is the most specific physical street address
                    const physicalAddress = geoData.results[0].formatted_address;
                    if (mounted) setDestinationAddress(physicalAddress);
                } else {
                    if (mounted) setDestinationAddress(closest.address || "Address unavailable");
                }
            } catch (err) {
                console.error("Geocoding/Locating Error:", err);
                if (mounted) setDestinationAddress("Unable to determine physical address automatically.");
            }
        };

        locateAndGeocode();

        return () => { mounted = false; };
    }, [urgencyLevel]);


    // Map urgency levels to colors and icons
    const urgencyConfig = {
        high: { color: 'bg-red-100 border-red-600 text-red-900', icon: '🚑', label: 'High Urgency (Emergency)' },
        medium: { color: 'bg-yellow-100 border-yellow-500 text-yellow-900', icon: '💊', label: 'Medium Urgency (Consult Doctor)' },
        low: { color: 'bg-green-100 border-green-500 text-green-900', icon: '🏠', label: 'Low Urgency (Rest & Monitor)' },
    };

    const config = urgencyConfig[urgencyLevel?.toLowerCase()] || urgencyConfig.low;

    const handleDownload = async () => {
        if (!cardRef.current) return;
        try {
            const dataUrl = await htmlToImage.toPng(cardRef.current, { quality: 1.0 });
            const link = document.createElement('a');
            link.download = `triage-instruction-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to generate image', err);
            alert('Could not download the card. Please take a screenshot instead.');
        }
    };

    return (
        <div className="mt-8 mb-4">
            {/* The Printable/Downloadable Card Area */}
            <div
                ref={cardRef}
                className={`p-8 rounded-2xl border-4 ${config.color} shadow-lg max-w-sm mx-auto bg-white`}
            >
                <div className="text-center mb-6">
                    <span className="text-6xl block mb-4" role="img" aria-label={config.label}>
                        {config.icon}
                    </span>
                    <h3 className="text-2xl font-extrabold pb-2 border-b-2 border-current">
                        {config.label}
                    </h3>
                </div>
                <div className="mb-6">
                    <h4 className="text-lg font-bold mb-2 uppercase tracking-wide opacity-80">Advice:</h4>
                    <p className="text-xl font-medium leading-relaxed bg-white/50 p-4 rounded-lg shadow-inner">
                        {advice}
                    </p>
                </div>
                
                {destinationName && (
                  <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm text-left">
                      <h4 className="text-sm font-bold mb-1 uppercase tracking-wide text-slate-500">Nearest Recommended Facility:</h4>
                      <p className="text-lg font-extrabold text-teal-900 leading-tight mb-1">{destinationName}</p>
                      <div className="flex items-start mt-2">
                        <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <p className="text-md font-medium text-slate-700 leading-snug">
                            {destinationAddress}
                        </p>
                      </div>
                  </div>
                )}
                <div className="text-center text-sm font-bold opacity-75 pt-4 border-t-2 border-current">
                    CarePilot Triage System
                </div>
            </div>

            {/* Action Button (Not included in download) */}
            <div className="text-center mt-6">
                <button
                    onClick={handleDownload}
                    className="px-8 py-4 bg-teal-900 hover:bg-teal-800 text-white font-bold text-xl rounded-xl shadow-md transition-colors focus:outline-none focus:ring-4 focus:ring-teal-500 flex items-center justify-center mx-auto"
                >
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Card
                </button>
            </div>
        </div>
    );
};

export default InstructionCard;
