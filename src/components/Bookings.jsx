import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Bookings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 px-4 w-full flex-grow">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Bookings</h1>
      <div className="border border-white/40 rounded-3xl h-64 flex flex-col items-center justify-center text-center p-8 bg-white/70 backdrop-blur-md shadow-lg transition-all">
        <h2 className="text-2xl font-extrabold text-slate-700 mb-2">My Appointments</h2>
        <p className="text-sm text-slate-500 font-medium mb-6">
          Your scheduled clinical follow-ups and history will appear here.
        </p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition-all"
        >
          Book a Consultation
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed w-full max-w-md bg-white rounded-3xl shadow-2xl z-[101] border border-slate-100 p-8 text-center"
              style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            >
              <h3 className="text-2xl font-extrabold text-slate-800 mb-4">Consult a Doctor</h3>
              <p className="text-slate-600 mb-6 font-medium">Connect with a certified medical professional via HealthX for a virtual consultation.</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full px-4 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition shadow-sm"
                >
                  Start Virtual Consult
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition border border-slate-200"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bookings;
