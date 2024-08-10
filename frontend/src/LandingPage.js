// src/LandingPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, BarChart2, Users, Box } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

 
  const features = [
    { icon: <Truck className="w-6 h-6" />, title: 'Real-time Tracking', description: 'Monitor your inventory and shipments in real-time.' },
    { icon: <BarChart2 className="w-6 h-6" />, title: 'Advanced Analytics', description: 'Gain insights with our powerful analytical tools.' },
    { icon: <Users className="w-6 h-6" />, title: 'Team Collaboration', description: 'Seamlessly work together with your warehouse team.' },
    { icon: <Box className="w-6 h-6" />, title: 'Inventory Management', description: 'Efficiently manage and optimize your inventory levels.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">WMS</h1>
          </div>
          <div>
            <button
              onClick={handleLogin}
              className="inline-flex items-center px-4 py-2 mr-2 border border-transparent text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150"
            >
              Login/SignUp
            </button>
            
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-grow flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-blue-50 opacity-80" />
        <div className="relative z-10 max-w-7xl mx-auto text-center px-6">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl leading-tight">
            Welcome to{' '}
            <span className="text-blue-600">Warehouse Management System</span>
          </h1>
          <p className="mt-6 text-lg text-gray-700 sm:text-xl md:text-2xl">
            Optimize your warehouse operations with ease and efficiency.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Unleash the Power of WMS
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-md bg-blue-500 text-white flex items-center justify-center">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; 2024 Warehouse Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
