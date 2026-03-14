import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <Link to="/" className="text-3xl font-bold text-teal-900 hover:text-teal-700 transition">CarePilot</Link>
                <nav>
                    <ul className="flex space-x-4 md:space-x-6 text-slate-600 font-medium items-center">
                        <li>
                            <Link to="/map?type=pharmacy" className="hidden sm:flex px-5 py-2.5 bg-blue-100 text-blue-800 rounded-xl hover:bg-blue-200 shadow-sm font-bold transition items-center">
                                <span className="mr-2 text-xl">💊</span>Find Pharmacy
                            </Link>
                        </li>
                        <li>
                            <Link to="/map" className="px-5 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 shadow-sm font-bold transition">
                                Find Care
                            </Link>
                        </li>
                        <li>
                            <button 
                                onClick={() => setIsEmergencyOpen(true)}
                                className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-md font-bold transition flex items-center animate-pulse hover:animate-none border border-red-500"
                            >
                                <span className="mr-2">🚨</span>Emergency
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Emergency Contacts Drawer Modal */}
            <AnimatePresence>
                {isEmergencyOpen && (
                    <>
                        {/* Dimmer Background */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEmergencyOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
                        />
                        
                        {/* Modal Container */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden border border-slate-100"
                        >
                            <div className="bg-red-600 p-6 flex justify-between items-center text-white">
                                <h3 className="text-2xl font-extrabold flex items-center">
                                    <span className="text-3xl mr-3">🚨</span> Emergency Contacts
                                </h3>
                                <button 
                                    onClick={() => setIsEmergencyOpen(false)}
                                    className="text-white hover:text-red-200 bg-red-700/50 hover:bg-red-700 rounded-full w-10 h-10 flex items-center justify-center transition-colors font-bold text-xl"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className="p-6">
                                <p className="text-slate-600 font-medium mb-6">Nairobi rapid response directory. Tap any number to call immediately.</p>
                                
                                <div className="space-y-4">
                                    <a href="tel:1199" className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-all group">
                                        <div className="flex items-center">
                                            <span className="text-3xl mr-4">🚑</span>
                                            <div>
                                                <h4 className="font-extrabold text-lg text-slate-800 group-hover:text-red-700">Red Cross (Kenya)</h4>
                                                <p className="text-slate-500 font-semibold group-hover:text-red-600 uppercase text-xs tracking-wider">Medical Rescue</p>
                                            </div>
                                        </div>
                                        <div className="font-black text-xl text-slate-800 group-hover:text-red-700">1199</div>
                                    </a>

                                    <a href="tel:999" className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-all group">
                                        <div className="flex items-center">
                                            <span className="text-3xl mr-4">🚨</span>
                                            <div>
                                                <h4 className="font-extrabold text-lg text-slate-800 group-hover:text-red-700">Ambulance (St. John)</h4>
                                                <p className="text-slate-500 font-semibold group-hover:text-red-600 uppercase text-xs tracking-wider">Medical Rescue</p>
                                            </div>
                                        </div>
                                        <div className="font-black text-xl text-slate-800 group-hover:text-red-700">999</div>
                                    </a>

                                    <a href="tel:+254722178177" className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 hover:bg-teal-50 transition-all group">
                                        <div className="flex items-center">
                                            <span className="text-3xl mr-4">🧠</span>
                                            <div>
                                                <h4 className="font-extrabold text-lg text-slate-800 group-hover:text-teal-800">Mental Health Hotline</h4>
                                                <p className="text-slate-500 font-semibold group-hover:text-teal-700 uppercase text-xs tracking-wider">Befrienders Kenya</p>
                                            </div>
                                        </div>
                                        <div className="font-black text-lg text-slate-800 group-hover:text-teal-800">+254 722 178 177</div>
                                    </a>

                                    <a href="tel:0202222181" className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700 transition-all group">
                                        <div className="flex items-center">
                                            <span className="text-3xl mr-4">🚒</span>
                                            <div>
                                                <h4 className="font-extrabold text-lg text-slate-800 group-hover:text-orange-700">Nairobi Fire</h4>
                                                <p className="text-slate-500 font-semibold group-hover:text-orange-600 uppercase text-xs tracking-wider">Fire Dept</p>
                                            </div>
                                        </div>
                                        <div className="font-black text-lg text-slate-800 group-hover:text-orange-700">020 2222181</div>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
