import React from 'react';
import HealthFeed from './HealthFeed';

const Explore = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 px-4 w-full flex-grow">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Health Hub</h1>
      <HealthFeed />
    </div>
  );
};

export default Explore;
