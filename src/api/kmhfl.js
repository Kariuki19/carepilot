// Helper for fetching real-world data from Kenya Master Health Facility List (KMHFL)

// Haversine formula to calculate distance in kilometers
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
};

export const fetchNairobiFacilities = async (userLat, userLon, filterType) => {
  try {
    // API endpoint for KMHFR v2 facilities
    // Querying our blazing-fast local Node.js Server
    let url = 'http://localhost:5000/api/facilities';
    if (filterType === 'Pharmacy') {
        url += '?type=pharmacy';
    }
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Local Backend responded with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
        return [];
    }
    
    // Transform KMHFL data and filter within 5km radius if user coordinates are provided
    const facilities = data.results
      .map(facility => {
        // Data is pre-parsed correctly by the Node backend
        const lat = facility.lat;
        const lon = facility.long;
        
        let type = 'Clinic';
        const typeName = (facility.facility_type_name || facility.facility_type_category || '').toLowerCase();
        if (typeName.includes('hospital')) type = 'Hospital';
        else if (typeName.includes('medical') || typeName.includes('center') || typeName.includes('centre')) type = 'Medical Centre';
        else if (typeName.includes('pharmacy') || typeName.includes('chemist')) type = 'Pharmacy';

        let distance = null;
        if (userLat && userLon && !isNaN(lat) && !isNaN(lon)) {
            distance = getDistance(userLat, userLon, lat, lon);
        }

        return {
          id: facility.id,
          name: facility.name,
          coordinates: { latitude: lat, longitude: lon },
          type: type,
          address: facility.ward_name ? `${facility.ward_name}, Nairobi` : 'Nairobi',
          kephLevel: facility.keph_level_name || 'Level Unknown', // Extract actual KEPH level name
          isEmergencyReady: facility.keph_level_name && (facility.keph_level_name.includes('4') || facility.keph_level_name.includes('5') || facility.keph_level_name.includes('6')),
          distance: distance
        };
      })
      .filter(f => !isNaN(f.coordinates.latitude) && !isNaN(f.coordinates.longitude));

      // Filter by 5km radius and sort by distance
      if (userLat && userLon) {
          return facilities
            .filter(f => f.distance !== null && f.distance <= 5.0)
            .sort((a, b) => a.distance - b.distance);
      }

      return facilities;

  } catch (error) {
    console.error("Error fetching KMHFL data:", error);
    // Fallback data
    return [
        {
          id: 'fb1',
          name: "AAR Medical Centre - Fallback",
          type: "Medical Centre",
          coordinates: { latitude: -1.2833, longitude: 36.8167 },
          address: "CBD, Nairobi",
          isEmergencyReady: false,
          distance: 1.2
        },
        {
          id: 'fb2',
          name: "The Nairobi Hospital (Fallback)",
          type: "Hospital",
          coordinates: { latitude: -1.293, longitude: 36.804 },
          address: "Argwings Kodhek Rd, Nairobi",
          isEmergencyReady: true,
          distance: 2.5
        }
    ];
  }
};
