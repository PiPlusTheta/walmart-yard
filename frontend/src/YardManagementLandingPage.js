import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, ClipboardList, Clock, CheckSquare, LogOut, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const WalmartYardManagementSystem = () => {
  const [activeRole, setActiveRole] = useState('trailer');
  const [activePage, setActivePage] = useState('incoming');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setActivePage(role === 'trailer' ? 'incoming' : 'trailerInfo');
  };

  const handleLogout = () => {
    // Clear user session or authentication tokens here
    // Example: localStorage.removeItem('authToken');

    // Redirect to the login page
    navigate('/login');
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Navigation */}
      <nav className="bg-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Truck size={24} />
              <span className="text-2xl font-bold">Walmart YMS</span>
            </div>
            <div className="flex items-center space-x-6">
              <button
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeRole === 'trailer' ? 'bg-blue-600' : 'hover:bg-blue-700'
                }`}
                onClick={() => handleRoleChange('trailer')}
              >
                Trailer
              </button>
              <button
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeRole === 'admin' ? 'bg-blue-600' : 'hover:bg-blue-700'
                }`}
                onClick={() => handleRoleChange('admin')}
              >
                Admin
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-700 transition-colors flex items-center"
                onClick={handleLogout} // Add onClick handler for logout
              >
                <LogOut size={20} className="mr-2" /> Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Role-specific content */}
          {activeRole === 'trailer' ? (
            <TrailerDashboard activePage={activePage} setActivePage={setActivePage} />
          ) : (
            <AdminDashboard activePage={activePage} setActivePage={setActivePage} />
          )}
        </div>
      </main>
    </div>
  );
};



const TrailerDashboard = ({ activePage, setActivePage }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Trailer Dashboard</h1>
        <div className="flex space-x-4">
          <TabButton
            icon={ClipboardList}
            label="Incoming Orders"
            isActive={activePage === 'incoming'}
            onClick={() => setActivePage('incoming')}
          />
          <TabButton
            icon={Clock}
            label="Past Orders"
            isActive={activePage === 'past'}
            onClick={() => setActivePage('past')}
          />
        </div>
      </div>

      {activePage === 'incoming' ? <IncomingOrders /> : <PastOrders />}
    </>
  );
};

const AdminDashboard = ({ activePage, setActivePage }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <TabButton
            icon={Truck}
            label="Trailer Info"
            isActive={activePage === 'trailerInfo'}
            onClick={() => setActivePage('trailerInfo')}
          />
          <TabButton
            icon={Package}
            label="Order Queue"
            isActive={activePage === 'orderQueue'}
            onClick={() => setActivePage('orderQueue')}
          />
        </div>
      </div>

      {activePage === 'trailerInfo' ? <TrailerInfo /> : <OrderQueue />}
    </>
  );
};

const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
      isActive ? 'bg-blue-700 text-white' : 'bg-blue-200 text-blue-800 hover:bg-blue-300'
    }`}
    onClick={onClick}
  >
    <Icon size={20} className="mr-2" />
    {label}
  </motion.button>
);

const IncomingOrders = () => {
  const [orders, setOrders] = useState([
    { id: 1, orderNumber: 'WO-001', itemId: 'ITEM-123', rackPosition: 'A-01', quantity: 50, status: 'Pending' },
    { id: 2, orderNumber: 'WO-002', itemId: 'ITEM-456', rackPosition: 'B-03', quantity: 30, status: 'In Progress' },
    { id: 3, orderNumber: 'WO-003', itemId: 'ITEM-789', rackPosition: 'C-02', quantity: 75, status: 'Pending' },
  ]);

  const handleAcknowledge = (id) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: 'Acknowledged' } : order
    ));
  };

  const handleTrailerStatus = (status) => {
    console.log(`Trailer status updated to: ${status}`);
    // Here you would typically update the status in your backend
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Incoming Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-200">
            <tr>
              <th className="px-4 py-2 text-left">Order Number</th>
              <th className="px-4 py-2 text-left">Item ID</th>
              <th className="px-4 py-2 text-left">Rack Position</th>
              <th className="px-4 py-2 text-right">Quantity</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b">
                <td className="px-4 py-2">{order.orderNumber}</td>
                <td className="px-4 py-2">{order.itemId}</td>
                <td className="px-4 py-2">{order.rackPosition}</td>
                <td className="px-4 py-2 text-right">{order.quantity}</td>
                <td className="px-4 py-2 text-center">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    order.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' :
                    order.status === 'In Progress' ? 'bg-blue-200 text-blue-800' :
                    'bg-green-200 text-green-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  {order.status !== 'Acknowledged' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors"
                      onClick={() => handleAcknowledge(order.id)}
                    >
                      <CheckSquare size={16} className="inline mr-1" /> Acknowledge
                    </motion.button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-blue-800 mb-2">Trailer Status</h3>
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            onClick={() => handleTrailerStatus('Working')}
          >
            Working
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => handleTrailerStatus('Idle')}
          >
            Idle
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            onClick={() => handleTrailerStatus('Out of Service')}
          >
            Out of Service
          </motion.button>
        </div>
      </div>
    </div>
  );
};

const PastOrders = () => {
  // Placeholder for past orders content
  return <div>Past Orders Content</div>;
};

const TrailerInfo = () => {
  // Placeholder for trailer info content
  return <div>Trailer Info Content</div>;
};

const OrderQueue = () => {
  // Placeholder for order queue content
  return <div>Order Queue Content</div>;
};

export default WalmartYardManagementSystem;
