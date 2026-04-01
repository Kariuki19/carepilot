import React from 'react';

const Bookings = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 px-4 w-full flex-grow">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Bookings</h1>
      <div className="border border-white/40 rounded-3xl h-64 flex flex-col items-center justify-center text-center p-8 bg-white/70 backdrop-blur-md shadow-lg transition-all">
        <h2 className="text-2xl font-extrabold text-slate-700 mb-2">My Appointments</h2>
        <p className="text-sm text-slate-500 font-medium">
          Your scheduled clinical follow-ups and history will appear here.
        </p>
      </div>
    </div>
  );
};

export default Bookings;
