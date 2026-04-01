import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, MapPin, Calendar, Compass } from 'lucide-react';

const Header = () => {
    const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
    const location = useLocation();

    // Check if the current route matches the nav link
    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <header className="fixed top-0 left-0 w-full z-[1000] bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                
                {/* Left: Logo */}
                <div className="w-48">
                    <Link to="/" className="text-3xl font-extrabold text-teal-900 tracking-tight hover:text-teal-700 transition">CarePilot</Link>
                </div>

                {/* Center: Navigation Menu */}
                <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center h-full space-x-10">
                    <Link to="/" className={`flex items-center space-x-2 text-[15px] font-semibold transition-colors h-full border-b-[3px] ${isActive('/') ? 'text-red-600 border-red-600' : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'}`}>
                        <Home size={18} strokeWidth={1.5} />
                        <span>Home</span>
                    </Link>
                    <Link to="/bookings" className={`flex items-center space-x-2 text-[15px] font-semibold transition-colors h-full border-b-[3px] ${isActive('/bookings') ? 'text-red-600 border-red-600' : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'}`}>
                        <Calendar size={18} strokeWidth={1.5} />
                        <span>Bookings</span>
                    </Link>
                    <Link to="/explore" className={`flex items-center space-x-2 text-[15px] font-semibold transition-colors h-full border-b-[3px] ${isActive('/explore') ? 'text-red-600 border-red-600' : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'}`}>
                        <Compass size={18} strokeWidth={1.5} />
                        <span>Health Hub</span>
                    </Link>
                </nav>

                {/* Right: Action Buttons */}
                <div className="flex space-x-3 items-center justify-end w-auto lg:w-96">
                    <Link to="/map?type=pharmacy" className="hidden lg:flex px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 shadow-sm font-bold transition items-center text-sm border border-blue-200">
                        <span className="mr-1.5 text-lg">💊</span>Pharmacy
                    </Link>
                    <Link to="/map" className="px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 shadow-sm font-bold transition text-sm">
                        Find Care
                    </Link>
                    <button 
                        onClick={() => setIsEmergencyOpen(true)}
                        className="px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-md font-bold transition flex items-center animate-pulse hover:animate-none border border-red-500 text-sm"
                    >
                        <span className="mr-1.5">🚨</span>Emergency
                    </button>
                </div>
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
