import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, ClipboardList, Clock, CheckSquare, LogOut, Package, Info, List, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WalmartYardManagementSystem = () => {
  const [activeRole, setActiveRole] = useState('trailer');
  const [activePage, setActivePage] = useState('incoming');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (role) => {
    if (role === 'admin' && !isAuthenticated) {
      setShowPasswordModal(true);
    } else {
      setActiveRole(role);
      setActivePage(role === 'trailer' ? 'incoming' : 'trailerInfo');
    }
  };

  const handleLogin = (password) => {
    if (password === 'walmart123') {
      setIsAuthenticated(true);
      setShowPasswordModal(false);
      setActiveRole('admin');
      setActivePage('trailerInfo');
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-blue-50 to-blue-100">
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
                onClick={handleLogout}
              >
                <LogOut size={20} className="mr-2" /> Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeRole === 'trailer' ? (
            <TrailerDashboard activePage={activePage} setActivePage={setActivePage} />
          ) : (
            <AdminDashboard activePage={activePage} setActivePage={setActivePage} />
          )}
        </div>
      </main>

      {showPasswordModal && (
        <PasswordModal onLogin={handleLogin} onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};

const PasswordModal = ({ onLogin, onClose }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Enter Admin Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded mb-4"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </form>
      </div>
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
          <TabButton
            icon={List}
            label="Inventory"
            isActive={activePage === 'inventory'}
            onClick={() => setActivePage('inventory')}
          />
        </div>
      </div>

      {activePage === 'trailerInfo' ? (
        <TrailerInfo />
      ) : activePage === 'orderQueue' ? (
        <OrderQueue />
      ) : (
        <Inventory />
      )}
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
    { id: 4, orderNumber: 'WO-004', itemId: 'ITEM-101', rackPosition: 'D-05', quantity: 100, status: 'In Progress' },
  ]);

  const handleAcknowledge = (id) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: 'Acknowledged' } : order
    ));
  };

  const handleTrailerStatus = (status) => {
    console.log(`Trailer status updated to: ${status}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Incoming Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="border-b px-4 py-2 text-left">Order Number</th>
              <th className="border-b px-4 py-2 text-left">Item ID</th>
              <th className="border-b px-4 py-2 text-left">Rack Position</th>
              <th className="border-b px-4 py-2 text-left">Quantity</th>
              <th className="border-b px-4 py-2 text-left">Status</th>
              <th className="border-b px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className="border-b px-4 py-2">{order.orderNumber}</td>
                <td className="border-b px-4 py-2">{order.itemId}</td>
                <td className="border-b px-4 py-2">{order.rackPosition}</td>
                <td className="border-b px-4 py-2">{order.quantity}</td>
                <td className="border-b px-4 py-2">{order.status}</td>
                <td className="border-b px-4 py-2">
                  {order.status === 'Pending' && (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleAcknowledge(order.id)}
                    >
                      Acknowledge
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Trailer Status</h3>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mr-4 hover:bg-green-600"
          onClick={() => handleTrailerStatus('Active')}
        >
          Set Active
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={() => handleTrailerStatus('Inactive')}
        >
          Set Inactive
        </button>
      </div>
    </div>
  );
};

const PastOrders = () => {
  const [pastOrders, setPastOrders] = useState([
    { id: 1, orderNumber: 'WO-005', itemId: 'ITEM-102', rackPosition: 'E-07', quantity: 20, status: 'Completed', date: '2024-08-01' },
    { id: 2, orderNumber: 'WO-006', itemId: 'ITEM-103', rackPosition: 'F-08', quantity: 15, status: 'Completed', date: '2024-08-02' },
    { id: 3, orderNumber: 'WO-007', itemId: 'ITEM-104', rackPosition: 'G-09', quantity: 40, status: 'Completed', date: '2024-08-03' },
    { id: 4, orderNumber: 'WO-008', itemId: 'ITEM-105', rackPosition: 'H-10', quantity: 60, status: 'Completed', date: '2024-08-04' },
  ]);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Past Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-200">
            <tr>
              <th className="px-4 py-2 text-left">Order Number</th>
              <th className="px-4 py-2 text-left">Item ID</th>
              <th className="px-4 py-2 text-left">Rack Position</th>
              <th className="px-4 py-2 text-right">Quantity</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {pastOrders.map(order => (
              <tr key={order.id} className="border-b">
                <td className="px-4 py-2">{order.orderNumber}</td>
                <td className="px-4 py-2">{order.itemId}</td>
                <td className="px-4 py-2">{order.rackPosition}</td>
                <td className="px-4 py-2 text-right">{order.quantity}</td>
                <td className="px-4 py-2">{order.date}</td>
                <td className="px-4 py-2 text-center">
                  <span className={`px-2 py-1 rounded-full text-sm bg-green-200 text-green-800`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TrailerInfo = () => {
  const [trailers, setTrailers] = useState([
    { id: 1, trailerId: 'TR-001', status: 'Working', lastChecked: '2024-08-01' },
    { id: 2, trailerId: 'TR-002', status: 'Idle', lastChecked: '2024-08-02' },
    { id: 3, trailerId: 'TR-003', status: 'Out of Service', lastChecked: '2024-08-03' },
  ]);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Trailer Information</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-200">
            <tr>
              <th className="px-4 py-2 text-left">Trailer ID</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Last Checked</th>
            </tr>
          </thead>
          <tbody>
            {trailers.map(trailer => (
              <tr key={trailer.id} className="border-b">
                <td className="px-4 py-2">{trailer.trailerId}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    trailer.status === 'Working' ? 'bg-green-200 text-green-800' :
                    trailer.status === 'Idle' ? 'bg-blue-200 text-blue-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {trailer.status}
                  </span>
                </td>
                <td className="px-4 py-2">{trailer.lastChecked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OrderQueue = () => {
  const [orderQueue, setOrderQueue] = useState([
    { id: 1, orderNumber: 'WO-009', itemId: 'ITEM-106', priority: 'High', estimatedTime: '30 mins' },
    { id: 2, orderNumber: 'WO-010', itemId: 'ITEM-107', priority: 'Medium', estimatedTime: '1 hour' },
    { id: 3, orderNumber: 'WO-011', itemId: 'ITEM-108', priority: 'Low', estimatedTime: '2 hours' },
  ]);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Order Queue</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-200">
            <tr>
              <th className="px-4 py-2 text-left">Order Number</th>
              <th className="px-4 py-2 text-left">Item ID</th>
              <th className="px-4 py-2 text-left">Priority</th>
              <th className="px-4 py-2 text-left">Estimated Time</th>
            </tr>
          </thead>
          <tbody>
            {orderQueue.map(order => (
              <tr key={order.id} className="border-b">
                <td className="px-4 py-2">{order.orderNumber}</td>
                <td className="px-4 py-2">{order.itemId}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    order.priority === 'High' ? 'bg-red-200 text-red-800' :
                    order.priority === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-green-200 text-green-800'
                  }`}>
                    {order.priority}
                  </span>
                </td>
                <td className="px-4 py-2">{order.estimatedTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Inventory = () => {
  const [inventory, setInventory] = useState([
    { id: 1, itemId: 'ITEM-109', itemName: 'Widget A', stock: 120, location: 'Warehouse 1' },
    { id: 2, itemId: 'ITEM-110', itemName: 'Widget B', stock: 80, location: 'Warehouse 2' },
    { id: 3, itemId: 'ITEM-111', itemName: 'Widget C', stock: 60, location: 'Warehouse 3' },
  ]);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">Inventory</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-200">
            <tr>
              <th className="px-4 py-2 text-left">Item ID</th>
              <th className="px-4 py-2 text-left">Item Name</th>
              <th className="px-4 py-2 text-right">Stock</th>
              <th className="px-4 py-2 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2">{item.itemId}</td>
                <td className="px-4 py-2">{item.itemName}</td>
                <td className="px-4 py-2 text-right">{item.stock}</td>
                <td className="px-4 py-2">{item.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WalmartYardManagementSystem;

