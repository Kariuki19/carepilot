import React from 'react';
import HealthFeed from './HealthFeed';

const Explore = () => {
  const topics = ['#MalariaPrevention', '#MaternalHealth', '#FirstAid', '#MentalWellness'];

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 px-4 w-full flex-grow">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Health Hub</h1>
      
      {/* Trending Topics Scroll */}
      <div className="flex overflow-x-auto gap-3 pb-4 mb-4" style={{ scrollbarWidth: 'none' }}>
        {topics.map(topic => (
          <button key={topic} className="px-5 py-2.5 bg-white/70 backdrop-blur-md rounded-full border border-teal-200 text-teal-800 font-bold text-sm whitespace-nowrap shadow-sm hover:bg-teal-50 hover:border-teal-300 transition-all">
            {topic}
          </button>
        ))}
      </div>

      <HealthFeed />
    </div>
  );
};

export default Explore;
