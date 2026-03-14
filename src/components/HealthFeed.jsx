import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const feedItems = [
    {
        id: 1,
        title: "First Aid Basics",
        subtitle: "Burn Treatment & CPR",
        icon: "🔥",
        color: "from-orange-500 to-red-400",
        description: "Immediate response protocols for common injuries.",
        tags: ["#FirstAid", "#Emergency"],
        detailedSteps: [
            "Burns: Cool under cold running water for 10+ mins.",
            "Burns: Cover with sterile, non-fluffy dressing.",
            "CPR: Check for danger, response, and breathing.",
            "CPR: Perform 30 chest compressions to 2 rescue breaths."
        ]
    },
    {
        id: 2,
        title: "Cholera Prevention",
        subtitle: "Safe Water Protocol",
        icon: "💧",
        color: "from-blue-500 to-cyan-400",
        description: "Crucial steps to prevent acute diarrheal infections in urban settings.",
        tags: ["#Hygiene", "#Prevention", "#PublicHealth"],
        detailedSteps: [
            "Always boil drinking and cooking water vigorously for 1 minute.",
            "Use certified water purification tablets if boiling is impossible.",
            "Wash hands with soap under safe running water before eating.",
            "Avoid eating raw or undercooked foods from unregulated street vendors."
        ]
    },
    {
        id: 3,
        title: "Mental Health",
        subtitle: "Managing Stress in the City",
        icon: "🧠",
        color: "from-purple-500 to-indigo-400",
        description: "Nairobi's pace is fast. Mental wellbeing is just as critical as physical health.",
        tags: ["#MentalHealth", "#Wellness"],
        detailedSteps: [
            "Unplug: Dedicate 15 minutes daily strictly away from your phone and news.",
            "Community: Talk to a trusted friend or family member about your stressors.",
            "Movement: A simple 20-minute daily walk improves cognitive function.",
            "Professional Help: Seek clinical counseling if stress disrupts daily life."
        ]
    },
    {
        id: 4,
        title: "Malaria Awareness",
        subtitle: "Protect Your Family",
        icon: "🦟",
        color: "from-teal-500 to-emerald-400",
        description: "Effective strategies to combat the spread of Malaria.",
        tags: ["#Prevention", "#Epidemiology"],
        detailedSteps: [
            "Sleep under a long-lasting insecticidal net (LLIN) every night.",
            "Eliminate all stagnant water near your compound (tires, buckets).",
            "Use approved indoor residual spraying to kill adult mosquitoes.",
            "Seek immediate testing if you develop a severe, unexplained fever."
        ]
    },
    {
        id: 5,
        title: "Maternal Health",
        subtitle: "Prenatal Guidelines",
        icon: "🤱",
        color: "from-pink-500 to-rose-400",
        description: "Essential care steps for expectant mothers in Nairobi.",
        tags: ["#MaternalHealth", "#Prevention"],
        detailedSteps: [
            "Attend all recommended antenatal care (ANC) clinical visits.",
            "Ensure you are taking prescribed Folic Acid and Iron supplements.",
            "Plan your delivery route to a verified Level 4+ KMHFL facility.",
            "Drink plenty of safe water and adhere to a nutrient-dense diet."
        ]
    }
];

// Extract all unique tags to populate the quick-filter bar
const allTags = Array.from(new Set(feedItems.flatMap(item => item.tags)));

const HealthFeed = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTag, setActiveTag] = useState(null);

    // Filter engine
    const filteredItems = useMemo(() => {
        return feedItems.filter(item => {
            const matchesSearch = 
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.detailedSteps.some(step => step.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const matchesTag = activeTag ? item.tags.includes(activeTag) : true;

            return matchesSearch && matchesTag;
        });
    }, [searchQuery, activeTag]);

    return (
        <section className="mt-16 mb-8 w-full max-w-7xl mx-auto">
            {/* Health Hub Header & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 px-2">
                <div>
                    <h2 className="text-3xl font-extrabold text-teal-900 tracking-tight">Health Hub</h2>
                    <p className="text-slate-500 font-medium mt-1">Verified Nairobi localized health protocols & guides.</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-slate-300">🔍</span>
                    </div>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-100 placeholder-slate-400 text-slate-700 rounded-2xl focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all font-medium shadow-sm"
                        placeholder="Search for conditions, protocols..."
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 font-bold"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Quick Tag Filter Row */}
            <div className="flex flex-wrap gap-2 mb-8 px-2">
                <button 
                    onClick={() => setActiveTag(null)}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${!activeTag ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                    All Topics
                </button>
                {allTags.map(tag => (
                    <button 
                        key={tag}
                        onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors shadow-sm border ${activeTag === tag ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        {tag}
                    </button>
                ))}
            </div>
            
            {/* Vertical/Grid Article Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
                <AnimatePresence>
                    {filteredItems.map((item, index) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            key={item.id} 
                            className="bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden flex flex-col h-full group"
                        >
                            {/* Card Color Header */}
                            <div className={`h-3 w-full bg-gradient-to-r ${item.color}`}></div>
                            
                            <div className="p-6 flex-grow flex flex-col">
                                {/* Icon & Title */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-3xl shadow-sm bg-slate-50 border border-slate-100 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                        <span className="drop-shadow-sm">{item.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 leading-tight">{item.title}</h3>
                                        <h4 className="text-sm font-bold text-teal-600">{item.subtitle}</h4>
                                    </div>
                                </div>
                                
                                <p className="text-slate-600 text-sm font-medium mb-5">{item.description}</p>
                                
                                {/* Detailed Steps */}
                                <div className="bg-slate-50 rounded-2xl p-5 mb-6 flex-grow border border-slate-100/50">
                                    <h5 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">Protocol Steps</h5>
                                    <ul className="space-y-3">
                                        {item.detailedSteps.map((step, i) => (
                                            <li key={i} className="flex text-sm text-slate-700 leading-snug">
                                                <span className="mr-3 font-bold text-teal-500 shrink-0">{i + 1}.</span>
                                                <span>{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Tags Footer */}
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {item.tags.map(tag => (
                                        <button 
                                            key={tag}
                                            onClick={(e) => { e.stopPropagation(); setActiveTag(activeTag === tag ? null : tag); }}
                                            className={`text-xs font-bold px-2.5 py-1 rounded-md transition-colors ${activeTag === tag ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredItems.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                        <div className="text-5xl mb-4">🩺</div>
                        <h3 className="text-xl font-bold text-slate-700">No protocols found</h3>
                        <p className="text-slate-500 mt-2">Try adjusting your search or selecting a different tag.</p>
                        <button 
                            onClick={() => { setSearchQuery(''); setActiveTag(null); }}
                            className="mt-6 px-6 py-2.5 bg-teal-50 text-teal-700 font-bold rounded-xl hover:bg-teal-100 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default HealthFeed;
