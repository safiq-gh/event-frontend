import React, { useState } from 'react';
import EventRegistrationForm from './EventRegistrationForm.jsx';
import AdminDashboard from './AdminDashboard.jsx';

function App() {
  const [currentView, setCurrentView] = useState('register'); // 'register' or 'admin'
  const EVENT_ID = "123";

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {/* Navigation Tabs */}
      <div className="max-w-md mx-auto mb-6 flex justify-center space-x-4">
        <button
          onClick={() => setCurrentView('register')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            currentView === 'register' ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Registration Form
        </button>
        <button
          onClick={() => setCurrentView('admin')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            currentView === 'admin' ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Admin Dashboard
        </button>
      </div>

      {/* Render the selected view */}
      {currentView === 'register' ? (
        <EventRegistrationForm eventId={EVENT_ID} />
      ) : (
        <AdminDashboard eventId={EVENT_ID} />
      )}
    </div>
  );
}

export default App;