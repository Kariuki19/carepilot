const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Cache configuration
let kmhflCache = null;
let lastCacheTime = null;
const CACHE_DURATION_MS = 1000 * 60 * 60 * 12; // 12 hours cache

app.get('/api/facilities', async (req, res) => {
    try {
        const queryType = req.query.type;
        
        // 1. Check Cache
        if (kmhflCache && lastCacheTime && (Date.now() - lastCacheTime < CACHE_DURATION_MS)) {
            console.log("Serving KMHFL data from lightning-fast in-memory cache!");
            
            let dataToSend = kmhflCache;
            if (queryType === 'pharmacy') {
                dataToSend = kmhflCache.filter(f => {
                    const t = (f.facility_type_name || f.facility_type_category || '').toLowerCase();
                    return t.includes('pharmacy') || t.includes('chemist');
                });
            }
            
            return res.json({ results: dataToSend });
        }

        // 2. Fetch fresh data from public endpoints
        console.log("Cache miss or expired. Fetching fresh KMHFL data from government endpoints...");
        const response = await axios.get('https://api.kmhfr.health.go.ke/api/facilities/facilities/?county=Nairobi&active=true&format=json&page_size=100', {
            timeout: 15000 // 15s timeout
        });

        const data = response.data;
        
        if (!data.results || !Array.isArray(data.results)) {
            return res.status(500).json({ error: "Invalid data format from KMHFL API" });
        }

        // 3. Pre-Process lat/long mapping so frontend doesn't have to
        const processedFacilities = data.results
            .filter(facility => facility.lat && facility.long) // guarantee exact data exists
            .map(facility => ({
                id: facility.id,
                name: facility.name,
                lat: parseFloat(facility.lat), // Extracted rigorously
                long: parseFloat(facility.long), 
                ward_name: facility.ward_name,
                facility_type_name: facility.facility_type_name,
                facility_type_category: facility.facility_type_category,
                keph_level_name: facility.keph_level_name
            }))
            .filter(f => !isNaN(f.lat) && !isNaN(f.long)); // Sanity check

        // 4. Save to Cache (always save full dataset)
        kmhflCache = processedFacilities;
        lastCacheTime = Date.now();

        // 5. Apply any requested filters before sending to user
        let dataToSend = processedFacilities;
        if (queryType === 'pharmacy') {
            dataToSend = processedFacilities.filter(f => {
                const t = (f.facility_type_name || f.facility_type_category || '').toLowerCase();
                return t.includes('pharmacy') || t.includes('chemist') || t.includes('clinic');
            });

            // Fallback Safety Net: Ensure at least 10 results
            if (dataToSend.length < 10) {
                 console.log("Pharmacy density too low from remote. Paddding with general active facilities...");
                 const generalFacilities = processedFacilities.filter(f => !dataToSend.some(d => d.id === f.id));
                 dataToSend = [...dataToSend, ...generalFacilities.slice(0, 10 - dataToSend.length)];
            }
        }

        // 6. Send to user
        res.json({ results: dataToSend });

    } catch (error) {
        console.error("Error fetching KMHFL data:", error.message);
        res.status(500).json({ error: "Failed to fetch facility data" });
    }
});

app.listen(PORT, () => {
    console.log(`CarePilot Backend is running on http://localhost:${PORT}`);
});
