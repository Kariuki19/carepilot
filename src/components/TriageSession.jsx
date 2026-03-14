import React, { useState, useRef, useEffect } from 'react';
import { useGroqTriage } from '../hooks/useGroqTriage';
import InstructionCard from './InstructionCard';
import CareMap from './CareMap';
import { motion, AnimatePresence } from 'framer-motion';
import { emergencyContacts } from '../data/emergencyContacts';

const TriageSession = () => {
  const [inputText, setInputText] = useState('');
  
  const { messages, isLoading, error, triageConclusion, sendMessage, resetTriage } = useGroqTriage();
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, triageConclusion]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading || triageConclusion) return;
    
    const userText = inputText.trim();
    setInputText('');
    await sendMessage(userText);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md border border-white/20 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-8 max-w-4xl mx-auto my-12 relative overflow-hidden">
      {/* Subtle background glow effect for the card */}
      <div className="absolute top-0 left-1/4 w-1/2 h-24 bg-teal-400/10 blur-[50px] rounded-full pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-6 border-b border-gray-200">
        <div className="text-center sm:text-left">
           <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
             Emergency Triage
           </h2>
           <p className="text-slate-500 mt-1 font-medium">AI-Assisted Medical Guidance</p>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex flex-col">
          <div className="flex flex-col border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 shadow-inner min-h-[500px] h-[700px] max-h-[80vh]">
            
            {/* Top-Level Rescue Alert for High Urgency */}
            <AnimatePresence>
                {triageConclusion?.urgencyLevel === 'High' && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     className="bg-red-600 text-white p-4 shadow-md z-10 flex flex-col md:flex-row items-center justify-between"
                   >
                       <div className="flex items-center mb-3 md:mb-0">
                           <span className="text-3xl mr-3 animate-pulse">🚨</span>
                           <div>
                               <h3 className="font-extrabold text-lg">CRITICAL MEDICAL EMERGENCY DETECTED</h3>
                               <p className="text-red-100 text-sm font-medium">Dispatching to local emergency services is advised immediately.</p>
                           </div>
                       </div>
                       <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0" style={{ scrollbarWidth: 'none' }}>
                           {emergencyContacts.slice(0, 3).map(contact => (
                               <a 
                                 key={contact.name} 
                                 href={`tel:${contact.numbers[0]}`}
                                 className="flex items-center bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-colors border border-red-400/50 flex-shrink-0"
                               >
                                 <span className="mr-2">{contact.icon}</span> 
                                 Call {contact.name.split(' ')[0]}
                               </a>
                           ))}
                       </div>
                   </motion.div>
                )}
            </AnimatePresence>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50/90 backdrop-blur-sm border-b border-red-200 text-red-800 p-4 font-semibold text-sm flex items-center justify-center">
                <span className="mr-2">⚠️</span> {error}
              </div>
            )}

            {/* Chat/Content History Area */}
            <div className="flex-grow overflow-y-auto p-6 relative flex flex-col gap-6" aria-live="polite">
              {messages.map((msg, idx) => {
                const isSystem = msg.role === 'assistant';
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    key={idx} 
                    className={`flex ${!isSystem ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] px-6 py-4 rounded-2xl text-[17px] font-normal leading-relaxed shadow-sm ${
                        !isSystem 
                          ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-br-sm' 
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                );
              })}
              
              {/* Conditional Rendering: Visual Instruction Card and Map */}
              <AnimatePresence>
                 {triageConclusion && (
                   <motion.div 
                      key="conclusion"
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                      className="w-full flex flex-col items-center pt-6 pb-2"
                   >
                     <InstructionCard 
                        advice={triageConclusion.advice} 
                        urgencyLevel={triageConclusion.urgencyLevel} 
                     />
  
                     {/* CareMap Component */}
                     <div className="w-full mt-10">
                        <CareMap 
                          urgencyLevel={triageConclusion.urgencyLevel} 
                          userLocation={{ latitude: -1.286389, longitude: 36.817223 }} 
                        />
                     </div>
  
                     <button 
                       onClick={resetTriage}
                       className="mt-12 mb-8 px-10 py-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 text-lg focus:outline-none focus:ring-4 focus:ring-slate-300 w-full max-w-sm flex items-center justify-center gap-3"
                     >
                       <span>↺</span> Start New Triage
                     </button>
                   </motion.div>
                 )}
              </AnimatePresence>

              {/* Loading Indicator */}
              {isLoading && !triageConclusion && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-500 px-5 py-4 rounded-2xl rounded-bl-sm shadow-sm font-medium text-[15px] flex items-center space-x-2">
                    <span className="flex space-x-1">
                      <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                      <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </span>
                    <span className="ml-3">Assessing information...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form (Disabled if concluded) */}
            <form onSubmit={handleSendMessage} className="bg-white p-4 border-t border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
              <div className="flex gap-3 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isLoading || !!triageConclusion}
                  placeholder={triageConclusion ? "Assessment concluded." : "Describe the medical situation..."}
                  className="flex-grow px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[17px] focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:bg-white disabled:opacity-50 disabled:bg-slate-100 placeholder-slate-400 text-slate-800 transition-all"
                  aria-label="Message input"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim() || !!triageConclusion}
                  className="px-8 bg-teal-600 disabled:bg-slate-300 hover:bg-teal-500 text-white font-bold rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-teal-500/30 transition-all flex items-center justify-center shrink-0 disabled:text-slate-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
      </div>
    </div>
  );
};

export default TriageSession;
