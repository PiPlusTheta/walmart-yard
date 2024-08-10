import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Package, Truck, CheckCircle, Search } from 'lucide-react';

const WalmartTrailerPage = () => {
  const [activeTab, setActiveTab] = useState('incoming');
  const [trailerStatus, setTrailerStatus] = useState('free');

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-walmart-blue text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Walmart YMS - Trailer Operations</h1>
          <div className="flex items-center space-x-4">
            <span>Trailer ID: WM-1234</span>
            <button className="bg-white text-walmart-blue px-4 py-2 rounded-md hover:bg-blue-100 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'incoming'
                  ? 'bg-walmart-blue text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('incoming')}
            >
              Incoming Orders
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'past'
                  ? 'bg-walmart-blue text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('past')}
            >
              Past Orders
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'incoming' ? (
              <IncomingOrders trailerStatus={trailerStatus} setTrailerStatus={setTrailerStatus} />
            ) : (
              <PastOrders />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const IncomingOrders = ({ trailerStatus, setTrailerStatus }) => (
  <div>
    <div className="mb-6 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Incoming Orders</h2>
      <div className="flex items-center space-x-4">
        <span className="font-medium">Trailer Status:</span>
        <select
          value={trailerStatus}
          onChange={(e) => setTrailerStatus(e.target.value)}
          className="border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-walmart-blue"
        >
          <option value="free">Free</option>
          <option value="busy">Busy</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>
    </div>
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="border rounded-lg p-4 flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold">Order #{1000 + index}</h3>
            <p className="text-sm text-gray-600">Item ID: ITEM-{5000 + index}</p>
            <p className="text-sm text-gray-600">Rack Position: A-{index + 1}</p>
            <p className="text-sm text-gray-600">Quantity: {10 * (index + 1)}</p>
          </div>
          <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center">
            <CheckCircle size={18} className="mr-2" />
            Acknowledge
          </button>
        </motion.div>
      ))}
    </div>
  </div>
);

const PastOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Past Orders</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-walmart-blue"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">ORD-{2000 + index}</td>
                <td className="px-6 py-4 whitespace-nowrap">2024-07-{String(30 - index).padStart(2, '0')}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    index % 2 === 0 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {index % 2 === 0 ? 'Completed' : 'Processed'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{3 + index}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WalmartTrailerPage;