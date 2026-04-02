import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { APIProvider } from '@vis.gl/react-google-maps';
import Header from './components/Header';
import TriageSession from './components/TriageSession';
import Bookings from './components/Bookings';
import Explore from './components/Explore';
import CareMap from './components/CareMap';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyPlaceholderForDemoPurposesOnly';

function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col relative font-['Outfit']">
        {/* Decorative gradient background layer */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-slate-200 to-transparent pointer-events-none -z-10"></div>
        
        {/* Header section with navigation */}
        <Header />

        {/* Main content area */}
        <main className="flex-grow w-full flex flex-col pt-20">
          <Routes>
            <Route path="/" element={
              <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 px-4 w-full flex-grow">
                {/* Personalized Hero Greeting */}
                <div className="mb-8 p-8 bg-white/60 backdrop-blur-lg border border-white/40 rounded-3xl shadow-sm text-center md:text-left flex flex-col md:flex-row items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">How are you feeling today?</h1>
                    <p className="text-slate-500 mt-2 font-medium text-lg">We are here to help you find the right care.</p>
                  </div>
                </div>

                <TriageSession />
              </div>
            } />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/map" element={
              <div className="w-full min-h-screen flex-grow flex flex-col py-8">
                 <CareMap fullScreen={true} />
              </div>
            } />
          </Routes>
        </main>

      {/* Footer section (hidden on map route for full immersion) */}
      <Routes>
        <Route path="/" element={
          <footer className="bg-white border-t border-slate-200 mt-auto shrink-0 z-50">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <p className="text-center text-base font-semibold text-slate-600">
                &copy; {new Date().getFullYear()} CarePilot Humanitarian Initiative. All rights reserved.
              </p>
              <p className="text-center text-sm text-slate-500 mt-2 font-medium">
                Data sourced from Kenya Master Health Facility List (KMHFL). A project for universal health accessibility.
              </p>
            </div>
          </footer>
        } />
      </Routes>
      </div>
    </Router>
    </APIProvider>
  );
}

export default App;
