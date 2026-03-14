import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { APIProvider } from '@vis.gl/react-google-maps';
import Header from './components/Header';
import TriageSession from './components/TriageSession';
import HealthFeed from './components/HealthFeed';
import CareMap from './components/CareMap';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyPlaceholderForDemoPurposesOnly';

function App() {
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col relative font-['Outfit']">
        {/* Decorative gradient background layer */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-slate-200 to-transparent pointer-events-none -z-10"></div>
        
        {/* Header section with navigation */}
        <Header />

        {/* Main content area */}
        <main className="flex-grow w-full flex flex-col">
          <Routes>
            <Route path="/" element={
              <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 px-4 w-full flex-grow">
                <TriageSession />
                
                <HealthFeed />

                <div className="mt-4 border-4 border-dashed border-gray-300 rounded-xl h-48 flex flex-col items-center justify-center text-center p-8 bg-white shadow-sm opacity-60">
                  <h2 className="text-2xl font-extrabold text-slate-500 mb-2">My Appointments</h2>
                  <p className="text-sm text-slate-500">
                    Your scheduled clinical follow-ups and history will appear here.
                  </p>
                </div>
              </div>
            } />
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
          <footer className="bg-white border-t-2 border-gray-300 mt-auto shrink-0">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <p className="text-center text-base font-semibold text-gray-600">
                &copy; {new Date().getFullYear()} CarePilot Humanitarian Initiative. All rights reserved.
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
