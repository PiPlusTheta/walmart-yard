import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

// Define Walmart theme colors
const colors = {
  walmartBlue: '#0071CE',
  walmartGreen: '#4CAF50',
  walmartGreenDark: '#388E3C',
  walmartGreenLight: '#C8E6C9',
  walmartBlueLight: '#E3F2FD',
  walmartBlueDark: '#004B87',
  white: '#FFFFFF',
  gray: {
    100: '#F7F7F7',
    200: '#E0E0E0',
    400: '#B0B0B0',
    600: '#6D6D6D',
  },
};

const WalmartTrailerPage = () => {
  const [activeTab, setActiveTab] = useState('incoming');
  const [trailerStatus, setTrailerStatus] = useState('free');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogout = () => {
    // Add your logout logic here (e.g., clear session, call API)
    navigate('/'); // Redirect to the landing page
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.gray[100] }}>
      <header style={{ backgroundColor: colors.walmartBlue, color: colors.white, padding: '1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Walmart YMS - Trailer Operations</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>Trailer ID: WM-1234</span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: colors.white,
                color: colors.walmartBlue,
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.gray[200]}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.white}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '2rem auto' }}>
        <div style={{ backgroundColor: colors.white, borderRadius: '0.375rem', boxShadow: '0 0 0.5rem rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: `1px solid ${colors.gray[200]}` }}>
            <button
              style={{
                flex: 1,
                padding: '1rem 1.5rem',
                textAlign: 'center',
                fontWeight: '500',
                backgroundColor: activeTab === 'incoming' ? colors.walmartBlue : colors.white,
                color: activeTab === 'incoming' ? colors.white : colors.gray[600],
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onClick={() => setActiveTab('incoming')}
            >
              Incoming Orders
            </button>
            <button
              style={{
                flex: 1,
                padding: '1rem 1.5rem',
                textAlign: 'center',
                fontWeight: '500',
                backgroundColor: activeTab === 'past' ? colors.walmartBlue : colors.white,
                color: activeTab === 'past' ? colors.white : colors.gray[600],
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onClick={() => setActiveTab('past')}
            >
              Past Orders
            </button>
          </div>

          <div style={{ padding: '1.5rem' }}>
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
    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Incoming Orders</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontWeight: '500' }}>Trailer Status:</span>
        <select
          value={trailerStatus}
          onChange={(e) => setTrailerStatus(e.target.value)}
          style={{
            border: `1px solid ${colors.gray[200]}`,
            borderRadius: '0.375rem',
            padding: '0.25rem 0.5rem',
            outline: 'none',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
          }}
        >
          <option value="free">Free</option>
          <option value="busy">Busy</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          style={{
            border: `1px solid ${colors.gray[200]}`,
            borderRadius: '0.375rem',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h3 style={{ fontWeight: '600' }}>Order #{1000 + index}</h3>
            <p style={{ fontSize: '0.875rem', color: colors.gray[600] }}>Item ID: ITEM-{5000 + index}</p>
            <p style={{ fontSize: '0.875rem', color: colors.gray[600] }}>Rack Position: A-{index + 1}</p>
            <p style={{ fontSize: '0.875rem', color: colors.gray[600] }}>Quantity: {10 * (index + 1)}</p>
          </div>
          <button
            style={{
              backgroundColor: colors.walmartGreen,
              color: colors.white,
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.walmartGreenDark}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.walmartGreen}
          >
            <CheckCircle size={18} style={{ marginRight: '0.5rem' }} />
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
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Past Orders</h2>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: `1px solid ${colors.gray[200]}`,
              borderRadius: '0.375rem',
              padding: '0.5rem 1rem 0.5rem 2rem',
              outline: 'none',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
            }}
          />
          <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: colors.gray[400] }} size={18} />
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: colors.gray[200] }}>
            <tr>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: colors.gray[600], textTransform: 'uppercase' }}>Order ID</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: colors.gray[600], textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: colors.gray[600], textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: colors.gray[600], textTransform: 'uppercase' }}>Items</th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: colors.white }}>
            {[...Array(5)].map((_, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                style={{ borderBottom: `1px solid ${colors.gray[200]}` }}
              >
                <td style={{ padding: '0.75rem 1rem' }}>ORD-{2000 + index}</td>
                <td style={{ padding: '0.75rem 1rem' }}>2024-07-{String(30 - index).padStart(2, '0')}</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    borderRadius: '0.375rem',
                    backgroundColor: index % 2 === 0 ? colors.walmartGreenLight : colors.walmartBlueLight,
                    color: index % 2 === 0 ? colors.walmartGreen : colors.walmartBlueDark,
                  }}>
                    {index % 2 === 0 ? 'Completed' : 'Processed'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>{3 + index}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WalmartTrailerPage;
