import React from 'react';

  
export default function CallToAction() {

  return (

    <div className="flex flex-col  sm:flex-row bg-gray-900 text-white rounded-xl shadow-xl p-8 border border-gray-800">

      <div className="p-6 flex-1 flex justify-center">

        <img src="https://cdn.mos.cms.futurecdn.net/rLh7Dh7EKo8F6zmDtXYp8W-1200-80.jpg" alt="Cyberpunk Gaming" className="rounded-lg shadow-lg w-full sm:w-auto" />

      </div>

      <div className="flex-1 flex flex-col justify-center items-center sm:items-start">

        <h1 className="text-4xl font-bold mb-4 sm:text-5xl sm:mb-6">Dive into the Cyberpunk World</h1>

        <p className="text-lg mb-6">Experience the neon-lit streets and high-tech adventures in our cyberpunk gaming universe!</p>

        <a href="https://www.google.com" target='_blank' rel="noopener noreferrer" className="inline-block bg-blue-500 text-white hover:bg-blue-600 font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">Explore Now</a>

      </div>

    </div>

  );

}
