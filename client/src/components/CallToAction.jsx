import React from 'react';
import { Button } from 'flowbite-react';
import {FiArrowRight} from 'react-icons/fi'

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row bg-gradient-to-br from-purple-600 via-purple-500 to-purple-600 p-8 rounded-xl shadow-xl">
      <div className="flex-1 flex flex-col justify-center items-center sm:items-start">
        <h1 className="text-4xl font-bold text-white mb-4 sm:text-5xl sm:mb-6">Ready to dive into JavaScript?</h1>
        <p className="text-lg text-white mb-6">Explore our curated collection of 100 JavaScript projects and level up your skills!</p>
        <a href="https://www.google.com" target='_blank' rel="noopener noreferrer" className=" flex items-center  bg-white text-purple-600 hover:bg-purple-200 hover:text-purple-700 font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 ">Get Started{<FiArrowRight className="ml-2" />}</a>
      </div>
      <div className="p-6 flex-1 flex justify-center">
        <img src="https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg" alt="JavaScript" className="rounded-lg shadow-lg " />
      </div>
    </div>
  );
}



  
