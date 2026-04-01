import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Map, AdvancedMarker, InfoWindow, useMap, Pin } from '@vis.gl/react-google-maps';
import { fetchNairobiFacilities } from '../api/kmhfl';
import { fallbackFacilities } from '../data/facilities';

// Professional Medical Theme for Google Maps
const medicalMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#f8fafc" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f8fafc" }] },
  { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#cbd5e1" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#f1f5f9" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { featureType: "poi.medical", elementType: "geometry", stylers: [{ color: "#e0f2fe" }] },
  { featureType: "poi.medical", elementType: "labels.text.fill", stylers: [{ color: "#0ea5e9" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#e2e8f0" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#64748b" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#cbd5e1" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] }
];

// Rough bounding box for Nairobi County
const NAIROBI_BOUNDS = {
  north: -1.155,
  south: -1.442,
  west: 36.655,
  east: 37.105,
};

const CareMap = ({ urgencyLevel, userLocation: fallbackLocation, fullScreen = false }) => {
  const map = useMap('DEMO_MAP_ID');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialFilter = queryParams.get('type') === 'pharmacy' ? 'Pharmacy' : 'All';

  const [filterType, setFilterType] = useState(initialFilter);
  const [userLocation, setUserLocation] = useState(fallbackLocation || { latitude: -1.2921, longitude: 36.8219 });
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);

  // Fetch real facilities via KMHFL API with local backup
  useEffect(() => {
    let mounted = true;
    fetchNairobiFacilities(userLocation.latitude, userLocation.longitude, filterType).then(data => {
      if (mounted) {
        // Enforce the 30-item minimum threshold requested
        if (data.length < 30) {
          console.warn(`Only ${data.length} facilities fetched. Padding Map with top 50 local fallbacks.`);
          // Combine remote data with local list, deduplicating IDs roughly
          const localDataToAppend = fallbackFacilities.filter(fb => !data.some(d => d.id === fb.id));
          setFacilities([...data, ...localDataToAppend]);
        } else {
          setFacilities(data);
        }
      }
    });
    return () => { mounted = false; };
  }, [userLocation.latitude, userLocation.longitude, filterType]);

  // Live Position Guidance
  useEffect(() => {
    let watchId;
    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
    }
    return () => {
      if (watchId !== undefined && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // Filter logic based on urgency
  const filteredFacilities = useMemo(() => {
    if (!facilities) return [];

    const isHighUrgency = urgencyLevel?.toLowerCase() === 'high';

    // In fullScreen mode we don't care about urgencyLevel, we want general density.
    // kmhfl.js already sorts by distance if we pass userLocation.
    const eligibleFacilities = facilities.filter(facility => {
      // 1. If Pharmacy Filter is Active, explicitly require Pharmacy type
      if (filterType === 'Pharmacy') {
        return facility.type === 'Pharmacy';
      }

      // 2. Otherwise apply Urgency constraints (if not full screen)
      if (!fullScreen && isHighUrgency) {
        return facility.type === 'Hospital' && facility.isEmergencyReady;
      } else {
        return true;
      }
    });

    // Take top 20 nearest facilities to optimize rendering density
    return eligibleFacilities.slice(0, 20);
  }, [facilities, urgencyLevel, fullScreen, filterType]);

  const mapCenter = { lat: userLocation.latitude, lng: userLocation.longitude };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col py-6 px-4">
      {/* Map Header */}
      {!fullScreen && (
        <div className="bg-slate-50 border border-slate-200 text-slate-800 p-5 rounded-t-3xl shadow-sm">
          <h3 className="text-xl font-bold flex items-center text-teal-800">
            <svg className="w-6 h-6 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {urgencyLevel?.toLowerCase() === 'high' ? 'Nearby Emergency Centers' : 'Nearby Validated Facilities'}
          </h3>
          <p className="text-slate-500 text-sm mt-1 font-medium">Verified by Kenya Master Health Facility List (KMHFL).</p>
        </div>
      )}

      {/* Map Container */}
      <div className={`w-full relative bg-slate-100 flex flex-col ${fullScreen ? 'h-[calc(100vh-80px)] rounded-3xl' : 'h-[500px] rounded-b-3xl'} border border-slate-200 shadow-lg overflow-hidden`}>
        <Map
          mapId="DEMO_MAP_ID"
          defaultCenter={mapCenter}
          center={mapCenter} // this binds the map to center on the blue dot when geolocation resolves
          defaultZoom={13}
          mapTypeId={'hybrid'}
          gestureHandling={'greedy'} // Enables free scrolling/panning without cooperative gestures
          disableDefaultUI={false}
          styles={medicalMapStyle}
          zoomControl={true}
          restriction={{
            latLngBounds: NAIROBI_BOUNDS,
            strictBounds: true,
          }}
        >
          {/* Pharmacy Filter UI Overlay */}
          {fullScreen && (
            <div className="absolute top-4 left-4 z-50 flex gap-2">
              <button
                onClick={() => setFilterType(filterType === 'Pharmacy' ? 'All' : 'Pharmacy')}
                className={`px-4 py-2 rounded-full shadow-lg font-bold text-sm transition-all flex items-center ${filterType === 'Pharmacy' ? 'bg-blue-600 text-white border-2 border-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'}`}
              >
                <span className="mr-2 text-lg">💊</span>
                {filterType === 'Pharmacy' ? 'Pharmacies Only' : 'Find Pharmacy'}
              </button>
            </div>
          )}

          {/* User Location Marker - Blue Pulsing */}
          {userLocation && (
            <AdvancedMarker position={mapCenter} zIndex={50}>
              <div className="cursor-pointer relative flex flex-col items-center justify-center w-12 h-12" title="You are here">
                <div className="absolute w-8 h-8 bg-blue-500 rounded-full animate-ping opacity-70"></div>
                <div className="relative w-5 h-5 bg-blue-600 border-[3px] border-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>
                <span className="absolute top-full mt-1 bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">You are here</span>
              </div>
            </AdvancedMarker>
          )}

          {/* Facility Markers */}
          {filteredFacilities.map(f => {
            const position = { lat: f.coordinates.latitude, lng: f.coordinates.longitude };
            // ensure we have valid coordinates
            if (isNaN(position.lat) || isNaN(position.lng)) return null;

            return (
              <AdvancedMarker
                key={f.id}
                position={position}
                onClick={() => setSelectedFacility(f)}
                title={f.name}
              >
                <Pin 
                  background={f.type === 'Hospital' ? '#ef4444' : f.type === 'Pharmacy' ? '#3b82f6' : '#9ca3af'}
                  borderColor={'#ffffff'}
                  glyphColor={'#ffffff'}
                  glyph={f.type === 'Hospital' ? 'H' : f.type === 'Pharmacy' ? 'P' : 'C'}
                />
              </AdvancedMarker>
            );
          })}

          {/* Interactive InfoWindow */}
          {selectedFacility && (
            <InfoWindow
              position={{ lat: selectedFacility.coordinates.latitude, lng: selectedFacility.coordinates.longitude }}
              onCloseClick={() => setSelectedFacility(null)}
              pixelOffset={[0, -40]}
            >
              <div className="p-3 max-w-[280px] font-['Outfit'] text-slate-800">
                <h4 className="font-extrabold text-slate-900 text-lg mb-1 leading-tight">{selectedFacility.name}</h4>
                <p className="text-sm text-slate-600 mb-3">{selectedFacility.address}</p>

                <div className="flex flex-col gap-2">
                  <div className="inline-flex items-center px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-bold text-slate-700 border border-slate-200 shadow-sm">
                    <span className="mr-1.5">🏷️</span> {selectedFacility.kephLevel || 'KMHFL Verified'}
                  </div>

                  <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm ${selectedFacility.isEmergencyReady
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-teal-50 text-teal-700 border border-teal-200'
                    }`}>
                    <span className="mr-1.5">{selectedFacility.isEmergencyReady ? '🚨' : '✅'}</span>
                    {selectedFacility.isEmergencyReady ? 'Emergency Ready' : 'Standard Care Facility'}
                  </div>

                  {/* Pharmacy Call Action Placeholder */}
                  {selectedFacility.type === 'Pharmacy' && (
                    <button
                      onClick={() => alert(`Initiating secure call to ${selectedFacility.name} at +254 700 000 000...`)}
                      className="mt-2 w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow transition flex items-center justify-center"
                    >
                      <span className="mr-2">📞</span> Call Pharmacy
                    </button>
                  )}
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>

      {/* Facility Cards Grid */}
      <div className="mt-8">
        <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Nearby Health Centers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFacilities.map((facility) => (
            <div key={facility.id} className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="text-4xl font-extrabold text-slate-700">
                    {facility.type === 'Hospital' ? 'H' : facility.type === 'Pharmacy' ? 'P' : 'C'}
                  </div>
                  {typeof facility.distance === 'number' && !isNaN(facility.distance) && (
                    <div className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200">
                      {Number(facility.distance).toFixed(1)} km
                    </div>
                  )}
                </div>

                <h3 className="font-extrabold text-slate-900 text-lg leading-tight mb-2">{facility.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{facility.address}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center px-2.5 py-1 bg-slate-50 rounded-lg text-xs font-bold text-slate-700 border border-slate-200">
                    🏷️ {facility.kephLevel || 'Verified'}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${facility.isEmergencyReady ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-teal-50 text-teal-700 border border-teal-200'
                    }`}>
                    {facility.isEmergencyReady ? '🚨 Emergency' : '✅ Standard Care'}
                  </span>
                  {facility.type === 'Pharmacy' && (
                    <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-200">
                      💊 Pharmacy On-site
                    </span>
                  )}
                </div>
              </div>

              {facility.type === 'Pharmacy' ? (
                <button
                  onClick={() => alert(`Initiating secure call to ${facility.name} at +254 700 000 000...`)}
                  className="w-full mt-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition flex items-center justify-center text-sm"
                >
                  <span className="mr-2">📞</span> Call Pharmacy
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedFacility(facility);
                    if (map) {
                      map.panTo({ lat: facility.coordinates.latitude, lng: facility.coordinates.longitude });
                      map.setZoom(15);
                    }
                  }}
                  className="w-full mt-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl shadow-sm transition flex items-center justify-center text-sm border border-slate-200"
                >
                  View on Map
                </button>
              )}
            </div>
          ))}

          {filteredFacilities.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 font-medium">
              No verified facilities found matching your criteria nearby.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareMap;
